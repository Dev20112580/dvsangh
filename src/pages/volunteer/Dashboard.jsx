import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import { Home, CheckSquare, Clock, User, HandHeart, Trophy, Calendar, ArrowRight, Users, Menu, X } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'
import DashboardHeader from '../../components/dashboard/DashboardHeader'

export default function VolunteerDashboard() {
  const { user, profile } = useAuth()
  const { t } = useLanguage()
  const [stats, setStats] = useState({ tasks: 0, hours: 0, events: 0, points: 0, badges: [] })
  const [loading, setLoading] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (user) fetchStats()
  }, [user])

  async function fetchStats() {
    setLoading(true)
    try {
      const { data: hoursData } = await supabase
        .from('volunteer_hours')
        .select('hours')
        .eq('user_id', user.id)
        .eq('is_verified', true)
      
      const totalHours = hoursData?.reduce((acc, curr) => acc + parseFloat(curr.hours), 0) || 0

      const { count: taskCount } = await supabase
        .from('volunteer_tasks')
        .select('*', { count: 'exact', head: true })
        .eq('assigned_to', user.id)
        .eq('status', 'completed')

      const { data: badgeData } = await supabase
        .from('user_badges')
        .select('*')
        .eq('user_id', user.id)

      const { count: oppCount } = await supabase
        .from('volunteer_opportunities')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true)

      setStats({
        tasks: taskCount || 0,
        hours: totalHours,
        events: oppCount || 0,
        points: profile?.total_points || 0,
        badges: badgeData || []
      })
    } catch (error) {
      console.error('Error fetching volunteer stats:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="dashboard">
      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="drawer-overlay" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      <aside className={`sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
        <div style={{ padding: '24px 24px 0', textAlign: 'center' }}>
           <img src="/logo_dvs.webp" alt="DVS Logo" width="60" height="60" style={{ borderRadius: '50%', marginBottom: 12, border: '2px solid #FF6B35' }} />
        </div>
        <div className="sidebar-profile">
          <div style={{ position: 'absolute', top: 12, right: 12 }} className="desktop-hidden">
             <button onClick={() => setIsMobileMenuOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--gray-400)' }}>
               <X size={20} />
             </button>
          </div>
          <div className="sidebar-avatar" style={{ background: 'var(--success-bg)', color: 'var(--success)' }}>{profile?.full_name?.charAt(0) || '?'}</div>
          <div className="sidebar-name hindi">{profile?.full_name || t('Volunteer')}</div>
          <div className="sidebar-meta">{t('Volunteer')}</div>
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/dashboard/volunteer" onClick={() => setIsMobileMenuOpen(false)}><Home size={18} /> {t('Dashboard')}</NavLink>
          <NavLink to="/volunteer/tasks" onClick={() => setIsMobileMenuOpen(false)}><CheckSquare size={18} /> {t('Tasks')}</NavLink>
          <NavLink to="/volunteer/hours" onClick={() => setIsMobileMenuOpen(false)}><Clock size={18} /> {t('Hours Log')}</NavLink>
          <NavLink to="/volunteer/profile" onClick={() => setIsMobileMenuOpen(false)}><User size={18} /> {t('Profile')}</NavLink>
        </nav>
      </aside>

      <main className="dashboard-content">
        <DashboardHeader 
          onMenuClick={() => setIsMobileMenuOpen(true)} 
          profile={profile} 
        />

        <div className="grid grid-4" style={{ marginBottom: 32 }}>
          <div className="stat-card" style={{ borderTop: '4px solid #10B981', background: 'white' }}>
             <div className="stat-value" style={{ color: '#10B981' }}>{stats.hours}</div>
             <div className="stat-label">Total {t('Hours')}</div>
          </div>
          <div className="stat-card" style={{ borderTop: '4px solid #3b82f6', background: 'white' }}>
             <div className="stat-value" style={{ color: '#3b82f6' }}>{stats.tasks}</div>
             <div className="stat-label">{t('Tasks Done')}</div>
          </div>
          <div className="stat-card" style={{ borderTop: '4px solid #FF6B35', background: 'white' }}>
             <div className="stat-value" style={{ color: '#FF6B35' }}>{stats.points}</div>
             <div className="stat-label">{t('Badges')}</div>
          </div>
          <div className="stat-card" style={{ borderTop: '4px solid #2D5016', background: 'white' }}>
             <div className="stat-value" style={{ color: '#2D5016', textTransform: 'capitalize' }}>
                {stats.points < 100 ? 'Bronze' : stats.points < 500 ? 'Silver' : stats.points < 2000 ? 'Gold' : 'Platinum'}
             </div>
             <div className="stat-label">{t('Volunteer Level')}</div>
          </div>
        </div>

        {/* Level Progress */}
        <div className="card" style={{ padding: 24, marginBottom: 32, background: 'linear-gradient(90deg, #f8fafc 0%, #ffffff 100%)' }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <h4 className="hindi" style={{ fontWeight: 800 }}>{t('Level Progress')}</h4>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#FF6B35' }}>{stats.points} / {stats.points < 100 ? 100 : stats.points < 500 ? 500 : 2000} XP</span>
           </div>
           <div style={{ height: 10, background: '#e2e8f0', borderRadius: 5, overflow: 'hidden' }}>
              <div style={{ width: `${(stats.points / (stats.points < 100 ? 100 : stats.points < 500 ? 500 : 2000)) * 100}%`, height: '100%', background: 'linear-gradient(90deg, #FF6B35 0%, #FF9F1C 100%)', transition: 'width 1s ease-out' }}></div>
           </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 24 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Hours Chart */}
            <div className="card" style={{ padding: 24 }}>
               <h3 className="hindi" style={{ fontSize: '1.1rem', marginBottom: 24 }}>{t('Volunteer Hours (Weekly)')}</h3>
               <div style={{ height: 160, display: 'flex', alignItems: 'flex-end', gap: 20, paddingBottom: 20, borderBottom: '1px solid #f1f5f9' }}>
                  {[4, 2, 8, 5, 3, 6, 4].map((h, i) => (
                    <div key={i} style={{ flex: 1, position: 'relative' }}>
                       <div style={{ width: '100%', height: h * 15, background: i === 2 ? '#A1401D' : '#e2e8f0', borderRadius: '4px 4px 0 0' }}></div>
                       <div style={{ textAlign: 'center', fontSize: '0.65rem', marginTop: 8, color: 'var(--gray-400)' }}>{['M','T','W','T','F','S','S'][i]}</div>
                    </div>
                  ))}
               </div>
            </div>

            <div className="grid grid-2">
              <NavLink to="/volunteer/tasks" className="card" style={{ display: 'flex', alignItems: 'center', gap: 16, borderLeft: '4px solid #10B981', padding: 20 }}>
                <div style={{ width: 56, height: 56, borderRadius: 12, background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981' }}>
                  <CheckSquare size={24} />
                </div>
                <div><h4 className="hindi" style={{ fontSize: '1rem' }}>{t('View Tasks')}</h4><p className="hindi" style={{ color: 'var(--gray-500)', fontSize: '0.8rem' }}>{t('Available assignments')}</p></div>
              </NavLink>
              <NavLink to="/volunteer/hours" className="card" style={{ display: 'flex', alignItems: 'center', gap: 16, borderLeft: '4px solid #3b82f6', padding: 20 }}>
                <div style={{ width: 56, height: 56, borderRadius: 12, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}>
                  <Clock size={24} />
                </div>
                <div><h4 className="hindi" style={{ fontSize: '1rem' }}>{t('Log Hours')}</h4><p className="hindi" style={{ color: 'var(--gray-500)', fontSize: '0.8rem' }}>{t('Record volunteer hours')}</p></div>
              </NavLink>
            </div>
          </div>

          <div className="grid grid-2" style={{ gap: 24 }}>
             <div className="card" style={{ padding: 20 }}>
                <h4 className="hindi" style={{ marginBottom: 16, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                   <Trophy size={18} color="#fbbf24" /> {t('My Badges')}
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: 12 }}>
                   {stats.badges?.length > 0 ? stats.badges.slice(0, 4).map(b => (
                     <div key={b.id} style={{ textAlign: 'center', padding: 12, background: '#fffbeb', borderRadius: 12, border: '1px solid #fef3c7' }}>
                        <HandHeart size={24} color="#f59e0b" style={{ margin: '0 auto 8px' }} />
                        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#92400e' }}>{t(b.badge_name)}</div>
                     </div>
                   )) : (
                     <div className="hindi" style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#64748b', fontSize: '0.8rem', padding: 12 }}>
                       {t('Complete tasks to earn badges!')}
                     </div>
                   )}
                </div>
             </div>

             <div className="card" style={{ padding: 20, background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', color: 'white' }}>
                <h4 className="hindi" style={{ marginBottom: 12, fontSize: '0.95rem' }}>{t('Matching Opportunities')}</h4>
                <div style={{ fontSize: '0.75rem', opacity: 0.9, marginBottom: 16 }}>{t('We found matching roles for your skills')}</div>
                <NavLink to="/volunteer/opportunities" className="hindi" style={{ display: 'block', textAlign: 'center', padding: '10px', background: 'white', borderRadius: 8, color: '#059669', fontSize: '0.8rem', fontWeight: 800 }}>
                   {t('Check Matches')}
                </NavLink>
             </div>
          </div>
        </div>
      </main>
    </div>
  )
}
