import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Home, Heart, BarChart2, User, Save } from 'lucide-react'
import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useLanguage } from '../../context/LanguageContext'

export default function DonorProfile() {
  const { user, profile } = useAuth()
  const { t } = useLanguage()
  const [form, setForm] = useState({ pan_number: '', organization: '' })
  const [loading, setLoading] = useState(false)

  const handleSave = async (e) => {
    e.preventDefault()
    setLoading(true)
    await supabase.from('donor_profiles').upsert({ user_id: user.id, pan_number: form.pan_number, organization: form.organization })
    setLoading(false)
    alert(t('Saved!'))
  }

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <nav className="sidebar-nav" style={{ paddingTop: 24 }}>
          <NavLink to="/dashboard/donor"><Home size={18} /> {t('Dashboard')}</NavLink>
          <NavLink to="/donor/donations"><Heart size={18} /> {t('Donations')}</NavLink>
          <NavLink to="/donor/impact"><BarChart2 size={18} /> {t('Impact')}</NavLink>
          <NavLink to="/donor/profile"><User size={18} /> {t('Profile')}</NavLink>
        </nav>
      </aside>
      <main className="dashboard-content">
        <div className="dashboard-header"><h1 className="hindi">👤 {t('Donor Profile')}</h1></div>
        <form onSubmit={handleSave} className="card" style={{ maxWidth: 500 }}>
          <div className="form-group"><label>{t('PAN Number (for 80G)')}</label><input className="form-control" value={form.pan_number} onChange={e => setForm({ ...form, pan_number: e.target.value.toUpperCase() })} placeholder="ABCDE1234F" maxLength={10} /></div>
          <div className="form-group"><label>{t('Organization (optional)')}</label><input className="form-control" value={form.organization} onChange={e => setForm({ ...form, organization: e.target.value })} placeholder="Company / Org name" /></div>
          <button type="submit" className="btn btn-primary" disabled={loading}><Save size={16} /> {loading ? t('Saving...') : t('Save Profile')}</button>
        </form>
      </main>
    </div>
  )
}
