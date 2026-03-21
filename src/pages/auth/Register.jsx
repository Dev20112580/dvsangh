import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  User, Mail, Phone, Lock, ChevronRight, ChevronLeft, 
  GraduationCap, Sparkles, Heart, CheckCircle, ShieldCheck
} from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'
import { useAuth } from '../../context/AuthContext'

export default function Register() {
  const { t, language } = useLanguage()
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [role, setRole] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    district: 'Dumka',
    studentClass: '',
    profession: '',
    pan: ''
  })

  const roles = [
    { id: 'student', title: t('Student'), subtitle: t('I want to study'), icon: <GraduationCap size={32} />, color: '#FF6B35' },
    { id: 'volunteer', title: t('Volunteer'), subtitle: t('I want to help'), icon: <Sparkles size={32} />, color: '#2D5016' },
    { id: 'donor', title: t('Donor'), subtitle: t('I want to donate'), icon: <Heart size={32} />, color: '#FF6B35' }
  ]

  const nextStep = () => {
    if (step === 1 && !role) {
      setError(t('Please select a role to continue'))
      return
    }
    setError('')
    setStep(s => Math.min(s + 1, 3))
  }

  const prevStep = () => setStep(s => Math.max(s - 1, 1))

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    if (form.password !== form.confirmPassword) {
      setError(t('Passwords do not match'))
      setLoading(false)
      return
    }

    try {
      // Step 2 complete, move to OTP (Mock UI)
      setStep(3)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleOtpSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      navigate('/' + role + '/dashboard')
      setLoading(false)
    }, 1500)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#f8fafc' }}>
      
      {/* Left Column: Visual Brand */}
      <div style={{ flex: '1', background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 80px', color: 'white', position: 'relative', overflow: 'hidden' }}>
         <div style={{ position: 'relative', zIndex: 2 }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', color: 'white', marginBottom: 60 }}>
               <div style={{ width: 48, height: 48, background: 'white', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src="/logo.svg" alt="DVS Logo" style={{ width: 32 }} onError={(e) => { e.target.style.display='none'; e.target.parentElement.innerHTML = '<span style="color:#1d4ed8; font-weight:900">DVS</span>' }} />
               </div>
               <span style={{ fontSize: '1.5rem', fontWeight: 900, letterSpacing: -1 }}>DVSANGH</span>
            </Link>

            <h1 className="hindi" style={{ fontSize: '3rem', fontWeight: 900, lineHeight: 1.1, marginBottom: 24 }}>{t('Your Journey to Transformation Starts Here.')}</h1>
            <p className="hindi" style={{ fontSize: '1.25rem', opacity: 0.8, maxWidth: 500, lineHeight: 1.6 }}>{t('Join thousands of rural students and volunteers building a brighter Jharkhand.')}</p>

            <div style={{ display: 'flex', gap: 40, marginTop: 80 }}>
               <div>
                 <div style={{ fontSize: '2rem', fontWeight: 900 }}>12k+</div>
                 <div className="hindi" style={{ fontSize: '0.85rem', opacity: 0.7 }}>{t('Active Students')}</div>
               </div>
               <div>
                 <div style={{ fontSize: '2rem', fontWeight: 900 }}>450+</div>
                 <div className="hindi" style={{ fontSize: '0.85rem', opacity: 0.7 }}>{t('Dedicated Volunteers')}</div>
               </div>
            </div>
         </div>
         <div style={{ position: 'absolute', right: -100, bottom: -100, width: 400, height: 400, background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }}></div>
      </div>

      {/* Right Column: Registration Form */}
      <div style={{ flex: '1.2', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
         <div style={{ width: '100%', maxWidth: 540 }}>
            
            {/* Form Header */}
            <div style={{ marginBottom: 40 }}>
               <h2 className="hindi" style={{ fontSize: '2rem', fontWeight: 900, color: '#1e293b' }}>{t('Create Account')}</h2>
               <p className="hindi" style={{ color: '#64748b', marginTop: 8 }}>{t('Start your impactful journey today.')}</p>
            </div>

            {/* Step Indicator */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 40 }}>
               {[1, 2, 3].map(s => (
                 <div key={s} style={{ flex: 1, height: 6, borderRadius: 3, background: step >= s ? '#1d4ed8' : '#e2e8f0', transition: 'all 0.3s' }}></div>
               ))}
            </div>

            {error && (
              <div style={{ padding: '16px', background: '#fef2f2', color: '#991b1b', borderRadius: 12, fontSize: '0.85rem', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10, border: '1px solid #fee2e2' }}>
                 <AlertCircle size={18} /> {error}
              </div>
            )}

            {step === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                 <p className="hindi" style={{ fontSize: '0.9rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>{t('Select Your Role')}</p>
                 {roles.map(r => (
                   <div key={r.id} onClick={() => setRole(r.id)} style={{ padding: '24px', borderRadius: 16, border: '2px solid', borderColor: role === r.id ? '#1d4ed8' : '#e2e8f0', background: role === r.id ? '#eff6ff' : 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 20, transition: 'all 0.2s' }}>
                      <div style={{ width: 64, height: 64, background: role === r.id ? '#1d4ed8' : '#f8fafc', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', color: role === r.id ? 'white' : r.color }}>{r.icon}</div>
                      <div style={{ flex: 1 }}>
                         <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e293b' }}>{r.title}</div>
                         <div className="hindi" style={{ fontSize: '0.85rem', color: '#64748b', marginTop: 4 }}>{r.subtitle}</div>
                      </div>
                      {role === r.id && <div style={{ color: '#1d4ed8' }}><CheckCircle size={24} /></div>}
                   </div>
                 ))}
                 <button onClick={nextStep} style={{ width: '100%', padding: '16px', borderRadius: 12, border: 'none', background: '#111', color: 'white', fontWeight: 800, fontSize: '1rem', marginTop: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                   {t('Continue to Details')} <ChevronRight size={20} />
                 </button>
              </div>
            )}

            {step === 2 && (
              <form onSubmit={handleRegister} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                 <div style={{ gridColumn: '1 / -1' }}>
                    <label className="hindi" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#475569', marginBottom: 10 }}>{t('Full Name')}</label>
                    <div style={{ position: 'relative' }}>
                       <User size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                       <input required value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} style={{ width: '100%', padding: '14px 16px 14px 48px', borderRadius: 12, border: '1px solid #e2e8f0', outline: 'none' }} placeholder="Sumit Kumar" />
                    </div>
                 </div>

                 <div style={{ gridColumn: '1 / -1' }}>
                    <label className="hindi" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#475569', marginBottom: 10 }}>{t('Email Address')}</label>
                    <div style={{ position: 'relative' }}>
                       <Mail size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                       <input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} style={{ width: '100%', padding: '14px 16px 14px 48px', borderRadius: 12, border: '1px solid #e2e8f0', outline: 'none' }} placeholder="sumit@example.com" />
                    </div>
                 </div>

                 <div>
                    <label className="hindi" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#475569', marginBottom: 10 }}>{t('Phone Number')}</label>
                    <div style={{ position: 'relative' }}>
                       <Phone size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                       <input type="tel" required value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} style={{ width: '100%', padding: '14px 16px 14px 48px', borderRadius: 12, border: '1px solid #e2e8f0', outline: 'none' }} placeholder="9876543210" />
                    </div>
                 </div>

                 <div>
                    <label className="hindi" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#475569', marginBottom: 10 }}>{t('Password')}</label>
                    <div style={{ position: 'relative' }}>
                       <Lock size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                       <input type="password" required value={form.password} onChange={e => setForm({...form, password: e.target.value})} style={{ width: '100%', padding: '14px 16px 14px 48px', borderRadius: 12, border: '1px solid #e2e8f0', outline: 'none' }} />
                    </div>
                 </div>

                 {/* Role Specific Fields */}
                 {role === 'student' && (
                   <div style={{ gridColumn: '1 / -1' }}>
                      <label className="hindi" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#475569', marginBottom: 10 }}>{t('Class / Current Education')}</label>
                      <select required value={form.studentClass} onChange={e => setForm({...form, studentClass: e.target.value})} style={{ width: '100%', padding: '14px 16px', borderRadius: 12, border: '1px solid #e2e8f0', outline: 'none', background: 'white' }}>
                         <option value="">{t('Select Class')}</option>
                         {['Class 1-5', 'Class 6-8', 'Class 9-10', 'Class 11-12', 'Graduation', 'Post-Graduation'].map(c => (
                           <option key={c} value={c}>{t(c)}</option>
                         ))}
                      </select>
                   </div>
                 )}

                 {role === 'volunteer' && (
                   <>
                     <div>
                        <label className="hindi" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#475569', marginBottom: 10 }}>{t('Profession')}</label>
                        <select value={form.profession} onChange={e => setForm({...form, profession: e.target.value})} style={{ width: '100%', padding: '14px 16px', borderRadius: 12, border: '1px solid #e2e8f0', outline: 'none', background: 'white' }}>
                           <option value="">{t('Select Profession')}</option>
                           {['Student', 'Teacher', 'IT Professional', 'Medical', 'Business', 'Other'].map(p => (
                             <option key={p} value={p}>{t(p)}</option>
                           ))}
                        </select>
                     </div>
                     <div>
                        <label className="hindi" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#475569', marginBottom: 10 }}>{t('Primary Skill')}</label>
                        <select style={{ width: '100%', padding: '14px 16px', borderRadius: 12, border: '1px solid #e2e8f0', outline: 'none', background: 'white' }}>
                           <option value="">{t('Select Skill')}</option>
                           {['Teaching', 'Technology', 'Sports', 'Health', 'Administration'].map(s => (
                             <option key={s} value={s}>{t(s)}</option>
                           ))}
                        </select>
                     </div>
                   </>
                 )}

                 {role === 'donor' && (
                   <div style={{ gridColumn: '1 / -1' }}>
                      <label className="hindi" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#475569', marginBottom: 10 }}>{t('PAN Number (Optional for 80G)')}</label>
                      <input value={form.pan} onChange={e => setForm({...form, pan: e.target.value.toUpperCase()})} placeholder="ABCDE1234F" style={{ width: '100%', padding: '14px 16px', borderRadius: 12, border: '1px solid #e2e8f0', outline: 'none' }} />
                   </div>
                 )}

                 <div style={{ gridColumn: '1 / -1' }}>
                    <label className="hindi" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#475569', marginBottom: 10 }}>{t('District')}</label>
                    <select required value={form.district} onChange={e => setForm({...form, district: e.target.value})} style={{ width: '100%', padding: '14px 16px', borderRadius: 12, border: '1px solid #e2e8f0', outline: 'none', background: 'white' }}>
                       {['Bokaro', 'Chatra', 'Deoghar', 'Dhanbad', 'Dumka', 'Garhwa', 'Giridih', 'Godda', 'Gumla', 'Hazaribagh', 'Jamtara', 'Khunti', 'Koderma', 'Latehar', 'Lohardaga', 'Pakur', 'Palamu', 'Ramgarh', 'Ranchi', 'Sahibganj', 'Seraikela Kharsawan', 'Simdega', 'West Singhbhum', 'East Singhbhum'].map(d => (
                         <option key={d} value={d}>{d}</option>
                       ))}
                    </select>
                 </div>

                 <div style={{ gridColumn: '1 / -1', marginTop: 24, display: 'flex', gap: 16 }}>
                    <button type="button" onClick={prevStep} style={{ flex: 0.4, padding: '14px', borderRadius: 12, border: '1px solid #e2e8f0', background: 'white', color: '#475569', fontWeight: 700, cursor: 'pointer' }}>{t('Back')}</button>
                    <button type="submit" disabled={loading} style={{ flex: 1, padding: '14px', borderRadius: 12, border: 'none', background: '#FF6B35', color: 'white', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                       {loading ? t('Processing...') : <>{t('Verify OTP')} <ChevronRight size={20} /></>}
                    </button>
                 </div>
              </form>
            )}

            {step === 3 && (
              <form onSubmit={handleOtpSubmit} style={{ textAlign: 'center' }}>
                 <div style={{ width: 64, height: 64, background: '#eff6ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1d4ed8', margin: '0 auto 24px' }}>
                    <ShieldCheck size={32} />
                 </div>
                 <h2 className="hindi" style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: 8 }}>{t('Verify OTP')}</h2>
                 <p className="hindi" style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: 32 }}>{t('Enter OTP sent to')} <span style={{ fontWeight: 700, color: '#1e293b' }}>{form.phone}</span></p>
                 
                 <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 32 }}>
                    {otp.map((digit, i) => (
                      <input key={i} maxLength={1} style={{ width: 56, height: 64, textAlign: 'center', fontSize: '1.5rem', fontWeight: 800, borderRadius: 12, border: '2px solid #e2e8f0', outline: 'none', focus: { borderColor: '#1d4ed8' } }} />
                    ))}
                 </div>

                 <p className="hindi" style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: 32 }}>{t('Didn\'t receive code?')} <span style={{ color: '#1d4ed8', fontWeight: 700, cursor: 'pointer' }}>{t('Resend OTP')}</span></p>

                 <div style={{ display: 'flex', gap: 16 }}>
                    <button type="button" onClick={prevStep} style={{ flex: 0.4, padding: '14px', borderRadius: 12, border: '1px solid #e2e8f0', background: 'white', color: '#475569', fontWeight: 700, cursor: 'pointer' }}>{t('Back')}</button>
                    <button type="submit" disabled={loading} style={{ flex: 1, padding: '14px', borderRadius: 12, border: 'none', background: '#1d4ed8', color: 'white', fontWeight: 800, fontSize: '1rem', cursor: 'pointer' }}>
                       {loading ? t('Verifying...') : t('Complete Registration')}
                    </button>
                 </div>
              </form>
            )}

            {step !== 3 && (
               <p className="hindi" style={{ textAlign: 'center', marginTop: 40, fontSize: '0.9rem', color: '#64748b' }}>
                  {t('Already have an account?')} <Link to="/auth/login" style={{ color: '#1d4ed8', fontWeight: 800, textDecoration: 'none' }}>{t('Login Now')}</Link>
               </p>
            )}

         </div>
      </div>

    </div>
  )
}
