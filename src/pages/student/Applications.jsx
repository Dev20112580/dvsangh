import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import { Home, FileText, BookOpen, User, GraduationCap, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'

const statusMap = { 
  draft: { label: 'Draft', color: 'gray', icon: <Clock size={14} /> }, 
  submitted: { label: 'Submitted', color: 'info', icon: <AlertCircle size={14} /> }, 
  under_review: { label: 'Under Review', color: 'warning', icon: <Clock size={14} /> }, 
  approved: { label: 'Approved', color: 'success', icon: <CheckCircle size={14} /> }, 
  rejected: { label: 'Rejected', color: 'danger', icon: <XCircle size={14} /> }, 
  disbursed: { label: 'Disbursed', color: 'success', icon: <CheckCircle size={14} /> } 
}

export default function StudentApplications() {
  const { user } = useAuth()
  const { t, language } = useLanguage()
  const [apps, setApps] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) fetchApps()
  }, [user])

  async function fetchApps() {
    const { data } = await supabase.from('scholarship_applications').select('*, scholarship_programs(name, name_hi, amount)').eq('student_id', user.id).order('created_at', { ascending: false })
    setApps(data || [])
    setLoading(false)
  }

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <nav className="sidebar-nav" style={{ paddingTop: 24 }}>
          <NavLink to="/dashboard/student"><Home size={18} /> {t('Dashboard')}</NavLink>
          <NavLink to="/scholarship/apply"><GraduationCap size={18} /> {t('Scholarship')}</NavLink>
          <NavLink to="/student/applications"><FileText size={18} /> {t('Applications')}</NavLink>
          <NavLink to="/student/materials"><BookOpen size={18} /> {t('Study Materials')}</NavLink>
          <NavLink to="/student/profile"><User size={18} /> {t('Profile')}</NavLink>
        </nav>
      </aside>
      <main className="dashboard-content">
        <div className="dashboard-header">
          <h1 className="hindi">📄 {t('My Applications')}</h1>
        </div>
        {loading ? <div className="skeleton" style={{ height: 200, borderRadius: 'var(--radius-lg)' }} /> : apps.length > 0 ? (
          <div className="table-container">
            <table>
              <thead>
                <tr><th>{t('Application #')}</th><th className="hindi">{t('Program')}</th><th className="hindi">{t('Amount')}</th><th>{t('Status')}</th><th className="hindi">{t('Date')}</th><th style={{ textAlign: 'right' }}>{t('Action')}</th></tr>
              </thead>
              <tbody>
                {apps.map(app => {
                  const s = statusMap[app.status] || statusMap.draft
                  const progName = language === 'hi' ? (app.scholarship_programs?.name_hi || app.scholarship_programs?.name) : app.scholarship_programs?.name
                  return (
                    <tr key={app.id}>
                      <td><strong>{app.application_number}</strong></td>
                      <td>{progName || '-'}</td>
                      <td>₹{app.scholarship_programs?.amount?.toLocaleString(language === 'hi' ? 'hi-IN' : 'en-IN') || '-'}</td>
                      <td><span className={`badge badge-${s.color}`}>{s.icon} {t(s.label)}</span></td>
                      <td>{new Date(app.created_at).toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN')}</td>
                      <td style={{ textAlign: 'right' }}>
                        <NavLink to={`/student/applications/${app.id}`} className="btn btn-sm btn-secondary">{t('View')}</NavLink>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="card" style={{ textAlign: 'center', padding: 48 }}>
            <FileText size={48} color="var(--gray-300)" style={{ margin: '0 auto' }} />
            <p className="hindi" style={{ marginTop: 12, color: 'var(--gray-500)' }}>{t('Not applied yet')}</p>
          </div>
        )}
      </main>
    </div>
  )
}
