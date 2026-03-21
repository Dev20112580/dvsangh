import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { MapPin, Phone, Mail, Clock, Send, MessageCircle, CheckCircle } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

export default function Contact() {
  const { t } = useLanguage()
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

  return (
    <>
      <div className="page-header">
        <h1 className="hindi">{t('Contact Us')}</h1>
        <p className="hindi">{t('Connect with us — we are always ready to help you')}</p>
        <div className="breadcrumb"><Link to="/">{t('Home')}</Link> <span>/</span> <span>{t('Contact')}</span></div>
      </div>

      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, maxWidth: 1000, margin: '0 auto' }}>
            {/* Contact Info */}
            <div>
              <h3 className="hindi" style={{ marginBottom: 24 }}>{t('Contact Information')}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div className="card-flat" style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', background: 'var(--dvs-orange-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'var(--dvs-orange)' }}>
                    <MapPin size={22} />
                  </div>
                  <div>
                    <h5 className="hindi">{t('Address')}</h5>
                    <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem' }} className="hindi">{t('Jairuva Khilkanali, Masalia, Dumka, Jharkhand - 814166')}</p>
                  </div>
                </div>
                <div className="card-flat" style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', background: 'var(--success-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'var(--success)' }}>
                    <Phone size={22} />
                  </div>
                  <div>
                    <h5>Phone / WhatsApp</h5>
                    <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem' }}>9241859951</p>
                  </div>
                </div>
                <div className="card-flat" style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', background: 'var(--info-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'var(--info)' }}>
                    <Mail size={22} />
                  </div>
                  <div>
                    <h5>Email</h5>
                    <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem' }}>dvs.ngo.official@gmail.com</p>
                  </div>
                </div>
                <div className="card-flat" style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', background: 'var(--warning-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'var(--warning)' }}>
                    <Clock size={22} />
                  </div>
                  <div>
                    <h5 className="hindi">{t('Working Hours')}</h5>
                    <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem' }}>{t('Mon - Sat')}: 9:00 AM - 6:00 PM</p>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 24 }}>
                <a href="https://wa.me/919241859951" target="_blank" className="btn btn-primary w-full" style={{ background: '#25D366', borderColor: '#25D366' }} rel="noreferrer">
                  <MessageCircle size={18} /> {t('Contact on WhatsApp')}
                </a>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h3 className="hindi" style={{ marginBottom: 24 }}>{t('Send Message')}</h3>
              {sent ? (
                <div className="card" style={{ textAlign: 'center', padding: 48 }}>
                  <CheckCircle size={56} color="var(--success)" style={{ margin: '0 auto 16px' }} />
                  <h3 className="hindi" style={{ color: 'var(--success)' }}>{t('Thank You!')}</h3>
                  <p className="hindi" style={{ color: 'var(--gray-500)', marginTop: 8 }}>
                    {t('Your message has been sent successfully. We will get back to you soon.')}
                  </p>
                  <button className="btn btn-secondary mt-3" onClick={() => { setSent(false); setForm({ name: '', email: '', mobile: '', subject: '', message: '' }) }}>
                    {t('Send Another Message')}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="card-flat">
                  <div className="form-group">
                    <label className="hindi">{t('Name')} <span className="required">*</span></label>
                    <input className="form-control" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder={t('Your Full Name')} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div className="form-group">
                      <label>Email</label>
                      <input className="form-control" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder={t('email@example.com')} />
                    </div>
                    <div className="form-group">
                      <label className="hindi">{t('Mobile')}</label>
                      <input className="form-control" value={form.mobile} onChange={e => setForm({ ...form, mobile: e.target.value })} placeholder="9876543210" maxLength={10} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="hindi">{t('Subject')} <span className="required">*</span></label>
                    <input className="form-control" required value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} placeholder={t('Your Subject')} />
                  </div>
                  <div className="form-group">
                    <label className="hindi">{t('Message')} <span className="required">*</span></label>
                    <textarea className="form-control" required value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder={t('Write your message here...')} />
                  </div>
                  <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                    <Send size={16} /> {loading ? t('Sending...') : t('Send Message')}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
