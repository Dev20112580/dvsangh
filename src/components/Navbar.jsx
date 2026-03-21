import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { 
  Menu, X, Globe, LogOut, Search, Bell, XCircle, 
  GraduationCap, Calendar, MessageSquare, ChevronRight, Heart 
} from 'lucide-react'
import { supabase } from '../lib/supabase'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About Us' },
  { to: '/programs', label: 'Programs' },
  { to: '/events', label: 'Events' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/news', label: 'News' },
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
      ...(forum.data || []).map(f => ({ title: f.title, type: 'forum', link: '/community/forum' }))
    ]
    setSuggestions(combined)
  }

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setMobileOpen(false)
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [])

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = 'unset'
  }, [mobileOpen])

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
          <Link to="/" className="navbar-brand">
            <img 
              src="/logo_dvs.jpg" 
              alt="DVS Logo" 
              width="44" 
              height="44" 
              style={{ borderRadius: '50%', objectFit: 'cover', border: '1.5px solid #A1401D' }} 
              loading="eager" 
            />
            <div className="brand-text">
              <div className="brand-hi">Dronacharya Vidyarthi Sangh</div>
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
            <div style={{ position: 'relative' }} className="mobile-only">
               <button 
                 onClick={() => setNotificationsOpen(!notificationsOpen)}
                 className="btn-icon" 
                 style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8 }}
                 aria-label={t('Toggle Notifications')}
               >
                 <Bell size={20} color="var(--dark)" />
                 <span style={{ position: 'absolute', top: 8, right: 8, width: 8, height: 8, background: 'var(--danger)', borderRadius: '50%', border: '2px solid white' }}></span>
               </button>

               {notificationsOpen && (
                 <div style={{ position: 'absolute', top: '100%', right: 0, width: 300, background: 'white', border: '1px solid var(--gray-200)', borderRadius: 12, boxShadow: 'var(--shadow-lg)', zIndex: 100, padding: 16, marginTop: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                       <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700 }}>{t('Notifications')}</h4>
                       <button onClick={() => setNotificationsOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--gray-400)', cursor: 'pointer' }}><X size={16} /></button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                       <div style={{ padding: '8px 0', borderBottom: '1px solid var(--gray-100)', cursor: 'pointer' }}>
                          <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{t('Scholarship Approved')}!</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>2 {t('hours ago')}</div>
                       </div>
                    </div>
                 </div>
               )}
            </div>

            {/* Language Selector (Desktop) */}
            <div className="language-selector mobile-only" style={{ position: 'relative' }}>
              <button className="btn btn-sm" style={{ background: 'var(--gray-100)', color: 'var(--dark)', fontWeight: 700, border: '1px solid var(--gray-200)', borderRadius: 20, padding: '6px 14px' }}>
                <Globe size={14} color="#A1401D" /> 
                <span style={{ marginLeft: 6 }}>{supportedLanguages.find(l => l.code === language)?.native || 'English'}</span>
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

            {/* Dashboard/Login Actions (Desktop) */}
            <div className="mobile-only" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {user ? (
                <>
                  <Link to={getDashboardLink()} className="btn btn-sm" style={{ background: 'transparent', color: 'var(--dark)', fontWeight: 600, border: 'none' }}>
                    {t(profile?.role === 'admin' ? 'Admin Panel' : 'Dashboard')}
                  </Link>
                  <button onClick={handleSignOut} className="btn btn-sm btn-icon" title="Logout">
                    <LogOut size={18} color="var(--dark)" />
                  </button>
                </>
              ) : (
                <Link to="/login" className="btn btn-sm" style={{ background: 'transparent', color: 'var(--dark)', fontWeight: 600, border: 'none' }}>{t('Sign In')}</Link>
              )}
            </div>
            
            <Link to="/donate" className="btn btn-sm desktop-hidden" style={{ background: '#A1401D', color: 'white', borderRadius: '8px', padding: '10px 24px', fontWeight: 600 }}>
              {t('Donate Now')}
            </Link>

            <button
              className="navbar-hamburger"
              onClick={() => setMobileOpen(true)}
              aria-label={t('Open Menu')}
            >
              <Menu size={24} />
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
             </div>
          </div>
        )}
      </nav>

      {/* Premium Mobile Menu Drawer */}
      <div className={`mobile-nav-overlay ${mobileOpen ? 'open' : ''}`} onClick={() => setMobileOpen(false)} />
      
      <div className={`mobile-nav ${mobileOpen ? 'open' : ''}`}>
        <button className="mobile-nav-close" onClick={() => setMobileOpen(false)}>
          <X size={20} />
        </button>

        <div style={{ marginBottom: 32 }}>
          <img src="/logo_dvs.webp" alt="Logo" width="48" height="48" style={{ borderRadius: '50%', marginBottom: 12 }} />
          <h2 style={{ fontSize: '1.2rem', color: '#A1401D' }}>Dronacharya Vidyarthi Sangh</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {navLinks.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              onClick={() => setMobileOpen(false)}
            >
              {t(link.label)}
              <ChevronRight size={16} color="var(--gray-300)" />
            </NavLink>
          ))}
        </div>

        <div className="mobile-nav-footer">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {supportedLanguages.slice(0, 4).map(lang => (
              <button 
                key={lang.code}
                onClick={() => { setLanguage(lang.code); setMobileOpen(false); }}
                style={{ 
                  padding: '12px', 
                  background: language === lang.code ? 'var(--dvs-orange-bg)' : 'var(--gray-50)', 
                  color: language === lang.code ? '#A1401D' : 'var(--dark)', 
                  fontWeight: 700, 
                  border: language === lang.code ? '1.5px solid #A1401D' : '1px solid var(--gray-200)', 
                  borderRadius: 12,
                  fontSize: '0.85rem'
                }}
              >
                {lang.native}
              </button>
            ))}
          </div>

          <Link 
            to="/donate" 
            className="btn btn-primary" 
            style={{ padding: '16px', borderRadius: 12, marginTop: 12 }}
            onClick={() => setMobileOpen(false)}
          >
            <Heart size={18} fill="white" /> {t('Donate Now')}
          </Link>

          {user ? (
            <div style={{ display: 'flex', gap: 8 }}>
              <Link 
                to={getDashboardLink()} 
                className="btn" 
                style={{ flex: 1, background: 'var(--gray-100)', color: 'var(--dark)', borderRadius: 12 }}
                onClick={() => setMobileOpen(false)}
              >
                {t('Dashboard')}
              </Link>
              <button 
                onClick={() => { handleSignOut(); setMobileOpen(false) }}
                className="btn"
                style={{ padding: '12px', background: 'var(--danger-bg)', color: 'var(--danger)', borderRadius: 12, border: 'none' }}
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <Link 
              to="/login" 
              className="btn" 
              style={{ background: 'var(--gray-100)', color: 'var(--dark)', borderRadius: 12 }}
              onClick={() => setMobileOpen(false)}
            >
              {t('Sign In')}
            </Link>
          )}
        </div>
      </div>
    </>
  )
}
