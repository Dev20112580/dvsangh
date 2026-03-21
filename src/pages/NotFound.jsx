import { Link } from 'react-router-dom'
import { Home, ArrowLeft, Search } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

export default function NotFound() {
  const { t } = useLanguage()

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      background: '#f8fafc',
      padding: '24px'
    }}>
      <div style={{ 
        maxWidth: 500, 
        width: '100%', 
        textAlign: 'center',
        background: 'white',
        padding: '48px 32px',
        borderRadius: 32,
        boxShadow: '0 20px 50px rgba(0,0,0,0.05)'
      }}>
        <div style={{ 
          width: 120, 
          height: 120, 
          background: '#FFF5F0', 
          borderRadius: '50%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          margin: '0 auto 32px',
          color: '#FF6B35'
        }}>
          <Search size={64} strokeWidth={1.5} />
        </div>

        <h1 className="hindi" style={{ fontSize: '6rem', fontWeight: 900, color: '#FF6B35', margin: 0, lineHeight: 1 }}>404</h1>
        <h2 className="hindi" style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1e293b', marginBottom: 16 }}>
          {t('Aage Maarg Nahi Hai')} (End of Path)
        </h2>
        <p className="hindi" style={{ color: '#64748b', marginBottom: 32, lineHeight: 1.6 }}>
          {t("The page you are looking for has been moved or doesn't exist. Let's get you back to your studies.")}
        </p>

        <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
          <Link to="/" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 10, 
            padding: '12px 24px', 
            background: '#FF6B35', 
            color: 'white', 
            borderRadius: 12, 
            fontWeight: 700, 
            textDecoration: 'none',
            boxShadow: '0 8px 20px rgba(255, 107, 53, 0.2)'
          }}>
            <Home size={18} /> {t('Go Home')}
          </Link>
          <button 
            onClick={() => window.history.back()}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 10, 
              padding: '12px 24px', 
              background: 'white', 
              color: '#475569', 
              borderRadius: 12, 
              fontWeight: 700, 
              border: '1px solid #e2e8f0',
              cursor: 'pointer'
            }}
          >
            <ArrowLeft size={18} /> {t('Go Back')}
          </button>
        </div>

        <div style={{ marginTop: 40, paddingTop: 32, borderTop: '1px solid #f1f5f9' }}>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 500 }}>
            © 2025 Dronacharya Vidyarthi Sangh
          </p>
        </div>
      </div>
    </div>
  )
}
