import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { Lock, Shield, Eye, EyeOff, CheckCircle, AlertTriangle } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'

export default function AdminLogin() {
  const { t, language } = useLanguage()
  const [adminId, setAdminId] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [trustDevice, setTrustDevice] = useState(false)
  const navigate = useNavigate()

  const emailFromId = (id) => {
    const map = {
      'DVS-F001': 'sumit@dvs.com',
      'DVS-VP001': 'prashant@dvs.com',
      'DVS-VP002': 'madhu@dvs.com',
      'DVS-VP003': 'rita@dvs.com',
      'DVS-AS001': 'riya@dvs.com',
      'DVS-AS002': 'piya@dvs.com',
      'DVS-TR001': 'vijay@dvs.com',
    }
    return map[id.toUpperCase()] || null
  }

  const getStrength = (p) => {
    if (!p) return 0
    let s = 0
    if (p.length >= 8) s++
    if (/[A-Z]/.test(p)) s++
    if (/[0-9]/.test(p)) s++
    if (/[^A-Za-z0-9]/.test(p)) s++
    return s
  }

  const strengthLabel = ['', t('Weak'), t('Fair'), t('Good'), t('Robust')]
  const strengthColor = ['', '#ef4444', '#f97316', '#22c55e', '#3b82f6']
  const pStrength = getStrength(password)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!adminId.match(/^DVS-[A-Z]{1,2}[0-9]{3}$/i)) {
      setError(language === 'hi' ? 'अमान्य एडमिन आईडी प्रारूप। DVS-XXXX प्रारूप का उपयोग करें।' : 'Invalid Admin ID format. Use DVS-XXXX format.')
      return
    }
    const email = emailFromId(adminId)
    if (!email) { setError(language === 'hi' ? 'एडमिन आईडी पहचानी नहीं गई।' : 'Admin ID not recognized.'); return }

    setLoading(true)
    const { data, error: err } = await supabase.auth.signInWithPassword({ email, password })
    if (err) { setError(err.message); setLoading(false); return }

    const { data: admin } = await supabase.from('admin_accounts').select('*').eq('user_id', data.user.id).single()
    if (!admin) { setError(language === 'hi' ? 'पहुँच अस्वीकृत। यह एक व्यवस्थापक खाता नहीं है।' : 'Access denied. Not an admin account.'); await supabase.auth.signOut(); setLoading(false); return }
    navigate('/admin/dashboard')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4f8', display: 'flex', flexDirection: 'column' }}>
      {/* Main */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, maxWidth: 900, width: '100%', borderRadius: 16, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.12)' }}>
          {/* Left Panel */}
          <div style={{ background: 'white', padding: '48px 40px', borderRight: '1px solid #e5e7eb' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
              <img src="/logo_dvs.jpg" alt="DVS Logo" style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover' }} />
              <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#111' }}>DVS</span>
            </div>
            <h1 className="hindi" style={{ fontSize: '2rem', fontWeight: 800, color: '#111', lineHeight: 1.2, marginBottom: 16 }}>
              {language === 'hi' ? <>एडमिन<br /><span style={{ color: '#A1401D' }}>पोर्टल एक्सेस।</span></> : <>Admin<br /><span style={{ color: '#A1401D' }}>Portal Access.</span></>}
            </h1>
            <p className="hindi" style={{ color: '#6b7280', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: 40 }}>
              {t('Secure administrative gateway for Dronacharya Vidyarthi Sangh educational oversight and financial transparency.')}
            </p>

            {/* System Health */}
            <div style={{ background: '#fff7ed', border: '1px solid #ffedd5', borderRadius: 12, padding: '16px 20px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 36, height: 36, background: '#ffedd5', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle size={18} color="#A1401D" />
              </div>
              <div>
                <div className="hindi" style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: 1, color: '#A1401D', textTransform: 'uppercase' }}>{t('System Health')}</div>
                <div className="hindi" style={{ fontSize: '0.9rem', fontWeight: 600, color: '#111' }}>{t('Encrypted & Operational')}</div>
              </div>
            </div>

            {/* Security Protocol */}
            <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 12, padding: '16px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#dc2626' }}></div>
                <span className="hindi" style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: 1, color: '#6b7280', textTransform: 'uppercase' }}>{t('Active Security Protocol')}</span>
              </div>
              <div style={{ height: 4, background: '#e5e7eb', borderRadius: 4, marginBottom: 8, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: '80%', background: 'linear-gradient(90deg, #A1401D, #fb923c)', borderRadius: 4 }}></div>
              </div>
              <div className="hindi" style={{ fontSize: '0.8rem', color: '#6b7280', fontStyle: 'italic' }}>{t('Secure Gateway Connection Active')}</div>
            </div>
          </div>

          {/* Right Panel - Login Form */}
          <div style={{ background: 'white', padding: '48px 40px' }}>
            <h2 className="hindi" style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111', marginBottom: 6 }}>{t('Administrator Login')}</h2>
            <p className="hindi" style={{ color: '#6b7280', fontSize: '0.88rem', marginBottom: 32 }}>{t('Enter your credentials to access the administrative dashboard.')}</p>

            {error && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '12px 16px', marginBottom: 20, fontSize: '0.85rem', color: '#dc2626', display: 'flex', alignItems: 'center', gap: 8 }}>
                <AlertTriangle size={16} /> {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 20 }}>
                <label className="hindi" style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: '#374151', marginBottom: 8 }}>{t('Admin Identifier')}</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                  <input
                    type="text"
                    placeholder="DVS-XXXX"
                    value={adminId}
                    onChange={e => setAdminId(e.target.value)}
                    required
                    style={{ width: '100%', padding: '12px 16px 12px 40px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: '0.9rem', outline: 'none', background: '#f9fafb', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <label className="hindi" style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: '#374151' }}>{t('Access Phrase')}</label>
                  <a href="#" className="hindi" style={{ fontSize: '0.75rem', color: '#A1401D', fontWeight: 600 }}>{t('RESET')}</a>
                </div>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    style={{ width: '100%', padding: '12px 40px 12px 40px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: '0.9rem', outline: 'none', background: '#f9fafb', boxSizing: 'border-box' }}
                  />
                  <button type="button" onClick={() => setShowPass(s => !s)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}>
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {password && (
                  <div style={{ marginTop: 8 }}>
                    <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
                      {[1,2,3,4].map(i => (
                        <div key={i} style={{ flex: 1, height: 4, borderRadius: 4, background: i <= pStrength ? strengthColor[pStrength] : '#e5e7eb', transition: 'all 0.3s' }}></div>
                      ))}
                    </div>
                    <div className="hindi" style={{ textAlign: 'right', fontSize: '0.7rem', fontWeight: 700, color: strengthColor[pStrength] }}>{strengthLabel[pStrength]}</div>
                  </div>
                )}
              </div>

              <label className="hindi" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24, cursor: 'pointer', fontSize: '0.875rem', color: '#374151' }}>
                <input type="checkbox" checked={trustDevice} onChange={e => setTrustDevice(e.target.checked)} style={{ width: 16, height: 16 }} />
                {t('Trust this device for 30 days')}
              </label>

              <button
                type="submit"
                disabled={loading}
                className="hindi"
                style={{ width: '100%', padding: '14px', background: loading ? '#fed7aa' : '#A1401D', color: 'white', border: 'none', borderRadius: 8, fontSize: '0.95rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.2s' }}
              >
                {loading ? t('Logging in...') : t('Login to Dashboard →')}
              </button>

              <div style={{ display: 'flex', gap: 12, marginTop: 20, padding: '14px 16px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 8 }}>
                <AlertTriangle size={16} color="#d97706" style={{ flexShrink: 0, marginTop: 2 }} />
                <p className="hindi" style={{ fontSize: '0.78rem', color: '#92400e', margin: 0, lineHeight: 1.5 }}>
                  <strong>{t('Security Alert:')}</strong> {t('Ensure you are accessing this terminal from a private network. DVS will never ask for your password via phone or email.')}
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ background: 'white', borderTop: '1px solid #e5e7eb', padding: '16px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="hindi" style={{ fontSize: '0.75rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }}></span>
          {t('ADMIN ACCESS ONLY · UNAUTHORIZED ENTRY IS PROHIBITED')}
        </span>
        <div style={{ display: 'flex', gap: 24 }}>
          <a href="#" className="hindi" style={{ fontSize: '0.75rem', color: '#6b7280' }}>{t('PRIVACY PROTOCOL')}</a>
          <a href="#" className="hindi" style={{ fontSize: '0.75rem', color: '#6b7280' }}>{t('INCIDENT REPORTING')}</a>
          <span className="hindi" style={{ fontSize: '0.75rem', color: '#6b7280' }}>© 2025 {t('DVS ORGANIZATION')}</span>
        </div>
      </div>
    </div>
  )
}
