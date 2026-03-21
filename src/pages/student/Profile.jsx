import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import { Home, FileText, BookOpen, User, GraduationCap, Save, CheckCircle } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'

export default function StudentProfile() {
  const { user, profile } = useAuth()
  const { t } = useLanguage()
  const [studentProfile, setStudentProfile] = useState(null)
  const [form, setForm] = useState({})
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (user) fetchStudentProfile()
  }, [user])

  async function fetchStudentProfile() {
    const { data } = await supabase.from('student_profiles').select('*').eq('user_id', user.id).single()
    if (data) { setStudentProfile(data); setForm(data) }
    else setForm({ user_id: user.id })
  }

  async function handleSave(e) {
    e.preventDefault()
    setLoading(true)
    if (studentProfile) {
      await supabase.from('student_profiles').update(form).eq('id', studentProfile.id)
    } else {
      await supabase.from('student_profiles').insert(form)
    }
    if (form.full_name || profile) {
      await supabase.from('profiles').update({ full_name: profile?.full_name, district: form.school_address || profile?.district }).eq('id', user.id)
    }
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
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
          <h1 className="hindi">👤 {t('My Profile')}</h1>
        </div>
        {saved && <div className="toast toast-success"><CheckCircle size={18} /> {t('Profile saved!')}</div>}
        <form onSubmit={handleSave} className="card" style={{ maxWidth: 700 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group"><label className="hindi">{t('Class Level')}</label><input className="form-control" value={form.class_level || ''} onChange={e => setForm({ ...form, class_level: e.target.value })} placeholder="e.g. 10" /></div>
            <div className="form-group"><label className="hindi">{t('School/College Name')}</label><input className="form-control" value={form.school_name || ''} onChange={e => setForm({ ...form, school_name: e.target.value })} placeholder="School/College Name" /></div>
            <div className="form-group"><label className="hindi">{t('Father\'s Name')}</label><input className="form-control" value={form.father_name || ''} onChange={e => setForm({ ...form, father_name: e.target.value })} /></div>
            <div className="form-group"><label className="hindi">{t('Mother\'s Name')}</label><input className="form-control" value={form.mother_name || ''} onChange={e => setForm({ ...form, mother_name: e.target.value })} /></div>
            <div className="form-group"><label className="hindi">{t('Date of Birth')}</label><input className="form-control" type="date" value={form.date_of_birth || ''} onChange={e => setForm({ ...form, date_of_birth: e.target.value })} /></div>
            <div className="form-group">
              <label className="hindi">{t('Category')}</label>
              <select className="form-control" value={form.category || ''} onChange={e => setForm({ ...form, category: e.target.value })}>
                <option value="">{t('Select')}</option>
                <option value="general">{t('General')}</option>
                <option value="sc">SC</option>
                <option value="st">ST</option>
                <option value="obc">OBC</option>
                <option value="other">{t('Other')}</option>
              </select>
            </div>
            <div className="form-group"><label className="hindi">{t('Annual Family Income')}</label><input className="form-control" type="number" value={form.annual_family_income || ''} onChange={e => setForm({ ...form, annual_family_income: e.target.value })} placeholder="₹" /></div>
            <div className="form-group"><label className="hindi">{t('Previous Marks %')}</label><input className="form-control" type="number" value={form.previous_marks || ''} onChange={e => setForm({ ...form, previous_marks: e.target.value })} placeholder="e.g. 85" /></div>
          </div>
          <button type="submit" className="btn btn-primary mt-2" disabled={loading}><Save size={16} /> {loading ? t('Saving...') : t('Save Profile')}</button>
        </form>
      </main>
    </div>
  )
}
