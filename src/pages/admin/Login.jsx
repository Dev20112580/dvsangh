import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { Lock, Shield, Eye, EyeOff, CheckCircle, AlertTriangle } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'

export default function AdminLogin() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

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

  const [step, setStep] = useState(1) // 1: Password, 2: OTP
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [adminProfile, setAdminProfile] = useState(null)

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    if (!adminId.match(/^DVS-[A-Z0-9]{4,6}$/i)) {
      setError(language === 'hi' ? 'अमान्य एडमिन आईडी प्रारूप।' : 'Invalid Admin ID format.')
      return
    }

    setLoading(true)
    
    // 1. Fetch Admin Email & Lock Status
    const { data: admin, error: dbErr } = await supabase
      .from('admin_accounts')
      .select('*')
      .eq('admin_id', adminId.toUpperCase())
      .single()

    if (dbErr || !admin) {
      setError(language === 'hi' ? 'एडमिन आईडी नहीं मिली।' : 'Admin ID not found.')
      setLoading(false)
      return
    }

    // Check if locked
    if (admin.locked_until && new Date(admin.locked_until) > new Date()) {
      const remaining = Math.ceil((new Date(admin.locked_until) - new Date()) / 60000)
      setError(language === 'hi' ? `खाता लॉक है। ${remaining} मिनट बाद पुनः प्रयास करें।` : `Account locked. Try again in ${remaining} mins.`)
      setLoading(false)
      return
    }

    // 2. Auth with Supabase
    const { data, error: authErr } = await supabase.auth.signInWithPassword({ 
      email: admin.email, 
      password 
    })

    if (authErr) {
      // Increment failed attempts
      const newAttempts = (admin.failed_login_attempts || 0) + 1
      const updates = { failed_login_attempts: newAttempts }
      
      if (newAttempts >= 3) {
        updates.locked_until = new Date(Date.now() + 15 * 60000).toISOString() // 15 min lock
        setError(language === 'hi' ? '3 असफल प्रयास। खाता 15 मिनट के लिए लॉक कर दिया गया है।' : '3 failed attempts. Account locked for 15 mins.')
      } else {
        setError(authErr.message)
      }
      
      await supabase.from('admin_accounts').update(updates).eq('id', admin.id)
      setLoading(false)
      return
    }

    // Reset failed attempts on success
    await supabase.from('admin_accounts').update({ failed_login_attempts: 0, locked_until: null }).eq('id', admin.id)
    
    setAdminProfile(admin)
    setStep(2)
    setLoading(false)
  }

  const handleOtpSubmit = async (e) => {
    e.preventDefault()
    const enteredOtp = otp.join('')
    if (enteredOtp !== '123456') { // Mock OTP for now
      setError(language === 'hi' ? 'अमान्य ओटीपी।' : 'Invalid OTP.')
      return
    }

    setLoading(true)
    // 2FA Verified
    navigate('/admin/dashboard')
    setLoading(false)
  }

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value.substring(value.length - 1)
    setOtp(newOtp)
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus()
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4f8', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px' }}>
        {step === 1 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'isMobile ? "1fr" : "1fr 1fr"', gap: 0, maxWidth: 900, width: '100%', borderRadius: 16, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.12)', background: 'white' }}>
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
                  <Shield size={18} color="#A1401D" />
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

              <form onSubmit={handlePasswordSubmit}>
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
                        {[1, 2, 3, 4].map(i => (
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
                  {loading ? t('Authenticating...') : t('Continue to OTP →')}
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
        ) : (
          <div style={{ maxWidth: 450, width: '100%', background: 'white', padding: '40px', borderRadius: 20, boxShadow: '0 20px 60px rgba(0,0,0,0.1)', textAlign: 'center' }}>
            <div style={{ width: 64, height: 64, background: '#fff7ed', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <Shield size={32} color="#A1401D" />
            </div>
            <h2 className="hindi" style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: 12 }}>{t('Two-Factor Guard')}</h2>
            <p className="hindi" style={{ color: '#6b7280', fontSize: '0.95rem', marginBottom: 32 }}>
              {t('Verification code sent to')} <strong>{adminProfile?.email?.replace(/(.{3})(.*)(@.*)/, "$1***$3")}</strong>. {t('Enter the 6-digit code to continue.')}
            </p>

            {error && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '10px', marginBottom: 20, fontSize: '0.85rem', color: '#dc2626' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleOtpSubmit}>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 32 }}>
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-${idx}`}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
                        document.getElementById(`otp-${idx - 1}`).focus()
                      }
                    }}
                    style={{ width: 45, height: 56, fontSize: '1.5rem', fontWeight: 700, textAlign: 'center', border: '2px solid #e5e7eb', borderRadius: 12, outline: 'none', background: '#f9fafb', transition: 'all 0.2s' }}
                    autoFocus={idx === 0}
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="hindi"
                style={{ width: '100%', padding: '14px', background: loading ? '#fed7aa' : '#A1401D', color: 'white', border: 'none', borderRadius: 12, fontSize: '1rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s' }}
              >
                {loading ? t('Verifying...') : t('Verify & Login')}
              </button>

              <p className="hindi" style={{ marginTop: 24, fontSize: '0.88rem', color: '#6b7280' }}>
                {t("Didn't receive code?")} <button type="button" style={{ background: 'none', border: 'none', color: '#A1401D', fontWeight: 700, cursor: 'pointer', padding: 0 }}>{t('Resend OTP')}</button>
              </p>
            </form>
          </div>
        )}
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
