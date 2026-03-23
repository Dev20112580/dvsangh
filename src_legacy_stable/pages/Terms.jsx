import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'

export default function Terms() {
  const { t } = useLanguage()
  return (
    <>
      <div className="page-header" style={{ background: 'linear-gradient(135deg, #334155 0%, #1e293b 100%)', padding: '80px 0' }}>
        <div className="container">
          <h1 className="hindi" style={{ color: 'white', fontSize: '3rem', fontWeight: 900 }}>{t('Terms & Conditions')}</h1>
          <div className="breadcrumb" style={{ color: 'rgba(255,255,255,0.6)' }}><Link to="/" style={{ color: 'white' }}>{t('Home')}</Link> <span>/</span> <span>{t('Terms')}</span></div>
        </div>
      </div>
      <section className="section" style={{ background: '#f8fafc' }}>
        <div className="container" style={{ maxWidth: 900 }}>
          <div className="card" style={{ padding: 60, borderRadius: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', background: 'white', lineHeight: 2 }}>
            <p style={{ color: '#94a3b8', marginBottom: 40, fontSize: '0.9rem' }}>{t('Last updated: March 2025')}</p>
            
            <h3 className="hindi" style={{ color: '#1e293b', fontSize: '1.5rem', fontWeight: 800, marginBottom: 16 }}>1. {t('Acceptance of Terms')}</h3>
            <p className="hindi" style={{ color: '#475569', marginBottom: 32 }}>{t('By using the DVS website and services, you agree to these terms and conditions. If you do not agree, please do not use our services.')}</p>
            
            <h3 className="hindi" style={{ color: '#1e293b', fontSize: '1.5rem', fontWeight: 800, marginBottom: 16 }}>2. {t('Scholarships')}</h3>
            <p className="hindi" style={{ color: '#475569', marginBottom: 32 }}>{t('Scholarship applications must contain accurate information. Providing false information will result in disqualification. DVS reserves the right to modify scholarship criteria. All decisions are final.')}</p>
            
            <h3 className="hindi" style={{ color: '#1e293b', fontSize: '1.5rem', fontWeight: 800, marginBottom: 16 }}>3. {t('Donations')}</h3>
            <p className="hindi" style={{ color: '#475569', marginBottom: 32 }}>{t('All donations are non-refundable. 80G tax certificates are issued for eligible donations. DVS is registered under Section 12A of the Income Tax Act.')}</p>
            
            <h3 className="hindi" style={{ color: '#1e293b', fontSize: '1.5rem', fontWeight: 800, marginBottom: 16 }}>4. {t('User Conduct')}</h3>
            <p className="hindi" style={{ color: '#475569', marginBottom: 32 }}>{t('Users must not post offensive content on community forums, misuse the platform for commercial purposes, or attempt to access unauthorized areas of the system.')}</p>
            
            <h3 className="hindi" style={{ color: '#1e293b', fontSize: '1.5rem', fontWeight: 800, marginBottom: 16 }}>5. {t('Disclaimer')}</h3>
            <p className="hindi" style={{ color: '#475569' }}>{t('DVS provides services on an "as-is" basis. We do not guarantee uninterrupted service availability. Content is for informational purposes only.')}</p>
          </div>
        </div>
      </section>
    </>
  )
}
