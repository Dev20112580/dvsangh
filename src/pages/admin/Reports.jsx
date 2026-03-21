import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { AdminLayout } from './Dashboard'
import { 
  FileText, Download, PieChart, BarChart2, TrendingUp,
  Calendar, Shield, Filter, Search, FileSpreadsheet,
  Users, IndianRupee, Activity
} from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'

export default function AdminReports() {
  const { t } = useLanguage()
  const [reportType, setReportType] = useState('financial')
  const [dateRange, setDateRange] = useState('30days')
  const [format, setFormat] = useState('pdf')
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = (e) => {
    e.preventDefault()
    setIsGenerating(true)
    setTimeout(() => {
      alert(`${t('Report generated successfully in')} ${format.toUpperCase()}`)
      setIsGenerating(false)
    }, 2000)
  }

  const recentReports = [
    { name: 'Monthly_Financial_Feb24.pdf', type: 'Financial', date: '2024-03-01', size: '2.4 MB' },
    { name: 'Impact_Report_Q4.xlsx', type: 'Impact', date: '2024-01-15', size: '1.8 MB' },
    { name: 'Volunteer_Hours_Audit.pdf', type: 'Audit', date: '2023-12-28', size: '3.1 MB' }
  ]

  const auditLogs = [
    { user: 'Prashant', action: 'Approved Scholarship #452', ip: '192.168.1.45', time: '10:24 AM' },
    { user: 'Sumit', action: 'Changed System Settings', ip: '103.45.2.11', time: '09:15 AM' },
    { user: 'Vijay', action: 'Disbursed Fund #12', ip: '112.34.5.88', time: '08:30 AM' }
  ]

  return (
    <AdminLayout title={t("Reports Generator")}>
      
      {/* Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
        <div>
          <h1 className="hindi" style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111' }}>{t('Intelligence & Auditing')}</h1>
          <p className="hindi" style={{ color: '#64748b', marginTop: 4, fontSize: '0.9rem' }}>{t('Generate comprehensive financial, impact, and user growth reports in PDF or Excel format.')}</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
           <button style={{ padding: '10px 18px', background: 'white', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: '0.85rem', fontWeight: 700, color: '#4b5563', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
             <Activity size={16} /> {t('Live Analytics')}
           </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>
        
        {/* Left Column: Generator Form & Audit Logs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          
          <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', padding: 32 }}>
            <form onSubmit={handleGenerate}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>
                <div>
                  <label className="hindi" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>{t('Select Report Type')}</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {[
                      { id: 'financial', label: t('Financial Summary'), icon: <IndianRupee size={16} /> },
                      { id: 'impact', label: t('Impact Assessment'), icon: <TrendingUp size={16} /> },
                      { id: 'growth', label: t('User Growth Analytics'), icon: <Users size={16} /> },
                      { id: 'volunteer', label: t('Volunteer Contribution'), icon: <BarChart2 size={16} /> }
                    ].map(opt => (
                      <div key={opt.id} onClick={() => setReportType(opt.id)} style={{ padding: '12px 16px', borderRadius: 10, border: reportType === opt.id ? '2px solid #1d4ed8' : '1px solid #f1f5f9', background: reportType === opt.id ? '#eff6ff' : 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }}>
                         <div style={{ color: reportType === opt.id ? '#1d4ed8' : '#94a3b8' }}>{opt.icon}</div>
                         <span className="hindi" style={{ fontSize: '0.85rem', fontWeight: reportType === opt.id ? 700 : 500, color: reportType === opt.id ? '#1d4ed8' : '#4b5563' }}>{opt.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                   <label className="hindi" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>{t('Date Range')}</label>
                   <select className="hindi" value={dateRange} onChange={e => setDateRange(e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: 10, border: '1px solid #e2e8f0', backgroundColor: 'white', fontSize: '0.9rem', outline: 'none', marginBottom: 24 }}>
                      <option value="30days">{t('Last 30 Days')}</option>
                      <option value="quarter">{t('Last Quarter')}</option>
                      <option value="fiscal">{t('This Fiscal Year')}</option>
                      <option value="custom">{t('Custom Range')}</option>
                   </select>

                   <label className="hindi" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>{t('Export Format')}</label>
                   <div style={{ display: 'flex', gap: 16 }}>
                      <label style={{ flex: 1, padding: '14px', borderRadius: 10, border: format === 'pdf' ? '2px solid #1d4ed8' : '1px solid #f1f5f9', background: format === 'pdf' ? '#eff6ff' : 'white', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                        <input type="radio" checked={format === 'pdf'} onChange={() => setFormat('pdf')} style={{ display: 'none' }} />
                        <FileText size={20} color={format === 'pdf' ? '#1d4ed8' : '#94a3b8'} />
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: format === 'pdf' ? '#1d4ed8' : '#64748b' }}>PDF Document</span>
                      </label>
                      <label style={{ flex: 1, padding: '14px', borderRadius: 10, border: format === 'excel' ? '2px solid #10b981' : '1px solid #f1f5f9', background: format === 'excel' ? '#ecfdf5' : 'white', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                        <input type="radio" checked={format === 'excel'} onChange={() => setFormat('excel')} style={{ display: 'none' }} />
                        <FileSpreadsheet size={20} color={format === 'excel' ? '#10b981' : '#94a3b8'} />
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: format === 'excel' ? '#10b981' : '#64748b' }}>Excel Sheet</span>
                      </label>
                   </div>
                </div>
              </div>

              <button type="submit" disabled={isGenerating} style={{ width: '100%', padding: '16px', background: '#1d4ed8', border: 'none', borderRadius: 12, color: 'white', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, boxShadow: '0 4px 20px rgba(29, 78, 216, 0.2)' }}>
                {isGenerating ? t('Processing...') : <><Download size={20} /> {t('Generate Report')}</>}
              </button>
            </form>
          </div>

          {/* Audit Log Table */}
          <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <h3 className="hindi" style={{ fontSize: '0.9rem', fontWeight: 800, color: '#111', display: 'flex', alignItems: 'center', gap: 10 }}><Shield size={18} color="#1d4ed8" /> {t('System Audit Log')}</h3>
               <button style={{ background: 'none', border: 'none', color: '#1d4ed8', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>{t('VIEW ALL')}</button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                 <tr style={{ textAlign: 'left', background: '#f8fafc' }}>
                    <th className="hindi" style={{ padding: '12px 24px', fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>{t('WHO')}</th>
                    <th className="hindi" style={{ padding: '12px 24px', fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>{t('ACTION')}</th>
                    <th className="hindi" style={{ padding: '12px 24px', fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>{t('IP ADDRESS')}</th>
                    <th className="hindi" style={{ padding: '12px 24px', fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', textAlign: 'right' }}>{t('TIME')}</th>
                 </tr>
              </thead>
              <tbody>
                {auditLogs.map((log, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '16px 24px', fontSize: '0.85rem', fontWeight: 700, color: '#1e293b' }}>{log.user}</td>
                    <td style={{ padding: '16px 24px', fontSize: '0.8rem', color: '#4b5563' }}>{log.action}</td>
                    <td style={{ padding: '16px 24px', fontSize: '0.8rem', color: '#94a3b8', fontStyle: 'italic' }}>{log.ip}</td>
                    <td style={{ padding: '16px 24px', fontSize: '0.8rem', color: '#64748b', textAlign: 'right', fontWeight: 500 }}>{log.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

        {/* Right Column: Visualization & Recents */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          
          <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', padding: 24, textAlign: 'center' }}>
             <h3 className="hindi" style={{ fontSize: '0.8rem', fontWeight: 800, color: '#64748b', marginBottom: 20, textTransform: 'uppercase' }}>{t('Data Visualization')}</h3>
             <div style={{ width: 160, height: 160, margin: '0 auto 20px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <PieChart size={120} color="#e2e8f0" strokeWidth={1.5} />
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                   <div style={{ textAlign: 'center' }}>
                     <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111' }}>84%</div>
                     <div className="hindi" style={{ fontSize: '0.65rem', color: '#94a3b8' }}>DVS Core</div>
                   </div>
                </div>
             </div>
             <p className="hindi" style={{ fontSize: '0.75rem', color: '#64748b', lineHeight: 1.5 }}>{t('Automated dashboards provide real-time visibility into the DVS operational performance.')}</p>
          </div>

          <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', padding: 24 }}>
             <h3 className="hindi" style={{ fontSize: '0.8rem', fontWeight: 800, color: '#64748b', marginBottom: 20, textTransform: 'uppercase' }}>{t('Recent Downloads')}</h3>
             <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
               {recentReports.map((file, i) => (
                 <div key={i} style={{ display: 'flex', gap: 12, padding: '12px', background: '#f8fafc', borderRadius: 10, border: '1px solid #f1f5f9' }}>
                    <div style={{ color: file.name.endsWith('pdf') ? '#ef4444' : '#10b981' }}><FileText size={18} /></div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                       <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{file.name}</div>
                       <div style={{ fontSize: '0.65rem', color: '#94a3b8', marginTop: 2 }}>{file.size} • {file.date}</div>
                    </div>
                 </div>
               ))}
             </div>
             <button className="hindi" style={{ width: '100%', background: 'none', border: '1px solid #e2e8f0', padding: '10px', borderRadius: 8, fontSize: '0.75rem', fontWeight: 700, color: '#1d4ed8', marginTop: 20, cursor: 'pointer' }}>{t('ARCHIVE ACCESS')}</button>
          </div>

        </div>

      </div>

    </AdminLayout>
  )
}
