import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Shield, BookOpen, Users, Laptop, Calculator, CheckCircle } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

const amounts = [500, 1000, 2100, 5000, 11000, 21000]

export default function Donate() {
  const { t } = useLanguage()

  const categories = [
    { key: 'education', label: 'Education Fund', icon: <BookOpen size={20} />, color: '#3B82F6' },
    { key: 'girl_education', label: 'Girl Education', icon: <Heart size={20} />, color: '#EC4899' },
    { key: 'digital', label: 'Digital Literacy', icon: <Laptop size={20} />, color: '#8B5CF6' },
    { key: 'sports', label: 'Sports & Yoga', icon: <Users size={20} />, color: '#10B981' },
    { key: 'general', label: 'General Fund', icon: <Shield size={20} />, color: '#F59E0B' },
  ]

  const [amount, setAmount] = useState(1000)
  const [customAmount, setCustomAmount] = useState('')
  const [category, setCategory] = useState('general')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [coverFee, setCoverFee] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', mobile: '', pan: '' })
  const [showSuccess, setShowSuccess] = useState(false)

  const finalAmount = customAmount ? parseInt(customAmount) : amount
  const processingFee = coverFee ? Math.ceil(finalAmount * 0.02) : 0
  const totalAmount = finalAmount + processingFee
  const taxSaving = Math.ceil(finalAmount * 0.5 * 0.3)

  const handleDonate = (e) => {
    e.preventDefault()
    setShowSuccess(true)
  }

  if (showSuccess) {
    return (
      <div className="container" style={{ maxWidth: 600, padding: '100px 20px', textAlign: 'center' }}>
        <div style={{ padding: 40, background: 'white', borderRadius: 24, boxShadow: 'var(--shadow-lg)' }}>
           <div style={{ width: 80, height: 80, background: 'var(--success-bg)', color: 'var(--success)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <CheckCircle size={48} />
           </div>
           <h1 className="hindi" style={{ fontSize: '2rem', marginBottom: 12 }}>{t('Thank You,')} {form.name || t('Donor')}! 💝</h1>
           <p className="hindi" style={{ color: 'var(--gray-600)', fontSize: '1.1rem', marginBottom: 32 }}>
             {t('Your contribution of')} <strong>₹{totalAmount.toLocaleString('en-IN')}</strong> {t('has been received successfully.')}
           </p>
           
           <div style={{ background: '#f8fafc', padding: 24, borderRadius: 16, textAlign: 'left', marginBottom: 32 }}>
              <h4 className="hindi" style={{ marginBottom: 16, fontSize: '1rem' }}>{t('Impact of your donation')}:</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                 <li style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.9rem' }}>
                    <BookOpen size={16} color="#A1401D" /> {t('Provides study materials for 5 students')}
                 </li>
                 <li style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.9rem' }}>
                    <Shield size={16} color="#10B981" /> {t('Supports daily nutritional meals')}
                 </li>
              </ul>
           </div>

           <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => window.print()} className="btn btn-secondary w-full hindi">{t('Download Receipt')}</button>
              <Link to="/dashboard/donor" className="btn btn-primary w-full hindi">{t('Go to Dashboard')}</Link>
           </div>
           
           <div style={{ marginTop: 24 }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--gray-400)' }}>{t('A copy of the 80G certificate will be sent to')} {form.email}</p>
           </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="page-header" style={{ background: 'linear-gradient(135deg, #A1401D 0%, #78350f 100%)' }}>
        <h1 className="hindi" style={{ color: 'white' }}>💝 {t('Donate')}</h1>
        <p style={{ color: 'rgba(255,255,255,0.9)' }} className="hindi">{t('A small contribution can change a child\'s future')}</p>
      </div>

      <section className="section">
        <div className="container" style={{ maxWidth: 900 }}>
          <form onSubmit={handleDonate}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 32 }}>
              {/* Left - Amount & Category */}
              <div>
                {/* Category Selection */}
                <div className="card-flat" style={{ marginBottom: 24 }}>
                  <h4 className="hindi" style={{ marginBottom: 16 }}>{t('Purpose of Donation')}</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {categories.map(cat => (
                      <button key={cat.key} type="button"
                        className={`btn btn-sm ${category === cat.key ? '' : 'btn-secondary'}`}
                        style={category === cat.key ? { background: cat.color, borderColor: cat.color, color: 'white' } : {}}
                        onClick={() => setCategory(cat.key)}>
                        {cat.icon} {t(cat.label)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Amount Selection */}
                <div className="card-flat" style={{ marginBottom: 24 }}>
                  <h4 className="hindi" style={{ marginBottom: 16 }}>{t('Select Amount')}</h4>
                  <div className="grid grid-3" style={{ gap: 12, marginBottom: 16 }}>
                    {amounts.map(a => (
                      <button key={a} type="button"
                        className={`btn ${amount === a && !customAmount ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => { setAmount(a); setCustomAmount('') }}>
                        ₹{a.toLocaleString('en-IN')}
                      </button>
                    ))}
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="hindi">{t('Or enter custom amount')}</label>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: 'var(--gray-500)' }}>₹</span>
                      <input className="form-control" type="number" min="100" style={{ paddingLeft: 32 }}
                        value={customAmount} onChange={e => setCustomAmount(e.target.value)} placeholder="Min ₹100" />
                    </div>
                  </div>
                </div>

                {/* Donor Info */}
                <div className="card-flat">
                  <h4 className="hindi" style={{ marginBottom: 16 }}>{t('Donor Information')}</h4>
                  <div className="form-group">
                    <label className="hindi">{t('Name')} <span className="required">*</span></label>
                    <input className="form-control" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Full Name" />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div className="form-group">
                      <label>Email <span className="required">*</span></label>
                      <input className="form-control" type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label className="hindi">{t('Mobile')} <span className="required">*</span></label>
                      <input className="form-control" required value={form.mobile} onChange={e => setForm({ ...form, mobile: e.target.value })} maxLength={10} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>PAN Number (for 80G certificate)</label>
                    <input className="form-control" value={form.pan} onChange={e => setForm({ ...form, pan: e.target.value.toUpperCase() })} placeholder="ABCDE1234F" maxLength={10} />
                  </div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', marginBottom: 8 }}>
                    <input type="checkbox" checked={isAnonymous} onChange={e => setIsAnonymous(e.target.checked)} />
                    <span className="hindi" style={{ fontSize: '0.9rem' }}>{t('Anonymous Donation')}</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                    <input type="checkbox" checked={coverFee} onChange={e => setCoverFee(e.target.checked)} />
                    <span style={{ fontSize: '0.9rem' }}>{t('Cover Processing Fee (2%)')}</span>
                  </label>
                </div>
              </div>

              {/* Right - Summary */}
              <div>
                <div className="card" style={{ position: 'sticky', top: 100, borderTop: '4px solid var(--dvs-orange)' }}>
                  <h4 className="hindi" style={{ marginBottom: 20 }}>{t('Donation Summary')}</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                      <span className="hindi">{t('Donation Amount')}</span>
                      <span style={{ fontWeight: 600 }}>₹{finalAmount?.toLocaleString('en-IN') || 0}</span>
                    </div>
                    {coverFee && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--gray-500)' }}>
                        <span>Processing fee (2%)</span>
                        <span>₹{processingFee.toLocaleString('en-IN')}</span>
                      </div>
                    )}
                    <hr style={{ border: 'none', borderTop: '2px solid var(--gray-200)' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 700 }}>
                      <span className="hindi">{t('Total')}</span>
                      <span style={{ color: 'var(--dvs-orange)' }}>₹{totalAmount?.toLocaleString('en-IN') || 0}</span>
                    </div>
                  </div>

                  {form.pan && (
                    <div style={{ background: 'var(--success-bg)', borderRadius: 'var(--radius-sm)', padding: 12, marginTop: 16 }}>
                      <p style={{ color: 'var(--success)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Calculator size={16} /> <strong>{t('Tax Savings')}: ~₹{taxSaving.toLocaleString('en-IN')}</strong>
                      </p>
                      <p style={{ color: 'var(--gray-500)', fontSize: '0.75rem', marginTop: 4 }}>{t('Section 80G under Income Tax Act')}</p>
                    </div>
                  )}

                  <button type="submit" className="btn btn-primary btn-lg w-full mt-3">
                    💝 ₹{totalAmount?.toLocaleString('en-IN')} {t('Donate')}
                  </button>

                  <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {['100% Secure Payment', '80G Tax Certificate', 'Instant Receipt'].map((item, i) => (
                      <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--gray-500)', fontSize: '0.8rem' }}>
                        <CheckCircle size={14} color="var(--success)" /> {t(item)}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  )
}
