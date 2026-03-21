import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'

export default function PrivacyPolicy() {
  const { t } = useLanguage()
  return (
    <>
      <div className="page-header" style={{ background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)', padding: '80px 0' }}>
        <div className="container">
          <h1 className="hindi" style={{ color: 'white', fontSize: '3rem', fontWeight: 900 }}>{t('Privacy Policy')}</h1>
          <div className="breadcrumb" style={{ color: 'rgba(255,255,255,0.6)' }}><Link to="/" style={{ color: 'white' }}>{t('Home')}</Link> <span>/</span> <span>{t('Privacy Policy')}</span></div>
        </div>
      </div>
      <section className="section" style={{ background: '#f8fafc' }}>
        <div className="container" style={{ maxWidth: 900 }}>
          <div className="card" style={{ padding: 60, borderRadius: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', background: 'white', lineHeight: 2 }}>
            <p style={{ color: '#94a3b8', marginBottom: 40, fontSize: '0.9rem' }}>{t('Last updated: March 2025')}</p>
            
            <h3 className="hindi" style={{ color: '#1e293b', fontSize: '1.5rem', fontWeight: 800, marginBottom: 16 }}>1. {t('Information We Collect')}</h3>
            <p className="hindi" style={{ color: '#475569', marginBottom: 32 }}>{t('We collect personal information you provide during registration (name, email, mobile number, address), scholarship applications (academic details, family income, documents), donations (payment details, PAN number), and general site usage data.')}</p>
            
            <h3 className="hindi" style={{ color: '#1e293b', fontSize: '1.5rem', fontWeight: 800, marginBottom: 16 }}>2. {t('How We Use Your Information')}</h3>
            <p className="hindi" style={{ color: '#475569', marginBottom: 32 }}>{t('Your information is used to process scholarship applications, manage donations and issue 80G certificates, send notifications about events and programs, improve our services, and comply with legal requirements.')}</p>
            
            <h3 className="hindi" style={{ color: '#1e293b', fontSize: '1.5rem', fontWeight: 800, marginBottom: 16 }}>3. {t('Data Security')}</h3>
            <p className="hindi" style={{ color: '#475569', marginBottom: 32 }}>{t('We use industry-standard encryption (SSL/TLS) to protect data transmission. Sensitive data like Aadhaar and PAN numbers are hashed. Access to personal data is restricted to authorized personnel only.')}</p>
            
            <h3 className="hindi" style={{ color: '#1e293b', fontSize: '1.5rem', fontWeight: 800, marginBottom: 16 }}>4. {t('Your Rights')}</h3>
            <p className="hindi" style={{ color: '#475569', marginBottom: 32 }}>{t('You can request access, update, or deletion of your personal data. Contact us at dvs.ngo.official@gmail.com for any privacy-related requests.')}</p>
            
            <h3 className="hindi" style={{ color: '#1e293b', fontSize: '1.5rem', fontWeight: 800, marginBottom: 16 }}>5. {t('Contact')}</h3>
            <p style={{ color: '#475569' }}>{t('For privacy concerns:')} <strong>dvs.ngo.official@gmail.com</strong></p>
          </div>
        </div>
      </section>
    </>
  )
}
