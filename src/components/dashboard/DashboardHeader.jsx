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
      padding: '12px 20px',
      background: 'white',
      borderBottom: '1px solid #e2e8f0',
      marginBottom: 24,
      borderRadius: 12,
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button 
          className="mobile-only-flex" 
          onClick={onMenuClick}
          style={{ padding: 8, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, color: '#FF6B35' }}
        >
          <Menu size={20} />
        </button>
        <div style={{ lineHeight: 1.2 }}>
          <h1 className="hindi" style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>नमस्ते, {profile?.full_name?.split(' ')[0] || t('Student')}! 👋</h1>
          <p className="hindi" style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>{t('Welcome back')}</p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {/* Language Switcher */}
        <button 
          onClick={() => setLanguage(language === 'hi' ? 'en' : 'hi')}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 6, 
            padding: '6px 10px', 
            borderRadius: 8, 
            border: '1px solid #FF6B35', 
            background: language === 'hi' ? '#fff7ed' : '#f8fafc',
            fontSize: '0.75rem',
            fontWeight: 800,
            cursor: 'pointer',
            color: '#1e293b'
          }}
        >
          <Globe size={18} color="#FF6B35" />
          <span>{language === 'hi' ? 'EN' : 'हिं'}</span>
        </button>

        <Link 
          to="/" 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 6, 
            padding: '6px 10px', 
            borderRadius: 8, 
            border: '1px solid #e2e8f0', 
            background: 'white',
            fontSize: '0.75rem',
            fontWeight: 800,
            textDecoration: 'none',
            color: '#1e293b'
          }}
        >
          <Home size={18} color="#3b82f6" />
          <span className="desktop-only">{t('Home')}</span>
        </Link>

        <button 
          onClick={logout}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 6, 
            padding: '6px 10px', 
            borderRadius: 8, 
            border: '1px solid #fee2e2', 
            background: '#fee2e2',
            color: '#991B1B',
            fontSize: '0.75rem',
            fontWeight: 800,
            cursor: 'pointer'
          }}
        >
          <LogOut size={18} />
          <span className="desktop-only">{t('Logout')}</span>
        </button>
      </div>
    </header>
  );
}
