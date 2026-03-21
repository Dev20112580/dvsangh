import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { Menu, X, Globe, LogOut, Search, Bell, XCircle, GraduationCap, Calendar, MessageSquare, ChevronRight, Heart } from 'lucide-react'
import { supabase } from '../lib/supabase'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About Us' },
  { to: '/programs', label: 'Programs' },
  { to: '/events', label: 'Events' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/news', label: 'News' }, // Added News to Navbar
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const { user, profile, signOut } = useAuth()
  const { t, language, setLanguage, supportedLanguages } = useLanguage()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])

  const handleSearchInput = async (val) => {
    setSearchQuery(val)
    if (val.length < 2) {
      setSuggestions([])
      return
    }

    const [scholarships, events, forum] = await Promise.all([
      supabase.from('scholarship_applications').select('id, full_name').ilike('full_name', `%${val}%`).limit(2),
      supabase.from('events').select('id, title').ilike('title', `%${val}%`).limit(2),
      supabase.from('forum_posts').select('id, title').ilike('title', `%${val}%`).limit(2)
    ])

    const combined = [
      ...(scholarships.data || []).map(s => ({ title: s.full_name, type: 'scholarship', link: '/dashboard/student' })),
      ...(events.data || []).map(e => ({ title: e.title, type: 'event', link: '/events' })),
      ...(forum.data || []).map(f => ({ title: f.title, type: 'forum', link: '/forum' }))
    ]
    setSuggestions(combined)
  }

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const getDashboardLink = () => {
    if (!profile) return '/login'
    if (profile.role === 'admin') return '/admin/dashboard'
    return `/dashboard/${profile.role}`
  }

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="navbar-inner">
          <Link to="/" className="navbar-brand" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img src="/logo_dvs.jpg" alt="DVS Logo" style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', border: '1.5px solid #A1401D' }} />
            <div className="brand-text" style={{ marginLeft: 0 }}>
              <div className="brand-hi" style={{ fontSize: '1.25rem', color: '#A1401D', fontFamily: 'var(--font-heading)', fontWeight: 700 }}>Dronacharya Vidyarthi Sangh</div>
            </div>
          </Link>

          <div className="navbar-links">
            {navLinks.map(link => (
              <NavLink key={link.to} to={link.to} end={link.to === '/'}>
                {t(link.label)}
              </NavLink>
            ))}
          </div>

          <div className="navbar-actions">
            {/* Search Button */}
            <button 
              onClick={() => setSearchOpen(true)}
              className="btn-icon" 
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8 }}
              aria-label={t('Open Search')}
            >
              <Search size={20} color="var(--dark)" />
            </button>

            {/* Notification Button */}
            <div style={{ position: 'relative' }}>
               <button 
                 onClick={() => setNotificationsOpen(!notificationsOpen)}
                 className="btn-icon" 
                 style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8 }}
                 aria-label={t('Toggle Notifications')}
               >
                 <Bell size={20} color="var(--dark)" />
                 <span style={{ position: 'absolute', top: 8, right: 8, width: 8, height: 8, background: 'var(--danger)', borderRadius: '50%', border: '2px solid white' }}></span>
               </button>

               {/* Notifications Dropdown */}
               {notificationsOpen && (
                 <div style={{ position: 'absolute', top: '100%', right: 0, width: 320, background: 'white', border: '1px solid var(--gray-200)', borderRadius: 12, boxShadow: 'var(--shadow-lg)', zIndex: 100, padding: 16, marginTop: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                       <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700 }}>{t('Notifications')}</h4>
                       <button onClick={() => setNotificationsOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--gray-400)', cursor: 'pointer' }} aria-label={t('Close')}><X size={16} /></button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                       <div style={{ padding: '8px 0', borderBottom: '1px solid var(--gray-100)', cursor: 'pointer' }}>
                          <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{t('Scholarship Approved')}!</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>2 {t('hours ago')}</div>
                       </div>
                       <div style={{ padding: '8px 0', borderBottom: '1px solid var(--gray-100)', cursor: 'pointer' }}>
                          <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{t('New Event')}: UPSC Strategy</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>5 {t('hours ago')}</div>
                       </div>
                    </div>
                    <button className="hindi" style={{ width: '100%', marginTop: 12, padding: 8, background: 'var(--gray-50)', border: 'none', borderRadius: 8, fontSize: '0.75rem', fontWeight: 600, color: '#A1401D', cursor: 'pointer' }}>
                       {t('View All Notifications')}
                    </button>
                 </div>
               )}
            </div>

            {/* Language Selector */}
            <div style={{ position: 'relative' }} className="language-selector desktop-hidden">
              <button 
                onClick={() => setNotificationsOpen(false) || setSearchOpen(false)} // Close other dropdowns
                className="btn btn-sm" 
                style={{ background: 'var(--gray-100)', color: 'var(--dark)', fontWeight: 700, border: '1px solid var(--gray-200)', display: 'flex', alignItems: 'center', gap: 6, borderRadius: 20, padding: '6px 14px', marginRight: 8, marginLeft: 8 }}
              >
                <Globe size={14} color="#A1401D" /> 
                {supportedLanguages.find(l => l.code === language)?.native || 'English'}
              </button>
              <div className="language-dropdown" style={{ position: 'absolute', top: '100%', right: 0, background: 'white', border: '1px solid var(--gray-200)', borderRadius: 12, boxShadow: 'var(--shadow-lg)', zIndex: 100, padding: 8, marginTop: 12, display: 'none', flexDirection: 'column', minWidth: 120 }}>
                {supportedLanguages.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => { setLanguage(lang.code); }}
                    style={{ padding: '8px 12px', background: language === lang.code ? 'var(--gray-50)' : 'none', border: 'none', borderRadius: 8, textAlign: 'left', cursor: 'pointer', fontWeight: language === lang.code ? 700 : 500, color: language === lang.code ? '#A1401D' : 'var(--dark)', fontSize: '0.85rem' }}
                  >
                    {lang.native}
                  </button>
                ))}
              </div>
            </div>
            <style>{`
              .language-selector:hover .language-dropdown { display: flex !important; }
            `}</style>

            {user ? (
              <>
                <Link to={getDashboardLink()} className="btn btn-sm" style={{ background: 'transparent', color: 'var(--dark)', fontWeight: 600, border: 'none' }}>
                  {t(profile?.role === 'admin' ? 'Admin Panel' : 'Dashboard')}
                </Link>
                <button onClick={handleSignOut} className="btn btn-sm btn-icon" title="Logout" aria-label={t('Logout')}>
                  <LogOut size={18} color="var(--dark)" />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-sm" style={{ background: 'transparent', color: 'var(--dark)', fontWeight: 600, border: 'none' }}>{t('Sign In')}</Link>
              </>
            )}
            
            <Link to="/donate" className="btn btn-sm desktop-hidden" style={{ background: '#A1401D', color: 'white', borderRadius: '4px', padding: '10px 24px', fontWeight: 600, marginLeft: 8 }}>
              {t('Donate Now')}
            </Link>

            <button
              className="navbar-hamburger"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? t('Close Menu') : t('Open Menu')}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Global Search Overlay */}
        {searchOpen && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(255,255,255,0.98)', zIndex: 1000, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 100 }}>
             <button onClick={() => setSearchOpen(false)} style={{ position: 'absolute', top: 40, right: 40, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-400)' }}><XCircle size={40} /></button>
             <div style={{ width: '100%', maxWidth: 800, padding: '0 20px' }}>
                 <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <Search size={32} color="#A1401D" style={{ position: 'absolute', left: 24 }} />
                    <input 
                      autoFocus
                      className="hindi"
                      placeholder={t('Global Archive Search...')} 
                      value={searchQuery}
                      onChange={(e) => handleSearchInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          navigate(`/search?q=${searchQuery}`)
                          setSearchOpen(false)
                        }
                      }}
                      style={{ width: '100%', padding: '24px 24px 24px 72px', fontSize: '2rem', border: 'none', borderBottom: '4px solid #f1f5f9', background: 'none', outline: 'none', fontWeight: 700 }}
                    />
                 </div>
                 
                 {suggestions.length > 0 && (
                   <div style={{ marginTop: 20, background: 'white', borderRadius: 16, boxShadow: '0 10px 40px rgba(0,0,0,0.1)', overflow: 'hidden', border: '1px solid #f1f5f9' }}>
                      {suggestions.map((s, i) => (
                        <div 
                          key={i} 
                          onClick={() => { navigate(s.link); setSearchOpen(false); }}
                          style={{ padding: '16px 24px', borderBottom: '1px solid #f8fafc', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 16, transition: 'all 0.2s' }}
                          onMouseEnter={e => e.currentTarget.style.background = '#fff7ed'}
                          onMouseLeave={e => e.currentTarget.style.background = 'white'}
                        >
                           {s.type === 'scholarship' ? <GraduationCap size={18} color="#A1401D" /> : s.type === 'event' ? <Calendar size={18} color="#FF6B35" /> : <MessageSquare size={18} color="#3b82f6" />}
                           <div style={{ flex: 1 }}>
                              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{s.title}</div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>{t(s.type)}</div>
                           </div>
                           <ChevronRight size={16} color="var(--gray-300)" />
                        </div>
                      ))}
                   </div>
                 )}
                <div style={{ marginTop: 40 }}>
                   <h4 className="hindi" style={{ fontSize: '1rem', color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 20 }}>{t('Recent Searches')}</h4>
                   <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                      {['UPSC Batch', 'Scholarship 2024', 'Volunteering', 'Success Stories'].map(term => (
                        <div key={term} style={{ padding: '8px 16px', borderRadius: 20, background: '#f8fafc', color: '#A1401D', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }}>{term}</div>
                      ))}
                   </div>
                </div>
             </div>
          </div>
        )}
      </nav>

      <div className={`mobile-nav ${mobileOpen ? 'open' : ''}`}>
        <div style={{ padding: '16px', display: 'flex', justifyContent: 'center' }}>
           <div style={{ width: '100%', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
             {supportedLanguages.map(lang => (
               <button 
                 key={lang.code}
                 onClick={() => { setLanguage(lang.code); setMobileOpen(false); }}
                 style={{ flex: 1, padding: '12px', background: language === lang.code ? 'var(--gray-100)' : 'white', color: language === lang.code ? '#A1401D' : 'var(--dark)', fontWeight: 700, border: '1px solid var(--gray-200)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
               >
                 {lang.native}
               </button>
             ))}
           </div>
        </div>
        
        <Link to="/donate" style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, color: '#A1401D', fontWeight: 700, borderBottom: '1px solid var(--gray-100)' }} onClick={() => setMobileOpen(false)}>
          <Heart size={18} /> {t('Donate Now')}
        </Link>
        
        {navLinks.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            onClick={() => setMobileOpen(false)}
          >
            {t(link.label)}
          </NavLink>
        ))}
        <hr style={{ border: 'none', borderTop: '1px solid var(--gray-200)', margin: '12px 0' }} />
        {user ? (
          <>
            <Link to={getDashboardLink()} onClick={() => setMobileOpen(false)}>
              {t('Student Portal')}
            </Link>
            <button onClick={() => { handleSignOut(); setMobileOpen(false) }}
              style={{ padding: '14px 16px', textAlign: 'left', background: 'none', border: 'none', color: 'var(--danger)', fontWeight: 500, cursor: 'pointer' }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" onClick={() => setMobileOpen(false)}>{t('Sign In')}</Link>
          </>
        )}
      </div>
    </>
  )
}
