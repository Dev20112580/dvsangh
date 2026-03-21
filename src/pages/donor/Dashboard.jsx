import { useEffect, useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import { Home, Heart, BarChart2, User, TrendingUp, ArrowRight, Menu, X } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'

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
        <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h1 className="hindi">नमस्ते, {profile?.full_name?.split(' ')[0] || t('Donor')}! 💝</h1>
            <p className="hindi" style={{ fontSize: '0.9rem' }}>{t('Your donation is changing children\'s lives')}</p>
          </div>
          <button 
            className="mobile-only-flex" 
            onClick={() => setIsMobileMenuOpen(true)}
            style={{ padding: 10, background: 'white', border: '1px solid #e2e8f0', borderRadius: 8, color: '#A1401D' }}
          >
            <Menu size={20} />
          </button>
        </div>

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
            {/* Donation Trends */}
            <div className="card" style={{ padding: 24 }}>
               <h3 className="hindi" style={{ fontSize: '1.1rem', marginBottom: 24 }}>{t('Donation History')}</h3>
               <div style={{ height: 160, display: 'flex', alignItems: 'flex-end', gap: 20, paddingBottom: 20, borderBottom: '1px solid #f1f5f9' }}>
                  {[12, 18, 5, 25, 10, 15].map((h, i) => (
                    <div key={i} style={{ flex: 1, position: 'relative' }}>
                       <div style={{ width: '100%', height: h * 5, background: i === 3 ? '#db2777' : '#fce7f3', borderRadius: '4px 4px 0 0' }}></div>
                       <div style={{ textAlign: 'center', fontSize: '0.65rem', marginTop: 8, color: 'var(--gray-400)' }}>{['Jan','Feb','Mar','Apr','May','Jun'][i]}</div>
                    </div>
                  ))}
               </div>
            </div>

            <div className="card" style={{ padding: 24 }}>
               <h3 className="hindi" style={{ fontSize: '1.1rem', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <TrendingUp size={20} color="#db2777" /> {t('Your Impact Summary')}
               </h3>
               <div className="grid grid-3">
                  <div style={{ textAlign: 'center', padding: 16, background: '#fdf2f8', borderRadius: 12 }}>
                     <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#db2777' }}>{Math.floor(stats.total / 5000)}</div>
                     <div style={{ fontSize: '0.7rem', color: '#9d174d' }}>{t('Children Supported')}</div>
                  </div>
                  <div style={{ textAlign: 'center', padding: 16, background: '#f0fdf4', borderRadius: 12 }}>
                     <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#166534' }}>{Math.floor(stats.total / 50)}</div>
                     <div style={{ fontSize: '0.7rem', color: '#166534' }}>{t('Meals Provided')}</div>
                  </div>
                  <div style={{ textAlign: 'center', padding: 16, background: '#eff6ff', borderRadius: 12 }}>
                     <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1e40af' }}>{Math.floor(stats.total / 200)}</div>
                     <div style={{ fontSize: '0.7rem', color: '#1e40af' }}>{t('Books Donated')}</div>
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
