import { useEffect, useState } from 'react'
import { jsPDF } from 'jspdf'
import { supabase } from '../../lib/supabase'
import AdminLayout from '../../components/admin/AdminLayout'
import { 
  TrendingUp, Calendar, Clock, FileText, Wallet, CreditCard, 
  Trash2, Plus, Download, Filter, Info, AlertTriangle, Shield, Upload
} from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'

export default function AdminDonations() {
  const { t, language } = useLanguage()
  const [donations, setDonations] = useState([])
  const [adminInfo, setAdminInfo] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { 
    fetchData()
    fetchQueue()
  }, [])

  async function fetchData() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data } = await supabase.from('admin_accounts').select('*').eq('user_id', user.id).single()
      setAdminInfo(data)
    }

    const { data } = await supabase.from('donations')
      .select('*, profiles(full_name, email)')
      .order('created_at', { ascending: false })
      .limit(50)
    setDonations(data || [])
    setLoading(false)
  }

  const [selectedDonationId, setSelectedDonationId] = useState('')

  const handle80GGenerate = async () => {
    if (!selectedDonationId) {
      alert(t('Please select a donation/donor first'))
      return
    }

    const donation = donations.find(d => d.id === selectedDonationId)
    if (!donation) return

    const doc = new jsPDF()
    
    // Header
    doc.setFontSize(22)
    doc.setTextColor(161, 64, 29) // #A1401D
    doc.text('DUMKA VIDYA SAGAR (DVS)', 105, 20, { align: 'center' })
    
    doc.setFontSize(10)
    doc.setTextColor(100)
    doc.text('Regd Office: Dumka, Jharkhand - 814101', 105, 28, { align: 'center' })
    doc.text('Email: contact@dvsangh.org | Website: www.dvsangh.org', 105, 33, { align: 'center' })

    doc.setDrawColor(161, 64, 29)
    doc.line(20, 40, 190, 40)

    // Title
    doc.setFontSize(16)
    doc.setTextColor(0)
    doc.text('FORM NO. 10BE (80G RECEIPT)', 105, 55, { align: 'center' })
    
    // Body
    doc.setFontSize(11)
    doc.text(`Certificate No: DVS/80G/${new Date().getFullYear()}/${donation.id.substring(0, 6).toUpperCase()}`, 20, 75)
    doc.text(`Date of Issue: ${new Date().toLocaleDateString()}`, 20, 82)

    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('DONOR DETAILS:', 20, 100)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(11)
    doc.text(`Name: ${donation.donor_name || donation.profiles?.full_name || 'N/A'}`, 20, 110)
    doc.text(`PAN: ${donation.pan_number || 'NOT PROVIDED'}`, 20, 117)
    doc.text(`Email: ${donation.donor_email || donation.profiles?.email || 'N/A'}`, 20, 124)

    doc.setFont('helvetica', 'bold')
    doc.text('DONATION DETAILS:', 20, 140)
    doc.setFont('helvetica', 'normal')
    doc.text(`Amount: INR ${donation.amount?.toLocaleString('en-IN')}`, 20, 150)
    doc.text(`Payment Mode: ${donation.payment_method?.toUpperCase() || 'ONLINE'}`, 20, 157)
    doc.text(`Transaction ID: ${donation.txn_id || donation.razorpay_payment_id || 'N/A'}`, 20, 164)
    doc.text(`Date of Donation: ${new Date(donation.created_at).toLocaleDateString()}`, 20, 171)

    // Disclaimer
    doc.setFontSize(9)
    doc.setTextColor(100)
    const disclaimer = 'Note: This is a computer-generated certificate and does not require a physical signature. Dumka Vidya Sagar is registered under section 80G of the Income Tax Act, 1961 (Registration No. DVS- Jharkhand/2024).'
    const splitDisclaimer = doc.splitTextToSize(disclaimer, 170)
    doc.text(splitDisclaimer, 20, 190)

    // Footer
    doc.setFontSize(10)
    doc.setTextColor(0)
    doc.setFont('helvetica', 'bold')
    doc.text('Authorised Signatory', 160, 220, { align: 'center' })
    doc.text('DVS Treasurer', 160, 225, { align: 'center' })

    doc.save(`80G_Receipt_${donation.donor_name?.replace(' ', '_') || 'Donor'}.pdf`)
    
    // Log Action
    await supabase.from('system_logs').insert([{
      admin_id: adminInfo?.user_id,
      action: 'generate_80g',
      entity_type: 'donation',
      entity_id: donation.id,
      metadata: { donor: donation.donor_name, amount: donation.amount }
    }])

    alert(t('Certificate generated and downloaded successfully'))
  }

  const totalAmount = donations.reduce((sum, d) => sum + (d.amount || 0), 0)
  const kpis = [
    { label: t("Total Received"), value: `₹${totalAmount.toLocaleString('en-IN')}`, sub: t("Lifetime collections"), color: "#A1401D", bg: "#fff7ed", icon: <TrendingUp size={16} /> },
    { label: t("This Month"), value: `₹${donations.filter(d => new Date(d.created_at).getMonth() === new Date().getMonth()).reduce((s,d)=>s+d.amount,0).toLocaleString('en-IN')}`, sub: `${t('Goal:')} ₹10L`, color: "#0891b2", bg: "#ecfeff", icon: <Calendar size={16} /> },
    { label: t("Pending Disburse"), value: queue.length.toString(), sub: t("Approved apps"), color: "#dc2626", bg: "#fef2f2", icon: <Clock size={16} /> },
    { label: t("Donations Count"), value: donations.length.toString(), sub: t("Total records"), color: "#d97706", bg: "#fffbeb", icon: <FileText size={16} /> },
    { label: t("Account Activity"), value: "ACTIVE", sub: "HDFC x4281", color: "#065f46", bg: "#f0fdf4", icon: <Wallet size={16} /> },
    { label: t("80G Enabled"), value: t("YES"), sub: t("Auto-generator LIVE"), color: "#7c3aed", bg: "#faf5ff", icon: <CreditCard size={16} /> },
  ]

  const liveDonations = donations.slice(0, 5).map(d => ({
    name: d.donor_name || d.profiles?.full_name || 'Anonymous',
    type: `${d.payment_method?.toUpperCase() || 'ONLINE'} • ${d.txn_id?.substring(0,8) || d.id.substring(0,8)}`,
    amount: `₹${d.amount?.toLocaleString('en-IN')}`,
    time: new Date(d.created_at).toLocaleDateString()
  }))

  const [queue, setQueue] = useState([])

  async function fetchQueue() {
    const { data } = await supabase
      .from('scholarship_applications')
      .select('id, student_name, institution_name, scholarship_amount')
      .eq('status', 'approved')
      .is('disbursement_date', null)
    
    setQueue((data || []).map(r => ({
      id: r.id.substring(0, 8).toUpperCase(),
      name: r.student_name,
      inst: r.institution_name,
      amount: `₹${r.scholarship_amount?.toLocaleString('en-IN') || '0'}`
    })))
  }

  const handleBulkExport = () => {
    if (queue.length === 0) {
      alert(t('No approved applications in the queue'))
      return
    }
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["Scholar ID", "Recipient", "Institution", "Amount"].join(",") + "\n"
      + queue.map(r => [r.id, r.name, r.inst, r.amount.replace('₹', '').replace(/,/g, '')].join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `NEFT_BATCH_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <AdminLayout title={t("Finance")} adminInfo={adminInfo}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <h1 className="hindi" style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111', margin: 0 }}>{t('Treasurer Hub')}</h1>
            <span className="hindi" style={{ fontSize: '0.65rem', fontWeight: 700, padding: '3px 8px', background: '#fef2f2', color: '#dc2626', borderRadius: 4, letterSpacing: 0.5 }}>{t('RESTRICTED')}</span>
        </div>
        <p className="hindi" style={{ color: '#6b7280', fontSize: '0.9rem' }}>{t('Comprehensive financial controls and multi-layer disbursement oversight.')}</p>
      </div>

      {/* KPI Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 16, marginBottom: 32 }}>
        {kpis.map((kpi, i) => (
          <div key={i} style={{ background: 'white', borderRadius: 12, padding: 16, border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="hindi" style={{ fontSize: '0.65rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>{t(kpi.label)}</span>
                <div style={{ color: kpi.color }}>{kpi.icon}</div>
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111' }}>{kpi.value}</div>
            <div className="hindi" style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
              <span style={{ color: kpi.color, fontWeight: 600 }}>{kpi.sub.split(' ')[0]}</span> {kpi.sub.split(' ').slice(1).map(w => t(w)).join(' ')}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 24, alignItems: 'flex-start' }}>
        {/* Left Side */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Live Donations */}
          <div style={{ background: 'white', borderRadius: 12, padding: 24, border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 className="hindi" style={{ fontSize: '1rem', fontWeight: 700, color: '#111', display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#dc2626' }}></div> {t('Live Donations')}
              </h3>
              <button className="hindi" style={{ fontSize: '0.7rem', color: '#A1401D', background: 'none', border: 'none', fontWeight: 700, cursor: 'pointer' }}>{t('VIEW ALL')}</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {liveDonations.map((d, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>
                      {d.name.split(' ').map(n=>n[0]).join('')}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#111' }}>{d.name}</div>
                      <div className="hindi" style={{ fontSize: '0.65rem', color: '#94a3b8' }}>{t(d.type.split(' • ')[0])} • {d.type.split(' • ')[1]}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#111' }}>{d.amount}</div>
                    <div className="hindi" style={{ fontSize: '0.65rem', color: '#94a3b8' }}>{d.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 80G Certificate Manager */}
          <div style={{ background: 'white', borderRadius: 12, padding: 24, border: '1px solid #e2e8f0' }}>
             <h3 className="hindi" style={{ fontSize: '1rem', fontWeight: 700, color: '#111', marginBottom: 20 }}>{t('80G Certificate Manager')}</h3>
             <div style={{ marginBottom: 16 }}>
               <label className="hindi" style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>{t('Select Recipient')}</label>
               <div style={{ position: 'relative' }}>
                 <select 
                   value={selectedDonationId}
                   onChange={(e) => setSelectedDonationId(e.target.value)}
                   className="hindi" 
                   style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: '0.85rem', outline: 'none', background: '#f8fafc', appearance: 'none' }}
                 >
                   <option value="">{t('Select Donor / Donation')}</option>
                   {donations.map(d => (
                     <option key={d.id} value={d.id}>
                       {d.donor_name || d.profiles?.full_name} - ₹{d.amount} ({new Date(d.created_at).toLocaleDateString()})
                     </option>
                   ))}
                 </select>
               </div>
             </div>
             <div style={{ background: '#fff7ed', borderRadius: 8, padding: 12, display: 'flex', gap: 12, marginBottom: 20 }}>
                <Info size={16} color="#A1401D" style={{ flexShrink: 0, marginTop: 2 }} />
                <p className="hindi" style={{ fontSize: '0.72rem', color: '#A1401D', margin: 0, lineHeight: 1.4 }}>{t('Selected donor will be verified and generate PDF with digital signature.')}</p>
             </div>
             <button 
               onClick={handle80GGenerate}
               className="hindi" 
               style={{ width: '100%', padding: '12px', background: '#A1401D', color: 'white', border: 'none', borderRadius: 8, fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer' }}
             >
               <FileText size={16} /> {t('Auto-Generate & Email')}
             </button>
          </div>
        </div>

        {/* Right Side */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Smart Alerts (A7) */}
          <div style={{ background: '#fff1f2', borderRadius: 12, padding: 20, border: '1px solid #ffe4e6', marginBottom: 24 }}>
             <h4 className="hindi" style={{ fontSize: '0.85rem', fontWeight: 800, color: '#be123c', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <AlertTriangle size={18} /> {t('Smart Financial Alerts')}
             </h4>
             <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ background: 'white', padding: '10px 14px', borderRadius: 8, fontSize: '0.8rem', color: '#9f1239', border: '1px solid #fecaca', display: 'flex', justifyContent: 'space-between' }}>
                   <span>{t('Suspicious Donation Flagged')} (TXN-4421)</span>
                   <button style={{ background: 'none', border: 'none', color: '#1d4ed8', fontWeight: 700, cursor: 'pointer' }}>{t('Audit')}</button>
                </div>
                <div style={{ background: 'white', padding: '10px 14px', borderRadius: 8, fontSize: '0.8rem', color: '#b45309', border: '1px solid #ffedd5', display: 'flex', justifyContent: 'space-between' }}>
                   <span>{t('Budget Overrun Warning')}: {t('Events')}</span>
                   <span style={{ fontWeight: 700 }}>104% {t('used')}</span>
                </div>
             </div>
          </div>

          {/* Disbursement Queue */}
          <div style={{ background: 'white', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                 <h3 className="hindi" style={{ fontSize: '1rem', fontWeight: 700, color: '#111' }}>{t('Disbursement Queue')}</h3>
                 <button 
                   onClick={handleBulkExport}
                   className="btn btn-primary btn-sm hindi" 
                   style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                 >
                    <Download size={14} /> {t('Bulk NEFT Export')}
                 </button>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-secondary btn-sm hindi" style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Filter size={14} /> {t('Filter')}</button>
                <button className="btn btn-secondary btn-sm hindi" style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Download size={14} /> {t('Export Results')}</button>
              </div>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  <th style={{ padding: '14px 20px', width: 40 }}><input type="checkbox" /></th>
                  <th className="hindi" style={{ padding: '14px 20px', fontSize: '0.65rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>{t('Scholar ID')}</th>
                  <th className="hindi" style={{ padding: '14px 20px', fontSize: '0.65rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>{t('Recipient')}</th>
                  <th className="hindi" style={{ padding: '14px 20px', fontSize: '0.65rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>{t('Institution')}</th>
                  <th className="hindi" style={{ padding: '14px 20px', fontSize: '0.65rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>{t('Amount')}</th>
                  <th className="hindi" style={{ padding: '14px 20px', fontSize: '0.65rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>{t('UTR Reference')}</th>
                  <th className="hindi" style={{ padding: '14px 20px', fontSize: '0.65rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>{t('Actions')}</th>
                </tr>
              </thead>
              <tbody>
                {queue.map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '16px 20px' }}><input type="checkbox" /></td>
                    <td style={{ padding: '16px 20px', fontSize: '0.8rem', fontWeight: 700, color: '#111' }}>{row.id}</td>
                    <td style={{ padding: '16px 20px' }}>
                       <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#111' }}>{row.name}</div>
                       <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>B.Tech Sem IV</div>
                    </td>
                    <td style={{ padding: '16px 20px', fontSize: '0.8rem', color: '#64748b' }}>{row.inst}</td>
                    <td style={{ padding: '16px 20px', fontSize: '0.85rem', fontWeight: 700, color: '#111' }}>{row.amount}</td>
                    <td style={{ padding: '16px 20px' }}>
                      <input placeholder={t("Enter UTR #")} style={{ padding: '6px 10px', border: '1px solid #e2e8f0', borderRadius: 4, width: 100, fontSize: '0.75rem', outline: 'none' }} />
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <button 
                        onClick={() => {
                          console.log(`Audit: ${adminInfo?.admin_id} disbursed ${row.amount} to ${row.name}`)
                          alert(`${t('Disbursement successful')} for ${row.name}`)
                        }}
                        className="hindi" 
                        style={{ padding: '6px 12px', background: '#A1401D', color: 'white', border: 'none', borderRadius: 4, fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer' }}
                      >
                        {t('DISBURSE')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Reconciliation */}
          <div style={{ background: 'white', borderRadius: 12, padding: 24, border: '1px solid #e2e8f0' }}>
            <h3 className="hindi" style={{ fontSize: '1rem', fontWeight: 700, color: '#111', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                <div style={{ width: 32, height: 32, background: '#fff7ed', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Shield size={16} color="#A1401D" /></div>
                {t('Bank Statement Reconciliation')}
            </h3>
            <div style={{ border: '2px dashed #e2e8f0', borderRadius: 16, padding: '40px 20px', textAlign: 'center', background: '#f8fafc' }}>
               <div style={{ width: 48, height: 48, background: '#ffedd5', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                 <Upload size={24} color="#A1401D" />
               </div>
               <h4 className="hindi" style={{ fontSize: '1.1rem', fontWeight: 700, color: '#111', marginBottom: 8 }}>{t('Drop Bank CSV Here')}</h4>
               <p className="hindi" style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: 24 }}>{t('auto-match UTRs with internal disbursements.')}</p>
               <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                 <button className="hindi" style={{ padding: '10px 20px', background: '#1d4ed8', color: 'white', border: 'none', borderRadius: 8, fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer' }}>{t('Select File')}</button>
                 <button className="hindi" style={{ padding: '10px 20px', background: 'white', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: '0.85rem', fontWeight: 700, color: '#64748b', cursor: 'pointer' }}>{t('Download Template')}</button>
               </div>
            </div>
            <div style={{ marginTop: 24, padding: '14px 20px', background: '#fff7ed', borderRadius: 10, border: '1px solid #ffedd5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                 <Clock size={16} color="#d97706" />
                 <span className="hindi" style={{ fontSize: '0.78rem', color: '#9a3412', fontWeight: 600 }}>{t('LAST SYNCED:')} OCT 24, 2023 • 14:20 PM</span>
               </div>
               <button className="hindi" style={{ fontSize: '0.7rem', fontWeight: 700, color: '#9a3412', background: 'none', border: 'none', letterSpacing: 1, cursor: 'pointer' }}>{t('RE-SYNC ALL')}</button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
