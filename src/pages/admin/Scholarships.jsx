import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import AdminLayout from '../../components/admin/AdminLayout'
import { 
  Search, Filter, Download, GraduationCap, TrendingUp, Calendar, 
  Clock, CheckCircle, XCircle, AlertCircle, ChevronLeft, ChevronRight,
  Sparkles
} from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'

export default function AdminScholarships() {
  const { user, profile } = useAuth()
  const { t, language } = useLanguage()
  const [apps, setApps] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  async function fetchApps() {
    setLoading(true)
    const { data } = await supabase.from('scholarship_applications')
      .select('*, profiles(full_name, email), scholarship_programs(name, amount)')
      .order('created_at', { ascending: false })
    setApps(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchApps() }, [])

  const handleStatusUpdate = async (appId, newStatus) => {
    if (!appId) return
    try {
      const { data: currentApp } = await supabase
        .from('scholarship_applications')
        .select('*, profiles(email, full_name, phone)')
        .eq('id', appId)
        .single()

      const { error } = await supabase
        .from('scholarship_applications')
        .update({ status: newStatus })
        .eq('id', appId)

      if (error) throw error

      if (user) {
        await supabase.from('system_logs').insert([{
          admin_id: user.id,
          action: `scholarship_${newStatus}`,
          entity_type: 'scholarship',
          entity_id: appId,
          metadata: { status: newStatus }
        }])
      }

      // Trigger automatic notification via Edge Function
      if (currentApp?.profiles?.email || currentApp?.profiles?.phone) {
        const message = newStatus === 'approved' 
          ? `Congratulations ${currentApp.profiles.full_name}! Your scholarship application ${currentApp.application_number} has been APPROVED.`
          : `Dear ${currentApp.profiles.full_name}, we regret to inform you that your scholarship application ${currentApp.application_number} has been REJECTED.`;
        
        await supabase.functions.invoke('send-broadcast', {
          body: {
            recipients: [{ 
              email: currentApp.profiles.email, 
              phone: currentApp.profiles.phone, 
              name: currentApp.profiles.full_name 
            }],
            message: message,
            channels: ['email', 'sms']
          }
        })
      }

      alert(t(`Status updated to ${newStatus.toUpperCase()}`))
      fetchApps()
    } catch (err) {
      console.error('Error updating status:', err)
      alert(t('Error updating status: ') + (err.message || 'Unknown error'))
    }
  }


  // Mock data
  const mockApps = [
    { score: 98, name: 'Aditi Sharma', id: '#APP-89021', income: '₹ 1,20,000', marks: '96.4%', category: 'GENERAL', district: 'Lucknow', status: t('AUTO-SCORED'), statusType: 'success' },
    { score: 85, name: 'Rahul Verma', id: '#APP-89025', income: '₹ 95,000', marks: '88.2%', category: 'OBC', district: 'Kanpur', status: t('PENDING REVIEW'), statusType: 'warning' },
    { score: 72, name: 'Priya Singh', id: '#APP-89030', income: '₹ 2,10,000', marks: '91.0%', category: 'EWS', district: 'Varanasi', status: t('AWAITING L2'), statusType: 'info' },
    { score: 45, name: 'Mohd. Faisal', id: '#APP-89042', income: '₹ 4,50,000', marks: '72.5%', category: 'MINORITY', district: 'Agra', status: t('PENDING REVIEW'), statusType: 'warning' },
  ]

  const calculateScore = (app) => {
    let score = 40; // Base score
    const income = app.annual_income || 0;
    const marks = app.marks_percentage || 0;
    
    if (income < 100000) score += 30;
    else if (income < 200000) score += 15;
    
    if (marks > 90) score += 20;
    else if (marks > 80) score += 10;
    
    if (app.district === 'Dumka' || app.district === 'Deoghar') score += 10; // Priority districts
    
    return Math.min(score, 100);
  }

  const displayApps = apps.map(a => {
    const info = a.personal_info || {}
    return {
      id_actual: a.id,
      score: calculateScore(a),
      name: info.full_name || a.profiles?.full_name || 'Unknown',
      id: a.application_number || '#APP-000',
      income: `₹ ${Number(info.annual_income || 0).toLocaleString(language === 'hi' ? 'hi-IN' : 'en-IN')}`,
      marks: `${info.previous_marks || '0'}%`,
      category: a.category || 'General',
      district: a.district || 'N/A',
      status: t(a.status?.toUpperCase().replace('_', ' ') || 'SUBMITTED'),
      statusType: a.status === 'approved' ? 'success' : a.status === 'pending' ? 'warning' : 'info'
    }
  })

  const handleExport = () => {
    const headers = [
      'Beneficiary Name', 
      'Account Number', 
      'IFSC Code', 
      'Amount', 
      'Remarks',
      'App ID',
      'District'
    ];
    
    const rows = apps.map(a => {
      const bank = a.bank_details || {}
      const info = a.personal_info || {}
      return [
        bank.account_holder_name || info.full_name || a.profiles?.full_name || 'N/A',
        bank.account_number || 'N/A',
        bank.ifsc_code || 'N/A',
        a.scholarship_programs?.amount || 0,
        `DVS Scholarship - ${a.application_number}`,
        a.application_number,
        a.district
      ]
    });

    const csvContent = [headers, ...rows].map(e => e.map(val => `"${val}"`).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `DVS_NEFT_BATCH_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <AdminLayout title={t("Scholarships")} adminInfo={profile}>
      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
        {/* Main Content */}
        <div style={{ flex: 1 }}>
          <div style={{ marginBottom: 32 }}>
            <h1 className="hindi" style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111', marginBottom: 8 }}>{t('Scholarship Management')}</h1>
            <p className="hindi" style={{ color: '#6b7280', fontSize: '0.9rem' }}>
              {t('Smart Application Scoring (AI) active. Applications are prioritized based on socio-economic markers and academic excellence.')}
            </p>
          </div>

          {/* AI Banner */}
          <div style={{ background: '#fff7ed', border: '1px solid #ffedd5', borderRadius: 12, padding: '16px 20px', marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 32, height: 32, background: 'white', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#A1401D' }}>
                <Sparkles size={18} />
              </div>
              <div className="hindi" style={{ fontSize: '0.88rem', color: '#A1401D', fontWeight: 600 }}>
                12 {t('auto-processed today by A3 engine')}
                <span className="hindi" style={{ fontSize: '0.75rem', fontWeight: 400, color: '#fb923c', marginLeft: 8 }}>{t('Last update:')} 14 {t('minutes ago')}. {t('Current queue efficiency:')} 94%</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
               <button 
                 onClick={() => {
                   alert(t('Processing...'))
                   setTimeout(() => alert(t('AI Model v3.2') + ': ' + t('Recalculation Complete')), 1500)
                 }}
                 className="hindi" 
                 style={{ background: '#A1401D', border: 'none', color: 'white', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', padding: '6px 14px', borderRadius: 6 }}
               >
                 {t('Recalculate AI Score')}
               </button>
               <button className="hindi" style={{ background: 'none', border: 'none', color: '#A1401D', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>{t('View Analytics')}</button>
            </div>
          </div>

          {/* Filters & Actions */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span className="hindi" style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: 1, color: '#6b7280', textTransform: 'uppercase' }}>{t('Quick Filters')}</span>
              <div style={{ display: 'flex', gap: 8 }}>
                <select className="hindi" style={{ padding: '6px 12px', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: '0.8rem', outline: 'none', background: 'white' }}>
                  <option>{t('Income Band: All')}</option>
                </select>
                <select className="hindi" style={{ padding: '6px 12px', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: '0.8rem', outline: 'none', background: 'white' }}>
                  <option>{t('Performance: High to Low')}</option>
                </select>
                <button 
                  onClick={handleExport}
                  className="hindi" 
                  style={{ padding: '6px 12px', background: 'white', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: '0.8rem', fontWeight: 600, color: '#475569', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}
                >
                  <Download size={14} /> {t('Export')}
                </button>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span className="hindi" style={{ fontSize: '0.75rem', color: '#9ca3af', background: '#f8fafc', padding: '4px 10px', borderRadius: 8 }}>{t('Awaiting L2:')} 43</span>
              <span className="hindi" style={{ fontSize: '0.75rem', color: '#9ca3af', background: '#f8fafc', padding: '4px 10px', borderRadius: 8 }}>{t('PENDING')}: 156</span>
            </div>
          </div>

          {/* Table Area */}
          <div style={{ background: 'white', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #f1f5f9', background: '#f8fafc' }}>
                  <th className="hindi" style={{ padding: '16px 20px', fontSize: '0.65rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>{t('Smart Score')}</th>
                  <th className="hindi" style={{ padding: '16px 20px', fontSize: '0.65rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>{t('Applicant Name')}</th>
                  <th className="hindi" style={{ padding: '16px 20px', fontSize: '0.65rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>{t('Annual Income')}</th>
                  <th className="hindi" style={{ padding: '16px 20px', fontSize: '0.65rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>{t('Marks %')}</th>
                  <th className="hindi" style={{ padding: '16px 20px', fontSize: '0.65rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>{t('Category')}</th>
                  <th className="hindi" style={{ padding: '16px 20px', fontSize: '0.65rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>{t('District')}</th>
                  <th className="hindi" style={{ padding: '16px 20px', fontSize: '0.65rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>{t('Status')}</th>
                  <th className="hindi" style={{ padding: '16px 20px', fontSize: '0.65rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>{t('Actions')}</th>
                </tr>
              </thead>
              <tbody>
                {displayApps.map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  {/* ... previous TDS ... */}
                  <td style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontWeight: 800, color: (row.score || 75) > 80 ? '#10b981' : (row.score || 75) > 50 ? '#f59e0b' : '#94a3b8', fontSize: '1rem', width: 24 }}>{row.score || 75}</span>
                      <div style={{ flex: 1, height: 4, background: '#e2e8f0', borderRadius: 4, minWidth: 60 }}>
                        <div style={{ height: '100%', width: `${row.score || 75}%`, background: (row.score || 75) > 80 ? '#10b981' : (row.score || 75) > 50 ? '#f59e0b' : '#94a3b8', borderRadius: 4 }}></div>
                      </div>
                    </div>
                  </td>
                    <td style={{ padding: '20px' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#111' }}>{row.name}</div>
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: 2 }}>{row.id}</div>
                    </td>
                    <td style={{ padding: '20px', fontSize: '0.85rem', fontWeight: 500, color: '#334155' }}>{row.income}</td>
                    <td style={{ padding: '20px', fontSize: '0.85rem', fontWeight: 600, color: '#111' }}>{row.marks}</td>
                    <td style={{ padding: '20px' }}>
                      <span className="hindi" style={{ fontSize: '0.65rem', fontWeight: 700, padding: '3px 8px', background: '#fff7ed', color: '#A1401D', borderRadius: 4 }}>{t(row.category)}</span>
                    </td>
                    <td style={{ padding: '20px', fontSize: '0.85rem', color: '#64748b' }}>{t(row.district)}</td>
                    <td style={{ padding: '20px' }}>
                      <span className="hindi" style={{ 
                        fontSize: '0.65rem', fontWeight: 700, padding: '4px 10px', borderRadius: 20,
                        background: row.statusType === 'success' ? '#f0fdf4' : row.statusType === 'warning' ? '#fffbeb' : '#f8fafc',
                        color: row.statusType === 'success' ? '#16a34a' : row.statusType === 'warning' ? '#d97706' : '#64748b',
                        border: `1px solid ${row.statusType === 'success' ? '#dcfce7' : row.statusType === 'warning' ? '#fef3c7' : '#f1f5f9'}`
                      }}>
                        {t(row.status)}
                      </span>
                    </td>
                    <td style={{ padding: '20px' }}>
                       <div style={{ display: 'flex', gap: 8 }}>
                          {/* L1 & L2 can Approve/Reject */}
                          {['L1', 'L2'].includes(profile?.management_level || 'L1') ? (
                            <>
                              <button 
                                onClick={() => handleStatusUpdate(row.id_actual, 'approved')}
                                className="btn btn-sm btn-success hindi" 
                                style={{ fontSize: '0.65rem' }}
                              >
                                {t('Approve')}
                              </button>
                              <button 
                                onClick={() => handleStatusUpdate(row.id_actual, 'rejected')}
                                className="btn btn-sm btn-danger hindi" 
                                style={{ fontSize: '0.65rem' }}
                              >
                                {t('Reject')}
                              </button>
                            </>
                          ) : (
                            /* L3a can only Review/Notes */
                            <button className="btn btn-sm btn-secondary hindi" style={{ fontSize: '0.65rem' }}>{t('Add Notes')}</button>
                          )}
                          <button style={{ padding: '4px', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><Eye size={14} /></button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {/* Pagination */}
            <div style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9' }}>
               <span className="hindi" style={{ fontSize: '0.8rem', color: '#64748b' }}>{t('Showing')} 1 {t('to')} 4 {t('of')} 432 {t('applications')}</span>
               <div style={{ display: 'flex', gap: 6 }}>
                  <button style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid #e2e8f0', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><ChevronLeft size={16} /></button>
                  {[1, 2, 3].map(p => (
                    <button key={p} style={{ width: 32, height: 32, borderRadius: 8, border: p === 1 ? 'none' : '1px solid #e2e8f0', background: p === 1 ? '#A1401D' : 'white', color: p === 1 ? 'white' : '#64748b', fontWeight: p === 1 ? 700 : 500, fontSize: '0.8rem', cursor: 'pointer' }}>{p}</button>
                  ))}
                  <button style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid #e2e8f0', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><ChevronRight size={16} /></button>
               </div>
            </div>
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div style={{ width: 320, display: 'flex', flexDirection: 'column', gap: 20, marginTop: 100 }}>
          <div style={{ background: 'white', borderRadius: 12, padding: 24, border: '1px solid #e2e8f0' }}>
            <h3 className="hindi" style={{ fontSize: '1rem', fontWeight: 700, color: '#111', marginBottom: 6 }}>{t('Scoring Distribution')}</h3>
            <p className="hindi" style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: 20 }}>{t('Real-time application density')}</p>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', height: 100, marginBottom: 24 }}>
              {[30, 45, 60, 90, 40, 55, 30].map((h, i) => (
                <div key={i} style={{ flex: 1, background: i === 3 ? '#A1401D' : '#fff7ed', borderRadius: '4px 4px 0 0', height: `${h}%` }}></div>
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: 12, borderRadius: 8 }}>
                <span className="hindi" style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569' }}>{t('High Impact (90+)')}</span>
                <span style={{ fontSize: '1rem', fontWeight: 800, color: '#A1401D' }}>12</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: 12, borderRadius: 8 }}>
                <span className="hindi" style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569' }}>{t('Economic Need Focus')}</span>
                <span style={{ fontSize: '1rem', fontWeight: 800, color: '#A1401D' }}>84</span>
              </div>
            </div>
          </div>

          <div style={{ background: '#A1401D', borderRadius: 12, padding: 24, color: 'white' }}>
            <div className="hindi" style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4, opacity: 0.8 }}>{t('Upcoming Milestone')}</div>
            <h3 className="hindi" style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: 20, lineHeight: 1.2 }}>{t('Batch #12 Disbursement')}</h3>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, marginBottom: 4 }}>₹ 14.2L</div>
            <div className="hindi" style={{ fontSize: '0.75rem', opacity: 0.8, marginBottom: 24 }}>{t('Target date:')} Oct 24, 2024</div>
            <button className="hindi" style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 8, color: 'white', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}>{t('Manage Schedule')}</button>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
