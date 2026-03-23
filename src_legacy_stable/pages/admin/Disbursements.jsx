import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import AdminLayout from '../../components/admin/AdminLayout'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/LanguageContext'
import { 
  Search, Filter, Download, CreditCard, Banknote, 
  Smartphone, Clock, CheckCircle, ChevronLeft, ChevronRight,
  TrendingUp, ArrowUpRight
} from 'lucide-react'

export default function Disbursements() {
  const { profile } = useAuth()
  const { t, language } = useLanguage()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterMethod, setFilterMethod] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  async function fetchDisbursements() {
    setLoading(true)
    let query = supabase
      .from('disbursements')
      .select('*, scholarship_applications(application_number, personal_info)')
      .order('date', { ascending: false })

    if (filterMethod !== 'all') query = query.eq('method', filterMethod)
    if (filterStatus !== 'all') query = query.eq('status', filterStatus)

    const { data: res, error } = await query
    if (error) console.error('Error fetching disbursements:', error)
    else setData(res || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchDisbursements()
  }, [filterMethod, filterStatus])

  const handleUpdateStatus = async (id, newStatus) => {
    const { error } = await supabase
      .from('disbursements')
      .update({ status: newStatus })
      .eq('id', id)

    if (error) alert(t('Error updating status'))
    else fetchDisbursements()
  }

  const getMethodIcon = (method) => {
    switch (method?.toLowerCase()) {
      case 'bank': return <CreditCard size={14} />
      case 'cash': return <Banknote size={14} />
      case 'upi': return <Smartphone size={14} />
      default: return null
    }
  }

  const stats = [
    { label: t('Total Disbursed'), value: `₹${data.reduce((sum, d) => sum + (d.amount || 0), 0).toLocaleString()}`, icon: <TrendingUp size={20} />, color: '#10B981' },
    { label: t('Pending'), value: data.filter(d => d.status === 'pending').length, icon: <Clock size={20} />, color: '#F59E0B' },
    { label: t('Completed'), value: data.filter(d => d.status === 'completed').length, icon: <CheckCircle size={20} />, color: '#10B981' },
  ]

  return (
    <AdminLayout title={t("Disbursements")} adminInfo={profile}>
      <div style={{ marginBottom: 32 }}>
        <h1 className="hindi" style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111', marginBottom: 8 }}>{t('Disbursement Management')}</h1>
        <p className="hindi" style={{ color: '#6b7280', fontSize: '0.9rem' }}>{t('Track and manage scholarship payouts to students.')}</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 20, marginBottom: 32 }}>
         {stats.map((s, i) => (
           <div key={i} style={{ flex: 1, background: 'white', padding: 24, borderRadius: 16, border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 20 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: `${s.color}15`, color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{s.icon}</div>
              <div>
                 <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>{s.label}</div>
                 <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111' }}>{s.value}</div>
              </div>
           </div>
         ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 12 }}>
           <select 
             value={filterMethod} 
             onChange={e => setFilterMethod(e.target.value)}
             style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #e2e8f0', background: 'white', fontSize: '0.85rem', outline: 'none' }}
           >
              <option value="all">{t('All Methods')}</option>
              <option value="bank">Bank Transfer</option>
              <option value="cash">Cash</option>
              <option value="upi">UPI</option>
           </select>
           <select 
             value={filterStatus} 
             onChange={e => setFilterStatus(e.target.value)}
             style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #e2e8f0', background: 'white', fontSize: '0.85rem', outline: 'none' }}
           >
              <option value="all">{t('All Status')}</option>
              <option value="pending">{t('Pending')}</option>
              <option value="completed">{t('Completed')}</option>
           </select>
        </div>
        <button style={{ padding: '8px 16px', background: 'white', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
           <Download size={16} /> {t('Export Report')}
        </button>
      </div>

      {/* Table */}
      <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', overflow: 'hidden shadow-sm' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
           <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
                 <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>{t('Date')}</th>
                 <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>{t('Student')}</th>
                 <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>{t('Amount')}</th>
                 <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>{t('Method')}</th>
                 <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>{t('Status')}</th>
                 <th style={{ padding: '16px 24px', textAlign: 'right', fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>{t('Actions')}</th>
              </tr>
           </thead>
           <tbody>
              {loading ? (
                <tr><td colSpan="6" style={{ padding: 40, textAlign: 'center' }}>{t('Loading disbursements...')}</td></tr>
              ) : data.length === 0 ? (
                <tr><td colSpan="6" style={{ padding: 40, textAlign: 'center' }}>{t('No disbursements found.')}</td></tr>
              ) : (
                data.map(item => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                     <td style={{ padding: '16px 24px', fontSize: '0.9rem', color: '#1e293b' }}>{new Date(item.date).toLocaleDateString()}</td>
                     <td style={{ padding: '16px 24px' }}>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#111' }}>{item.scholarship_applications?.personal_info?.full_name || 'N/A'}</div>
                        <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{item.scholarship_applications?.application_number}</div>
                     </td>
                     <td style={{ padding: '16px 24px', fontWeight: 800, color: '#111' }}>₹{item.amount?.toLocaleString()}</td>
                     <td style={{ padding: '16px 24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', color: '#475569', fontWeight: 600 }}>
                           {getMethodIcon(item.method)}
                           <span style={{ textTransform: 'uppercase' }}>{item.method}</span>
                        </div>
                     </td>
                     <td style={{ padding: '16px 24px' }}>
                        <span style={{ 
                          padding: '4px 10px', borderRadius: 20, fontSize: '0.7rem', fontWeight: 700,
                          background: item.status === 'completed' ? '#f0fdf4' : '#fffbeb',
                          color: item.status === 'completed' ? '#16a34a' : '#d97706',
                          border: `1px solid ${item.status === 'completed' ? '#dcfce7' : '#fef3c7'}`
                        }}>
                           {t(item.status?.toUpperCase())}
                        </span>
                     </td>
                     <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                        {item.status === 'pending' && (
                          <button 
                            onClick={() => handleUpdateStatus(item.id, 'completed')}
                            style={{ padding: '6px 12px', background: '#10B981', color: 'white', border: 'none', borderRadius: 6, fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                          >
                             {t('Mark Completed')}
                          </button>
                        )}
                     </td>
                  </tr>
                ))
              )}
           </tbody>
        </table>
      </div>
    </AdminLayout>
  )
}
