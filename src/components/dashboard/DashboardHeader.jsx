import { Menu, Globe, Home, LogOut, User } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

export default function DashboardHeader({ onMenuClick, profile }) {
  const { language, setLanguage, t } = useLanguage();
  const { logout } = useAuth();

  return (
    <header className="dashboard-header-container" style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '16px 24px',
      background: 'white',
      borderBottom: '1px solid #e2e8f0',
      marginBottom: 24,
      borderRadius: 16,
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <button 
          className="mobile-only-flex" 
          onClick={onMenuClick}
          style={{ padding: 10, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, color: '#FF6B35' }}
        >
          <Menu size={20} />
        </button>
        <div className="desktop-hidden" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
           <img src="/logo_dvs.jpg" alt="DVS Logo" width="32" height="32" style={{ borderRadius: '50%' }} />
        </div>
        <div style={{ lineHeight: 1.2 }}>
          <h1 className="hindi" style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>नमस्ते, {profile?.full_name?.split(' ')[0] || t('Student')}! 👋</h1>
          <p className="hindi" style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>{t('Welcome to your dashboard')}</p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Language Switcher */}
        <button 
          onClick={() => setLanguage(language === 'hi' ? 'en' : 'hi')}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 6, 
            padding: '8px 12px', 
            borderRadius: 8, 
            border: '1px solid #e2e8f0', 
            background: '#f8fafc',
            fontSize: '0.8rem',
            fontWeight: 700,
            cursor: 'pointer',
            color: '#1e293b'
          }}
        >
          <Globe size={14} color="#FF6B35" />
          {language === 'hi' ? 'English' : 'हिंदी'}
        </button>

        <Link 
          to="/" 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 6, 
            padding: '8px 12px', 
            borderRadius: 8, 
            border: '1px solid #e2e8f0', 
            background: 'white',
            fontSize: '0.8rem',
            fontWeight: 700,
            textDecoration: 'none',
            color: '#1e293b'
          }}
        >
          <Home size={14} />
          <span className="desktop-only">{t('Home')}</span>
        </Link>

        <button 
          onClick={logout}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 6, 
            padding: '8px 12px', 
            borderRadius: 8, 
            border: 'none', 
            background: '#fee2e2',
            color: '#991B1B',
            fontSize: '0.8rem',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          <LogOut size={14} />
          <span className="desktop-only">{t('Logout')}</span>
        </button>
      </div>
    </header>
  );
}
