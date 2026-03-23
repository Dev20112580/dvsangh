import { useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { FileText, Download, Filter, FileBarChart, PieChart, Users, GraduationCap, Heart, CheckCircle, X } from 'lucide-react'
import { jsPDF } from 'jspdf'
import { supabase } from '../../lib/supabase'

export default function ReportGenerator() {
  const { t } = useLanguage()
  const [reportType, setReportType] = useState('scholarship')
  const [format, setFormat] = useState('pdf')
  const [generating, setGenerating] = useState(false)
  const [ready, setReady] = useState(false)

  const generatePDFReport = async (data, title) => {
    const doc = jsPDF()
    
    // Header
    doc.setFillColor(255, 107, 53) // DVS Orange
    doc.rect(0, 0, 210, 40, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(22)
    doc.text('Dronacharya Vidyarthi Sangh (DVS)', 20, 25)
    doc.setFontSize(10)
    doc.text('Quality Education & Rural Empowerment', 20, 32)
    
    // Content Title
    doc.setTextColor(30, 41, 59)
    doc.setFontSize(16)
    doc.text(title, 20, 55)
    doc.setFontSize(10)
    doc.setTextColor(100, 116, 139)
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 62)
    
    doc.setDrawColor(226, 232, 240)
    doc.line(20, 68, 190, 68)

    // Data Summary
    doc.setFontSize(12)
    doc.setTextColor(30, 41, 59)
    doc.text(`Total Records: ${data.length}`, 20, 80)
    
    // Listing Data (Simple Table)
    let y = 95
    doc.setFontSize(9)
    doc.setTextColor(100, 116, 139)
    
    data.slice(0, 15).forEach((item, index) => {
      const text = reportType === 'scholarship' 
        ? `${index + 1}. ${item.full_name || 'N/A'} - ${item.status} (${item.income_bracket})`
        : reportType === 'donations'
        ? `${index + 1}. ${item.donor_name || 'Anonymous'} - ₹${item.amount} (${item.type})`
        : `${index + 1}. ${item.mentor_name} - Request for ${item.subject}`

      doc.text(text, 20, y)
      y += 8
    })

    if (data.length > 15) {
      doc.text(`... and ${data.length - 15} more records.`, 20, y)
    }

    // Footer
    doc.setFontSize(8)
    doc.setTextColor(148, 163, 184)
    doc.text('This is an automatically generated system report by DVS Admin Panel.', 105, 285, { align: 'center' })

    doc.save(`DVS_${reportType}_Report_${Date.now()}.pdf`)
  }

  const handleGenerate = async () => {
    setGenerating(true)
    setReady(false)
    
    let table = reportType === 'scholarship' ? 'scholarships' : 
                reportType === 'donations' ? 'donations' : 'mentor_requests'
    
    const { data, error } = await supabase.from(table).select('*')

    if (error) {
       alert(t('Error fetching data: ') + error.message)
       setGenerating(false)
       return
    }

    setTimeout(async () => {
      await generatePDFReport(data || [], t(reportType.charAt(0).toUpperCase() + reportType.slice(1) + ' Report'))
      setGenerating(false)
      setReady(true)
    }, 1500)
  }

  return (
    <div style={{ padding: 32 }}>
      <div style={{ marginBottom: 40 }}>
         <h1 className="hindi" style={{ fontSize: '2rem', fontWeight: 900, color: '#1e293b' }}>{t('Report & Data Export')}</h1>
         <p className="hindi" style={{ color: '#64748b' }}>{t('Generate professional PDF and Excel reports for foundation activities.')}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
         <div className="card" style={{ padding: 32 }}>
            <h3 className="hindi" style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
               <FileText size={20} color="#FF6B35" /> {t('Export Configuration')}
            </h3>

            <div style={{ marginBottom: 24 }}>
               <label className="hindi" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', marginBottom: 12 }}>{t('Select Report Type')}</label>
               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  {[
                    { id: 'scholarship', label: 'Scholarship Audit', icon: <GraduationCap size={16} /> },
                    { id: 'donations', label: 'Financial Ledger', icon: <Heart size={16} /> },
                    { id: 'volunteers', label: 'Mentorship Logs', icon: <Users size={16} /> },
                    { id: 'custom', label: 'Usage Stats', icon: <FileBarChart size={16} /> }
                  ].map(r => (
                    <button key={r.id} onClick={() => {setReportType(r.id); setReady(false)}} style={{ padding: '16px', borderRadius: 12, border: reportType === r.id ? '2px solid #FF6B35' : '1px solid #e2e8f0', background: reportType === r.id ? '#fff7ed' : 'white', color: reportType === r.id ? '#FF6B35' : '#475569', fontWeight: 800, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, transition: 'all 0.2s' }}>
                       {r.icon}
                       <span style={{ fontSize: '0.85rem' }}>{t(r.label)}</span>
                    </button>
                  ))}
               </div>
            </div>

            <div style={{ marginBottom: 32 }}>
               <label className="hindi" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', marginBottom: 12 }}>{t('Export Format')}</label>
               <div style={{ display: 'flex', gap: 12 }}>
                  {['pdf', 'excel', 'csv'].map(f => (
                    <button key={f} onClick={() => setFormat(f)} style={{ flex: 1, padding: '12px', borderRadius: 10, border: format === f ? '2px solid #1e293b' : '1px solid #e2e8f0', background: format === f ? '#1e293b' : 'white', color: format === f ? 'white' : '#475569', fontWeight: 800, cursor: 'pointer', textTransform: 'uppercase' }}>
                       {f}
                    </button>
                  ))}
               </div>
            </div>

            <button onClick={handleGenerate} disabled={generating} style={{ width: '100%', padding: '16px', borderRadius: 12, border: 'none', background: '#FF6B35', color: 'white', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, boxShadow: '0 4px 12px rgba(255, 107, 53, 0.2)', opacity: generating ? 0.7 : 1 }}>
               {generating ? t('Processing Generation...') : ready ? <><CheckCircle size={20} /> {t('Download Ready')}</> : <><Download size={20} /> {t('Generate Report Now')}</>}
            </button>
         </div>

         <div className="card" style={{ padding: 32, background: '#f8fafc', border: '1px dashed #cbd5e1' }}>
            <h3 className="hindi" style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: 20, color: '#1e293b' }}>{t('Report Preview')}</h3>
            <div style={{ background: 'white', borderRadius: 16, padding: 32, minHeight: 400, border: '1px solid #e2e8f0', position: 'relative' }}>
               {!ready && !generating && (
                 <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', flexDirection: 'column', color: '#94a3b8', paddingTop: 100 }}>
                    <PieChart size={64} strokeWidth={1} style={{ marginBottom: 20, opacity: 0.5 }} />
                    <p className="hindi" style={{ fontSize: '0.9rem' }}>{t('Preview will appear here after configuration.')}</p>
                 </div>
               )}

               {generating && (
                 <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', flexDirection: 'column', paddingTop: 100 }}>
                    <div className="loader" style={{ width: 40, height: 40, border: '4px solid #f3f3f3', borderTop: '4px solid #FF6B35', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                    <p className="hindi" style={{ marginTop: 20, color: '#64748b' }}>{t('Building document structure...')}</p>
                 </div>
               )}
               
               {ready && (
                 <div style={{ position: 'absolute', inset: 0, background: 'white', borderRadius: 16, padding: 24 }}>
                    <div style={{ borderBottom: '2px solid #1e293b', paddingBottom: 16, marginBottom: 20 }}>
                       <div style={{ fontSize: '1.5rem', fontWeight: 900 }}>DVS Foundation Report</div>
                       <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Generated on: {new Date().toLocaleDateString()}</div>
                    </div>
                    <div style={{ display: 'grid', gap: 12 }}>
                       <div style={{ height: 12, background: '#f1f5f9', width: '80%', borderRadius: 6 }}></div>
                       <div style={{ height: 12, background: '#f1f5f9', width: '100%', borderRadius: 6 }}></div>
                       <div style={{ height: 12, background: '#f1f5f9', width: '60%', borderRadius: 6 }}></div>
                       <div style={{ marginTop: 20, display: 'flex', gap: 12 }}>
                          <div style={{ flex: 1, height: 80, background: '#FF6B3510', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FF6B35', fontWeight: 800 }}>PDF</div>
                          <div style={{ flex: 1, height: 80, background: '#10B98110', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981', fontWeight: 800 }}>SUCCESS</div>
                       </div>
                    </div>
                 </div>
               )}
            </div>
         </div>
      </div>
      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
