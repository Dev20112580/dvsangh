import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Youtube, Twitter } from 'lucide-react'

export default function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-about">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
             <img src="/logo_dvs.jpg" alt="DVS Logo" width="40" height="40" style={{ borderRadius: '50%', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.2)' }} />
             <p style={{ margin: 0, fontWeight: '700', fontSize: '1.25rem', color: 'white' }}>{t('Dronacharya Vidyarthi Sangh')}</p>
          </div>
          <p>
            {t('The light of education in rural India. We provide free scholarships, coaching, digital literacy, and sports programs to rural and tribal students of Jharkhand.')}
          </p>
          <div className="footer-social">
            <a href="https://facebook.com/dronacharyavidyarthisangh" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><Facebook size={18} /></a>
            <a href="https://instagram.com/dvs_jharkhand" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><Instagram size={18} /></a>
            <a href="https://youtube.com/@dvsangh" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><Youtube size={18} /></a>
            <a href="https://twitter.com/dvs_jharkhand" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><Twitter size={18} /></a>
          </div>
        </div>

        <div>
          <h4 className="footer-heading">{t('Quick Links')}</h4>
          <div className="footer-links">
            <Link to="/about">{t('About Us')}</Link>
            <Link to="/programs">{t('Programs')}</Link>
            <Link to="/gallery">{t('Photo Gallery')}</Link>
            <Link to="/events">{t('Events')}</Link>
            <Link to="/news">{t('News & Media')}</Link>
            <Link to="/contact">{t('Contact')}</Link>
          </div>
        </div>

        <div>
          <h4 className="footer-heading">{t('Our Programs')}</h4>
          <div className="footer-links">
            <Link to="/programs">{t('Quality Education')}</Link>
            <Link to="/programs">{t('Girl Education')}</Link>
            <Link to="/programs">{t('Digital Literacy')}</Link>
            <Link to="/programs">{t('Sports & Library')}</Link>
            <Link to="/programs">{t('Competitive Coaching')}</Link>
          </div>
        </div>

        <div>
           <h4 className="footer-heading">{t('Contact Us')}</h4>
          <div className="footer-contact">
            <p>
              <MapPin size={16} />
              <span>{t('Jaroakhilkanali, Masalia, Dumka, Jharkhand - 814166')}</span>
            </p>
            <p>
              <Phone size={16} />
              <span>9241859951</span>
            </p>
            <p>
              <Mail size={16} />
              <span>dvs.ngo.official@gmail.com</span>
            </p>
            <p>
              <Clock size={16} />
              <span>{t('Mon - Sat')}: 9:00 AM - 6:00 PM</span>
            </p>
          </div>
        </div>
      </div>
      
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', padding: '40px 0', marginTop: 40, textAlign: 'center' }}>
        <p style={{ fontSize: '0.85rem', opacity: 0.5, margin: 0 }}>
          © {new Date().getFullYear()} {t('Dronacharya Vidyarthi Sangh (DVS)')}. {t('All Rights Reserved.')}
        </p>
      </div>

      <div className="footer-bottom">
        <p>© 2025 {t('Dronacharya Vidyarthi Sangh')}. All rights reserved.</p>
        <div className="footer-bottom-links">
          <Link to="/privacy-policy">{t('Privacy Policy')}</Link>
          <Link to="/terms">{t('Terms & Conditions')}</Link>
        </div>
      </div>
    </footer>
  )
}
