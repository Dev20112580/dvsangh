import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import { Home, FileText, BookOpen, User, GraduationCap, Award, TrendingUp, Clock, ArrowRight, Menu, X, CheckCircle, Star, Globe, LogOut } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'
import DashboardHeader from '../../components/dashboard/DashboardHeader'

export default function StudentDashboard() {
  const { user, profile } = useAuth()
  const { t, language } = useLanguage()
  const [stats, setStats] = useState({ points: 250, applications: 0 })
  const [latestApp, setLatestApp] = useState(null)
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (user) {
      fetchDashboardData()
      fetchStats() // Keep fetching stats for applications, materials, events
    }
  }, [user])

  async function fetchDashboardData() {
    try {
      // Fetch latest scholarship app
      const { data: apps } = await supabase.from('scholarship_applications').select('*').eq('student_id', user.id).order('created_at', { ascending: false }).limit(1)
      if (apps && apps[0]) setLatestApp(apps[0])

      // Fetch upcoming 2 events
      const { data: evts } = await supabase.from('events').select('*').eq('status', 'published').gte('event_date', new Date().toISOString()).order('event_date', { ascending: true }).limit(2)
      setEvents(evts || [])

      setLoading(false)
    } catch (err) {
      console.error('Error fetching student dashboard data:', err)
    }
  }

  async function fetchStats() {
    const [apps, regs, downloads] = await Promise.all([
      supabase.from('scholarship_applications').select('id', { count: 'exact', head: true }).eq('student_id', user.id),
      supabase.from('event_registrations').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
      supabase.from('material_downloads').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
    ])
    setStats(prevStats => ({ 
      ...prevStats,
      applications: apps.count || 0, 
      events: regs.count || 0, 
      materials: downloads.count || 0, 
      points: profile?.total_points || 0 
    }))
  }

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024)


  return (
    <div className="dashboard">
      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="drawer-overlay" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
        <div style={{ padding: '24px 24px 0', textAlign: 'center' }}>
           <img src="/logo_dvs.jpg" alt="DVS Logo" width="60" height="60" style={{ borderRadius: '50%', marginBottom: 12, border: '2px solid #FF6B35' }} />
        </div>
        <div className="sidebar-profile">
          <div style={{ position: 'absolute', top: 12, right: 12 }} className="desktop-hidden">
             <button onClick={() => setIsMobileMenuOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--gray-400)' }}>
               <X size={20} />
             </button>
          </div>
          <div className="sidebar-avatar">{profile?.full_name?.charAt(0) || '?'}</div>
          <div className="sidebar-name hindi">{profile?.full_name || t('Student')}</div>
          <div className="sidebar-meta">{profile?.district} · {t('Student')}</div>
          <span className="badge badge-orange mt-1">Level: {profile?.current_level || 'Explorer'}</span>
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/dashboard/student" onClick={() => setIsMobileMenuOpen(false)}><Home size={18} /> {t('Dashboard')}</NavLink>
          <NavLink to="/scholarship/apply" onClick={() => setIsMobileMenuOpen(false)}><GraduationCap size={18} /> {t('Scholarship')}</NavLink>
          <NavLink to="/student/applications" onClick={() => setIsMobileMenuOpen(false)}><FileText size={18} /> {t('Applications')}</NavLink>
          <NavLink to="/student/materials" onClick={() => setIsMobileMenuOpen(false)}><BookOpen size={18} /> {t('Study Materials')}</NavLink>
          <NavLink to="/student/profile" onClick={() => setIsMobileMenuOpen(false)}><User size={18} /> {t('Profile')}</NavLink>
          
          <div style={{ marginTop: 'auto', paddingTop: 20, borderTop: '1px solid var(--gray-100)', display: 'flex', flexDirection: 'column', gap: 4 }}>
             <button 
               onClick={() => { setLanguage(language === 'hi' ? 'en' : 'hi'); setIsMobileMenuOpen(false); }}
               style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '12px 24px', color: 'var(--gray-600)', fontSize: '0.9rem', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
             >
               <Globe size={18} /> {language === 'hi' ? 'Switch to English' : 'हिंदी में बदलें'}
             </button>
             <button 
               onClick={useAuth().logout}
               style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '12px 24px', color: '#dc2626', fontSize: '0.9rem', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
             >
               <LogOut size={18} /> {t('Logout')}
             </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="dashboard-content">
        <DashboardHeader 
          onMenuClick={() => setIsMobileMenuOpen(true)} 
          profile={profile} 
        />

        {/* Stats */}
        <div className="grid grid-4" style={{ marginBottom: 32 }}>
          <div className="stat-card"><div className="stat-value">{stats.applications}</div><div className="stat-label hindi">{t('Applications')}</div></div>
          <div className="stat-card"><div className="stat-value">{stats.events}</div><div className="stat-label hindi">{t('Events')}</div></div>
          <div className="stat-card"><div className="stat-value">{stats.materials}</div><div className="stat-label">{t('Downloads')}</div></div>
          <div className="stat-card"><div className="stat-value">{stats.points}</div><div className="stat-label">{t('Points')}</div></div>
        </div>

        {/* Content Body */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 24 }}>
          
          {/* Main Area */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div className="grid grid-2">
              <Link to="/scholarship/apply" className="card" style={{ display: 'flex', alignItems: 'center', gap: 16, borderLeft: '4px solid #A1401D', padding: 20 }}>
                <div style={{ width: 56, height: 56, borderRadius: 'var(--radius-md)', background: '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#A1401D' }}>
                  <GraduationCap size={24} />
                </div>
                <div style={{ flex: 1 }}>
                  <h4 className="hindi" style={{ fontSize: '1rem' }}>{t('Apply for Scholarship')}</h4>
                  <p className="hindi" style={{ color: 'var(--gray-500)', fontSize: '0.8rem' }}>{t('New programs open for 2024')}</p>
                </div>
                <ArrowRight size={20} color="var(--gray-400)" />
              </Link>
              <Link to="/student/materials" className="card" style={{ display: 'flex', alignItems: 'center', gap: 16, borderLeft: '4px solid #3b82f6', padding: 20 }}>
                <div style={{ width: 56, height: 56, borderRadius: 'var(--radius-md)', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}>
                  <BookOpen size={24} />
                </div>
                <div style={{ flex: 1 }}>
                  <h4 className="hindi" style={{ fontSize: '1rem' }}>{t('Study Materials')}</h4>
                  <p className="hindi" style={{ color: 'var(--gray-500)', fontSize: '0.8rem' }}>{t('Download latest UPSC/SSC notes')}</p>
                </div>
                <ArrowRight size={20} color="var(--gray-400)" />
              </Link>
            </div>

            {/* Tracker */}
            {latestApp && (
              <div className="card" style={{ padding: 24, background: '#fff' }}>
                <h3 className="hindi" style={{ fontSize: '1.1rem', marginBottom: 20 }}>{t('Scholarship Tracker')}</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', padding: '0 10px' }}>
                  {/* Steps logic simplified for brevity but functional */}
                  <div style={{ flex: 1, textAlign: 'center' }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#10b981', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
                      <CheckCircle size={18} />
                    </div>
                    <div style={{ fontSize: '0.75rem', marginTop: 8 }}>{t('Submitted')}</div>
                  </div>
                  <div style={{ flex: 1, textAlign: 'center' }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#f1f5f9', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
                      <Clock size={18} />
                    </div>
                    <div style={{ fontSize: '0.75rem', marginTop: 8 }}>{t('Verified')}</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Widgets Grid */}
          <div className="grid grid-3" style={{ gap: 24 }}>
             <div className="card" style={{ padding: 24, gridColumn: '1 / -1' }}>
                <h4 className="hindi" style={{ marginBottom: 20, fontSize: '1.1rem', fontWeight: 800, color: 'var(--dvs-orange)' }}>
                   {t('Our Core Programs')}
                </h4>
                <div className="grid grid-3" style={{ gap: 20 }}>
                   <div className="program-card-mini">
                      <img src="/images/news-scholarship.png" alt="Education" style={{ width: '100%', height: 100, objectFit: 'cover', borderRadius: 12, marginBottom: 12 }} />
                      <h5 className="hindi" style={{ margin: '0 0 4px', fontSize: '0.9rem' }}>{t('Quality Education')}</h5>
                      <p className="hindi" style={{ margin: 0, fontSize: '0.75rem', color: 'var(--gray-500)' }}>{t('Free coaching and study materials.')}</p>
                   </div>
                   <div className="program-card-mini">
                      <img src="/images/news-digital.png" alt="Digital" style={{ width: '100%', height: 100, objectFit: 'cover', borderRadius: 12, marginBottom: 12 }} />
                      <h5 className="hindi" style={{ margin: '0 0 4px', fontSize: '0.9rem' }}>{t('Digital Literacy')}</h5>
                      <p className="hindi" style={{ margin: 0, fontSize: '0.75rem', color: 'var(--gray-500)' }}>{t('Basic computer and internet skills.')}</p>
                   </div>
                   <div className="program-card-mini">
                      <img src="/images/success_story.png" alt="Coaching" style={{ width: '100%', height: 100, objectFit: 'cover', borderRadius: 12, marginBottom: 12 }} />
                      <h5 className="hindi" style={{ margin: '0 0 4px', fontSize: '0.9rem' }}>{t('Competitive Coaching')}</h5>
                      <p className="hindi" style={{ margin: 0, fontSize: '0.75rem', color: 'var(--gray-500)' }}>{t('Prepare for SSC, Railway & more.')}</p>
                   </div>
                </div>
             </div>
             <div className="card" style={{ padding: 20, background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', color: 'white' }}>
                <h4 className="hindi" style={{ marginBottom: 12, fontSize: '0.95rem' }}>{t('DVS Points')}</h4>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fbbf24' }}>{stats.points}</div>
             </div>
             <div className="card" style={{ padding: 20 }}>
                <h4 className="hindi" style={{ marginBottom: 16, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                   <Award size={18} color="#f59e0b" /> {t('Badges')}
                </h4>
                <div style={{ display: 'flex', gap: 8 }}>
                   <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Star size={16} color="#d97706" /></div>
                </div>
             </div>
          </div>

        </div>
      </main>
    </div>
  )
}
