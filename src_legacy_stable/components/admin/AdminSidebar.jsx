import { NavLink } from 'react-router-dom'
import { 
  LayoutDashboard, Users, GraduationCap, Heart, Calendar, FileText, 
  MessageCircle, IndianRupee, History, Settings, Zap, Shield, Activity, 
  Search, Bell, LogOut 
} from 'lucide-react'
import { useAdminAuth } from '../../context/AdminAuthProvider'
import { useLanguage } from '../../context/LanguageContext'

const NAV_LINKS = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard', access: ['L1', 'L2', 'L3a', 'L3b'] },
  { to: '/admin/users', icon: Users, label: 'Users', access: ['L1', 'L2'] },
  { to: '/admin/management', icon: Shield, label: 'Admin Hierarchy', access: ['L1'] },
  { to: '/admin/performance', icon: Activity, label: 'Admin Performance', access: ['L1'] },
  { to: '/admin/scholarships', icon: GraduationCap, label: 'Scholarships', access: ['L1', 'L2', 'L3a'] },
  { to: '/admin/donations', icon: IndianRupee, label: 'Finance', access: ['L1', 'L3b'] },
  { to: '/admin/events', icon: Calendar, label: 'Events', access: ['L1', 'L2', 'L3a'] },
  { to: '/admin/content', icon: FileText, label: 'Content', access: ['L1', 'L2', 'L3a'] },
  { to: '/admin/workflows', icon: Zap, label: 'Workflows', access: ['L1'] },
  { to: '/admin/communication', icon: MessageCircle, label: 'Broadcast', access: ['L1', 'L2'] },
  { to: '/admin/reports', icon: Activity, label: 'Reports', access: ['L1', 'L2', 'L3b'] },
  { to: '/admin/audit', icon: History, label: 'Audit Trail', access: ['L1'] },
  { to: '/admin/chat', icon: MessageCircle, label: 'Messages', access: ['L1', 'L2', 'L3a', 'L3b'] },
  { to: '/admin/settings', icon: Settings, label: 'Settings', access: ['L1'] },
]

export default function AdminSidebar({ isMobile, isOpen, onClose }) {
  const { adminProfile, refinedLevel, logout } = useAdminAuth()
  const { t } = useLanguage()

  const filteredLinks = NAV_LINKS.filter(link => link.access.includes(refinedLevel))

  const sidebarStyles = {
    width: isMobile ? '280px' : '260px',
    height: '100vh',
    background: '#1e293b',
    color: 'white',
    position: isMobile ? 'fixed' : 'sticky',
    top: 0,
    left: isMobile ? (isOpen ? 0 : '-280px') : 0,
    zIndex: 50,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: isMobile && isOpen ? '20px 0 50px rgba(0,0,0,0.3)' : 'none',
  }

  return (
    <aside style={sidebarStyles}>
      {/* Header */}
      <div style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 40, height: 40, background: 'rgba(255,255,255,0.1)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Shield size={22} color="#fb923c" />
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: '1.2rem', letterSpacing: -0.5 }}>DVS <span style={{ color: '#fb923c' }}>ADMIN</span></div>
          <div style={{ fontSize: '0.65rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700 }}>{adminProfile?.refinedLevel || refinedLevel} Access</div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '20px 12px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {filteredLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            onClick={isMobile ? onClose : undefined}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '12px 16px',
              borderRadius: 8,
              fontSize: '0.9rem',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'all 0.2s',
              color: isActive ? 'white' : '#94a3b8',
              background: isActive ? '#A1401D' : 'transparent',
            })}
            className={({ isActive }) => isActive ? 'active-nav' : ''}
          >
            <link.icon size={18} />
            <span className="hindi">{t(link.label)}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Quick Info & Logout */}
      <div style={{ padding: '20px', background: 'rgba(0,0,0,0.2)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#A1401D', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem' }}>
            {adminProfile?.name?.charAt(0) || 'A'}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{adminProfile?.name}</div>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{adminProfile?.id}</div>
          </div>
        </div>
        <button
          onClick={logout}
          style={{ width: '100%', padding: '10px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: 8, fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.2s' }}
          onMouseOver={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'}
          onMouseOut={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
        >
          <LogOut size={16} />
          {t('Sign Out')}
        </button>
      </div>
    </aside>
  )
}
