import { useEffect, useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import { Home, Heart, BarChart2, User, TrendingUp, ArrowRight, Menu, X } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'
import DashboardHeader from '../../components/dashboard/DashboardHeader'

export default function DonorDashboard() {
  const { user, profile } = useAuth()
  const { t, language } = useLanguage()
  const [stats, setStats] = useState({ total: 0, count: 0, lastAmount: 0, taxSaved: 0, points: 0 })
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
      const { data } = await supabase
        .from('donations')
        .select('amount')
        .eq('donor_id', user.id)
        .eq('payment_status', 'completed')
      
      const arr = data || []
      const total = arr.reduce((s, d) => s + (parseFloat(d.amount) || 0), 0)
      
      setStats({ 
        total, 
        count: arr.length, 
        lastAmount: arr[0]?.amount || 0, 
        taxSaved: Math.ceil(total * 0.5 * 0.3),
        points: profile?.total_points || 0
      })
    } catch (err) {
      console.error('Error fetching donor stats:', err)
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
           <img src="/logo_dvs.jpg" alt="DVS Logo" width="60" height="60" style={{ borderRadius: '50%', marginBottom: 12, border: '2px solid #FF6B35' }} />
        </div>
        <div className="sidebar-profile">
          <div style={{ position: 'absolute', top: 12, right: 12 }} className="desktop-hidden">
             <button onClick={() => setIsMobileMenuOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--gray-400)' }}>
               <X size={20} />
             </button>
          </div>
          <div className="sidebar-avatar" style={{ background: '#FDF2F8', color: '#EC4899' }}>{profile?.full_name?.charAt(0) || '?'}</div>
          <div className="sidebar-name hindi">{profile?.full_name || t('Donor')}</div>
          <div className="sidebar-meta">{t('Donor')}</div>
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/dashboard/donor" onClick={() => setIsMobileMenuOpen(false)}><Home size={18} /> {t('Dashboard')}</NavLink>
          <NavLink to="/donor/donations" onClick={() => setIsMobileMenuOpen(false)}><Heart size={18} /> {t('Donations')}</NavLink>
          <NavLink to="/donor/impact" onClick={() => setIsMobileMenuOpen(false)}><BarChart2 size={18} /> {t('Impact')}</NavLink>
          <NavLink to="/donor/profile" onClick={() => setIsMobileMenuOpen(false)}><User size={18} /> {t('Profile')}</NavLink>
        </nav>
      </aside>

      <main className="dashboard-content">
        <DashboardHeader 
          onMenuClick={() => setIsMobileMenuOpen(true)} 
          profile={profile} 
        />

        <div className="grid grid-4" style={{ marginBottom: 32 }}>
          <div className="stat-card" style={{ borderTop: '4px solid #db2777' }}>
             <div className="stat-value">₹{stats.total.toLocaleString(language === 'hi' ? 'hi-IN' : 'en-IN')}</div>
             <div className="stat-label">{t('Total Donated')}</div>
          </div>
          <div className="stat-card" style={{ borderTop: '4px solid #3b82f6' }}>
             <div className="stat-value">{stats.count}</div>
             <div className="stat-label">{t('Donations')}</div>
          </div>
          <div className="stat-card" style={{ borderTop: '4px solid #10B981' }}>
             <div className="stat-value">₹{stats.taxSaved.toLocaleString(language === 'hi' ? 'hi-IN' : 'en-IN')}</div>
             <div className="stat-label">{t('Tax Saved (80G)')}</div>
          </div>
          <div className="stat-card" style={{ borderTop: '4px solid #fbbf24' }}>
             <div className="stat-value" style={{ textTransform: 'capitalize' }}>
                {stats.points < 1000 ? 'Bronze' : stats.points < 5000 ? 'Silver' : 'Gold'}
             </div>
             <div className="stat-label">{t('Donor Level')}</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 24 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div className="card" style={{ padding: 24 }}>
               <h3 className="hindi" style={{ fontSize: '1.1rem', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10, color: 'var(--dvs-orange)' }}>
                  {t('Our Mission & Programs')}
               </h3>
               <div className="grid grid-3" style={{ gap: 20 }}>
                  <div className="program-card-mini">
                     <img src="/images/news-scholarship.png" alt="Education" style={{ width: '100%', height: 100, objectFit: 'cover', borderRadius: 12, marginBottom: 12 }} />
                     <h5 className="hindi" style={{ margin: '0 0 4px', fontSize: '0.9rem' }}>{t('Quality Education')}</h5>
                  </div>
                  <div className="program-card-mini">
                     <img src="/images/news-digital.png" alt="Digital" style={{ width: '100%', height: 100, objectFit: 'cover', borderRadius: 12, marginBottom: 12 }} />
                     <h5 className="hindi" style={{ margin: '0 0 4px', fontSize: '0.9rem' }}>{t('Digital Literacy')}</h5>
                  </div>
                  <div className="program-card-mini">
                     <img src="/images/success_story.png" alt="Coaching" style={{ width: '100%', height: 100, objectFit: 'cover', borderRadius: 12, marginBottom: 12 }} />
                     <h5 className="hindi" style={{ margin: '0 0 4px', fontSize: '0.9rem' }}>{t('Impact Stories')}</h5>
                  </div>
               </div>
            </div>
          </div>

          <div className="grid grid-2" style={{ gap: 24 }}>
             <div className="card" style={{ padding: 20, background: 'linear-gradient(135deg, #db2777 0%, #9d174d 100%)', color: 'white' }}>
                <h4 className="hindi" style={{ marginBottom: 12, fontSize: '0.95rem' }}>{t('Quick Donate')}</h4>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
                   {[500, 1000].map(amt => (
                      <Link key={amt} to="/donate" className="btn" style={{ flex: 1, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', justifyContent: 'center' }}>
                         ₹{amt.toLocaleString()}
                      </Link>
                   ))}
                </div>
                <Link to="/donate" className="hindi" style={{ display: 'block', textAlign: 'center', padding: '10px', background: 'white', borderRadius: 8, color: '#db2777', fontSize: '0.8rem', fontWeight: 800 }}>
                   {t('Donate Custom Amount')}
                </Link>
             </div>

             <div className="card" style={{ padding: 20 }}>
                <h4 className="hindi" style={{ marginBottom: 16, fontSize: '0.95rem' }}>{t('80G Certificate')}</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--gray-500)', marginBottom: 16 }}>{t('Your tax deduction certificate is ready.')}</p>
                <button onClick={() => window.print()} className="btn btn-secondary w-full hindi">{t('Download')}</button>
             </div>
          </div>
        </div>
      </main>
    </div>
  )
}
