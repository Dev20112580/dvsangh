import { useEffect, useState } from 'react'
import { useParams, Link, NavLink } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { Home, FileText, ArrowLeft, Clock, CheckCircle, AlertCircle, MessageSquare, Download } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'

export default function ApplicationDetail() {
  const { id } = useParams()
  const { t, language } = useLanguage()
  const [app, setApp] = useState(null)
  const [loading, setLoading] = useState(true)

  const [docs, setDocs] = useState([])
  const [disbursement, setDisbursement] = useState(null)

  useEffect(() => {
    fetchDetail()
  }, [id])

  async function fetchDetail() {
    setLoading(true)
    try {
      // 1. Fetch Application with Program
      const { data: appData, error: appError } = await supabase
        .from('scholarship_applications')
        .select('*, scholarship_programs(*)')
        .eq('id', id)
        .single()
      
      if (appError) throw appError
      setApp(appData)

      // 2. Fetch Documents
      const { data: docData } = await supabase
        .from('application_documents')
        .select('*')
        .eq('application_id', id)
      setDocs(docData || [])

      // 3. Fetch Disbursement if any
      const { data: disbData } = await supabase
        .from('disbursements')
        .select('*')
        .eq('application_id', id)
        .single()
      setDisbursement(disbData)

    } catch (err) {
      console.error('Fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="p-10 text-center hindi">{t('Loading application details...')}</div>
  if (!app) return <div className="p-10 text-center hindi">{t('Application not found')}</div>

  const statusMap = {
    draft: { step: 0, label: 'Draft' },
    submitted: { step: 1, label: 'Submitted' },
    under_review: { step: 2, label: 'Under Review' },
    approved: { step: 3, label: 'Approved' },
    rejected: { step: 3, label: 'Rejected' },
    disbursed: { step: 4, label: 'Disbursed' }
  }
  const currentStep = statusMap[app.status]?.step || 1

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <nav className="sidebar-nav" style={{ paddingTop: 24 }}>
           <NavLink to="/dashboard/student"><Home size={18} /> {t('Dashboard')}</NavLink>
           <NavLink to="/student/applications"><ArrowLeft size={18} /> {t('Back to List')}</NavLink>
        </nav>
      </aside>
      <main className="dashboard-content">
        <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 className="hindi">📄 {t('Application Detail')}</h1>
            <p className="hindi" style={{ color: 'var(--gray-500)' }}>#{app.application_number} · {language === 'hi' ? (app.scholarship_programs?.name_hi || app.scholarship_programs?.name) : app.scholarship_programs?.name}</p>
          </div>
          <span className={`badge badge-${app.status === 'rejected' ? 'danger' : 'info'}`}>{t(app.status)}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 24 }}>
          {/* Timeline & Feedback */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
             <div className="card" style={{ padding: 24 }}>
                <h3 className="hindi" style={{ marginBottom: 24, fontSize: '1.1rem' }}>{t('Status Timeline')}</h3>
                <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 32 }}>
                   <div style={{ position: 'absolute', left: 11, top: 0, bottom: 0, width: 2, background: '#f1f5f9' }}></div>
                   {[
                     { step: 1, label: 'Submitted', date: app.submitted_at || app.created_at },
                     { step: 2, label: 'Under Review', date: (app.status !== 'submitted' && app.status !== 'draft') ? app.updated_at : null },
                     { step: 3, label: app.status === 'rejected' ? 'Rejected' : 'Final Approval', date: app.review_date },
                     { step: 4, label: 'Funds Disbursed', date: disbursement?.payment_date || disbursement?.created_at }
                   ].map(s => (
                     <div key={s.step} style={{ display: 'flex', gap: 20, alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
                        <div style={{ 
                          width: 24, height: 24, borderRadius: '50%', 
                          background: currentStep >= s.step ? (app.status === 'rejected' && s.step === 3 ? '#EF4444' : '#10B981') : 'white',
                          border: `2px solid ${currentStep >= s.step ? (app.status === 'rejected' && s.step === 3 ? '#EF4444' : '#10B981') : '#cbd5e1'}`, 
                          display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white'
                        }}>
                           {currentStep >= s.step ? <CheckCircle size={14} /> : <div style={{ width: 8, height: 8, background: '#cbd5e1', borderRadius: '50%' }}></div>}
                        </div>
                        <div>
                           <div className="hindi" style={{ fontSize: '0.9rem', fontWeight: 700, color: currentStep >= s.step ? '#1e293b' : 'var(--gray-400)' }}>{t(s.label)}</div>
                           <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)', marginTop: 2 }}>{s.date ? new Date(s.date).toLocaleString() : t('Pending')}</div>
                        </div>
                     </div>
                   ))}
                </div>
             </div>

             <div className="card" style={{ padding: 24 }}>
                <h3 className="hindi" style={{ marginBottom: 20, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: 10 }}>
                   <MessageSquare size={20} color="#A1401D" /> {t('Admin Feedback')}
                </h3>
                <div style={{ padding: 16, background: app.status === 'rejected' ? '#fef2f2' : '#fff7ed', borderRadius: 12, border: `1px solid ${app.status === 'rejected' ? '#fee2e2' : '#ffedd5'}` }}>
                   <p className="hindi" style={{ fontSize: '0.9rem', color: app.status === 'rejected' ? '#b91c1c' : '#9a3412', lineHeight: 1.6 }}>
                      {app.rejection_reason || app.admin_notes || t('No remarks yet. Your application is being processed according to our merit criteria.')}
                   </p>
                </div>
             </div>
          </div>

          {/* Sidebar Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
             <div className="card" style={{ padding: 20 }}>
                <h4 className="hindi" style={{ marginBottom: 16, fontSize: '0.95rem' }}>{t('Documents Submitted')}</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                   {docs.length > 0 ? docs.map(doc => (
                     <div key={doc.id} onClick={() => window.open(doc.file_url, '_blank')} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: '#f8fafc', borderRadius: 8, cursor: 'pointer' }}>
                        <span style={{ fontSize: '0.85rem' }}>{t(doc.doc_type)}</span>
                        <Download size={14} color="var(--gray-400)" />
                     </div>
                   )) : <div style={{ fontSize: '0.8rem', color: 'var(--gray-400)' }}>{t('No documents found.')}</div>}
                </div>
             </div>

             <div className="card" style={{ padding: 20, borderTop: '4px solid #3b82f6' }}>
                <h4 className="hindi" style={{ marginBottom: 12, fontSize: '0.95rem' }}>{t('Need Help?')}</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--gray-500)', marginBottom: 16 }}>{t('If you have questions about your status, contact DVS helpline.')}</p>
                <button className="btn btn-secondary w-full hindi">{t('Contact Support')}</button>
             </div>
          </div>
        </div>
      </main>
    </div>
  )
}
