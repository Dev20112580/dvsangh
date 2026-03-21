import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { MapPin, Phone, Mail, Clock, Send, MessageCircle, CheckCircle, Globe } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

export default function Contact() {
  const { t } = useLanguage()
  useDocumentTitle(t('Contact DVS NGO'))
  const [form, setForm] = useState({ name: '', email: '', mobile: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.from('contact_submissions').insert(form)
    if (!error) setSent(true)
    setLoading(false)
  }

  const contactOptions = [
    { 
      icon: <MapPin size={22} />, 
      title: 'Our Location', 
      detail: t('Jairuva Khilkanali, Masalia, Dumka, JH - 814166'),
      bg: 'var(--dvs-orange-bg)',
      color: 'var(--dvs-orange)'
    },
    { 
      icon: <Phone size={22} />, 
      title: 'Call / WhatsApp', 
      detail: '+91 9241859951',
      bg: '#ecfdf5',
      color: '#10b981'
    },
    { 
      icon: <Mail size={22} />, 
      title: 'Mail Support', 
      detail: 'dvs.ngo.official@gmail.com',
      bg: '#f0f9ff',
      color: '#0ea5e9'
    },
    { 
      icon: <Clock size={22} />, 
      title: 'Working Hours', 
      detail: t('Mon - Sat: 9:00 AM - 6:00 PM'),
      bg: '#fff7ed',
      color: '#f59e0b'
    }
  ]

  return (
    <div className="contact-page">
      <div className="page-header" style={{ background: 'var(--dark)' }}>
        <div className="container">
          <h1 className="hindi">{t('Contact Us')}</h1>
          <p className="hindi" style={{ opacity: 0.7, maxWidth: 600, margin: '16px auto 0' }}>{t('Connect with us — we are always ready to help you and answer your queries.')}</p>
          <div className="breadcrumb" style={{ justifyContent: 'center', marginTop: 24 }}>
            <Link to="/">{t('Home')}</Link> <span>/</span> <span style={{ opacity: 0.5 }}>{t('Contact')}</span>
          </div>
        </div>
      </div>

      <section className="section bg-gray">
        <div className="container">
          <div className="contact-wrapper">
            
            {/* Left: Contact Details */}
            <div className="contact-details-side">
              <span className="pill-red">{t('Get in Touch')}</span>
              <h2 className="responsive-h2" style={{ marginBottom: 32 }}>{t('We\'d Love to Hear From You')}</h2>
              
              <div className="contact-cards-grid">
                {contactOptions.map((opt, i) => (
                  <div className="contact-info-card" key={i}>
                    <div className="info-icon" style={{ background: opt.bg, color: opt.color }}>
                      {opt.icon}
                    </div>
                    <div className="info-content">
                      <h4 className="hindi">{t(opt.title)}</h4>
                      <p className="hindi">{opt.detail}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="whatsapp-box">
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div className="wa-icon"><MessageCircle size={24} color="white" fill="white" /></div>
                  <div>
                    <h4 style={{ margin: 0 }}>{t('Chat with DVS')}</h4>
                    <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.8 }}>{t('Direct access via WhatsApp Business')}</p>
                  </div>
                </div>
                <a href="https://wa.me/919241859951" target="_blank" className="wa-btn" rel="noreferrer">
                  {t('Open WhatsApp')}
                </a>
              </div>
            </div>

            {/* Right: Contact Form */}
            <div className="contact-form-side">
              {sent ? (
                <div className="success-card">
                  <div className="success-icon"><CheckCircle size={48} /></div>
                  <h3 className="hindi">{t('Message Sent Successfully')}</h3>
                  <p className="hindi">{t('Thank you for reaching out. Our team will review your message and contact you shortly.')}</p>
                  <button className="btn btn-primary" onClick={() => setSent(false)}>{t('Send Another')}</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="premium-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label>{t('Full Name')}</label>
                      <input 
                        required 
                        value={form.name} 
                        onChange={e => setForm({ ...form, name: e.target.value })} 
                        placeholder={t('Enter your name')} 
                      />
                    </div>
                  </div>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>{t('Email Address')}</label>
                      <input 
                        type="email" 
                        value={form.email} 
                        onChange={e => setForm({ ...form, email: e.target.value })} 
                        placeholder="example@mail.com" 
                      />
                    </div>
                    <div className="form-group">
                      <label>{t('Mobile Number')}</label>
                      <input 
                        required
                        value={form.mobile} 
                        onChange={e => setForm({ ...form, mobile: e.target.value })} 
                        placeholder="92XXXXXXXX" 
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>{t('Subject')}</label>
                    <input 
                      required 
                      value={form.subject} 
                      onChange={e => setForm({ ...form, subject: e.target.value })} 
                      placeholder={t('What is this about?')} 
                    />
                  </div>
                  <div className="form-group">
                    <label>{t('Your Message')}</label>
                    <textarea 
                      required 
                      value={form.message} 
                      onChange={e => setForm({ ...form, message: e.target.value })} 
                      placeholder={t('How can we help you?')} 
                      rows={5}
                    />
                  </div>
                  <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? t('Processing...') : t('Send Inquire Message')}
                    <Send size={18} />
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      </section>

      <style>{`
        .contact-wrapper { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: flex-start; max-width: 1100px; margin: 0 auto; }
        .contact-cards-grid { display: grid; grid-template-columns: 1fr; gap: 20px; margin-top: 10px; }
        .contact-info-card { display: flex; gap: 20px; align-items: center; background: white; padding: 20px; border-radius: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.03); border: 1px solid var(--gray-100); }
        .info-icon { width: 52px; height: 52px; border-radius: 14px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .info-content h4 { font-size: 0.95rem; margin-bottom: 4px; font-weight: 800; }
        .info-content p { font-size: 0.85rem; color: var(--gray-500); margin: 0; line-height: 1.5; }

        .whatsapp-box { margin-top: 32px; background: #075E54; border-radius: 24px; padding: 24px; color: white; display: flex; justify-content: space-between; align-items: center; gap: 20px; flex-wrap: wrap; }
        .wa-icon { width: 44px; height: 44px; background: #25D366; border-radius: 50%; display: flex; alignItems: center; justifyContent: center; }
        .wa-btn { background: white; color: #075E54; padding: 10px 20px; border-radius: 12px; font-weight: 800; font-size: 0.85rem; text-decoration: none; }

        .premium-form { background: white; padding: 48px; border-radius: 32px; box-shadow: 0 30px 60px rgba(0,0,0,0.08); }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .form-group { margin-bottom: 24px; display: flex; flex-direction: column; gap: 8px; }
        .form-group label { font-size: 0.85rem; font-weight: 700; color: var(--dark); }
        .form-group input, .form-group textarea { padding: 14px 18px; border-radius: 12px; border: 1.5px solid var(--gray-100); background: #fcfcfd; font-size: 0.95rem; outline: none; transition: 0.2s; }
        .form-group input:focus, .form-group textarea:focus { border-color: var(--dvs-orange); background: white; }
        .submit-btn { width: 100%; padding: 16px; background: var(--dark); color: white; border: none; border-radius: 12px; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 10px; cursor: pointer; transition: 0.3s; }
        .submit-btn:hover { background: var(--dvs-orange); transform: translateY(-2px); }

        .success-card { text-align: center; background: white; padding: 60px 40px; border-radius: 32px; box-shadow: 0 30px 60px rgba(0,0,0,0.08); }
        .success-icon { width: 80px; height: 80px; border-radius: 50%; background: #ecfdf5; color: #10b981; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; }
        .success-card p { color: var(--gray-500); margin-bottom: 32px; }

        @media (max-width: 1023px) {
          .contact-wrapper { grid-template-columns: 1fr; gap: 60px; }
          .premium-form { padding: 32px; }
        }
        @media (max-width: 768px) {
          .form-grid { grid-template-columns: 1fr; gap: 0; }
        }
        @media (max-width: 640px) {
          .contact-cards-grid { grid-template-columns: 1fr; }
          .whatsapp-box { flex-direction: column; text-align: center; }
          .wa-btn { width: 100%; }
        }
      `}</style>
    </div>
  )
}
