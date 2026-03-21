import { useState, useEffect } from 'react'
import { Menu, Bell, Search, Shield, User, LogOut } from 'lucide-react'
import AdminSidebar from './AdminSidebar'
import { useAdminAuth } from '../../context/AdminAuthProvider'
import { useLanguage } from '../../context/LanguageContext'

export default function AdminLayout({ children }) {
  const { adminProfile, refinedLevel, logout } = useAdminAuth()
  const { t } = useLanguage()
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const headerStyles = {
    height: '64px',
    background: 'white',
    borderBottom: '1px solid #e2e8f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 24px',
    position: 'sticky',
    top: 0,
    zIndex: 40,
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
      {/* Sidebar */}
      <AdminSidebar 
        isMobile={isMobile} 
        isOpen={isMobileSidebarOpen} 
        onClose={() => setIsMobileSidebarOpen(false)} 
      />

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Header */}
        <header style={headerStyles}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {isMobile && (
              <button 
                onClick={() => setIsMobileSidebarOpen(true)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <Menu size={24} />
              </button>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#64748b' }}>
              <Search size={18} />
              <input 
                type="text" 
                placeholder={t('Global search...')} 
                style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '0.9rem', width: isMobile ? '120px' : '200px' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <button style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
              <Bell size={20} />
              <span style={{ position: 'absolute', top: -2, right: -2, width: 8, height: 8, background: '#ef4444', borderRadius: '50%', border: '2px solid white' }}></span>
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '4px 12px', borderLeft: '1px solid #e2e8f0' }}>
              <div style={{ textAlign: 'right', display: isMobile ? 'none' : 'block' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e293b' }}>{adminProfile?.name}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{refinedLevel} Access</div>
              </div>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#A1401D' }}>
                <User size={20} />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main style={{ flex: 1, padding: isMobile ? '20px' : '32px', maxWidth: '1600px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
          {children}
        </main>
      </div>

      {/* Mobile Overlay */}
      {isMobile && isMobileSidebarOpen && (
        <div 
          onClick={() => setIsMobileSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 45, backdropFilter: 'blur(4px)' }}
        />
      )}
    </div>
  )
}
