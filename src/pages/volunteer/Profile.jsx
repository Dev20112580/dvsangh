import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import { Home, CheckSquare, Clock, User, Save } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'

export default function VolunteerProfile() {
  const { user, profile } = useAuth()
  const { t } = useLanguage()
  const [form, setForm] = useState({ skills: profile?.bio || '', availability: '' })
  const [loading, setLoading] = useState(false)

  const handleSave = async (e) => {
    e.preventDefault()
    setLoading(true)
    await supabase.from('volunteer_profiles').upsert({ user_id: user.id, skills: form.skills ? [form.skills] : [], availability: form.availability })
    setLoading(false)
    alert(t('Profile saved!'))
  }

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <nav className="sidebar-nav" style={{ paddingTop: 24 }}>
          <NavLink to="/dashboard/volunteer"><Home size={18} /> {t('Dashboard')}</NavLink>
          <NavLink to="/volunteer/tasks"><CheckSquare size={18} /> {t('Tasks')}</NavLink>
          <NavLink to="/volunteer/hours"><Clock size={18} /> {t('Hours Log')}</NavLink>
          <NavLink to="/volunteer/profile"><User size={18} /> {t('Profile')}</NavLink>
        </nav>
      </aside>
      <main className="dashboard-content">
        <div className="dashboard-header"><h1 className="hindi">👤 {t('My Profile')}</h1></div>
        <form onSubmit={handleSave} className="card" style={{ maxWidth: 600 }}>
          <div className="form-group">
            <label className="hindi">{t('Skills')}</label>
            <textarea className="form-control" value={form.skills} onChange={e => setForm({ ...form, skills: e.target.value })} placeholder="e.g. Teaching, Event Management..." />
          </div>
          <div className="form-group">
            <label className="hindi">{t('Availability')}</label>
            <select className="form-control" value={form.availability} onChange={e => setForm({ ...form, availability: e.target.value })}>
              <option value="">{t('Select')}</option>
              <option value="weekdays">{t('Weekdays')}</option>
              <option value="weekends">{t('Weekends')}</option>
              <option value="both">{t('Both')}</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            <Save size={16} /> {loading ? t('Saving...') : t('Save Profile')}
          </button>
        </form>
      </main>
    </div>
  )
}
