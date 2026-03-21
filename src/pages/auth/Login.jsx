import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'

export default function Login() {
  const { t } = useLanguage()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { data, error: err } = await signIn(email, password)
    if (err) { setError(err.message); setLoading(false); return }
    navigate('/')
  }

  return (
    <div style={{ marginTop: 72, minHeight: 'calc(100vh - 72px)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--gray-50)', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 64, height: 64, borderRadius: 'var(--radius-lg)', background: 'linear-gradient(135deg, var(--dvs-orange), var(--dvs-orange-dark))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '1.5rem', margin: '0 auto 16px' }}>DVS</div>
          <h2 className="hindi">{t('Login')}</h2>
          <p style={{ color: 'var(--gray-500)', marginTop: 4 }}>{t('Sign in to your account')}</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit}>
            {error && <div style={{ background: 'var(--danger-bg)', color: 'var(--danger)', padding: 12, borderRadius: 'var(--radius-sm)', marginBottom: 16, fontSize: '0.85rem' }}>{error}</div>}
            <div className="form-group">
              <label>Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
                <input className="form-control" type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="email@example.com" style={{ paddingLeft: 40 }} />
              </div>
            </div>
            <div className="form-group">
              <label>{t('Password')}</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
                <input className="form-control" type={showPass ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" style={{ paddingLeft: 40, paddingRight: 40 }} />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-400)' }}>
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
              <Link to="/forgot-password" style={{ fontSize: '0.85rem' }}>{t('Forgot Password?')}</Link>
            </div>
            <button type="submit" className="btn btn-primary btn-lg w-full" disabled={loading}>
              <LogIn size={18} /> {loading ? t('Loading...') : t('Login')}
            </button>

          </form>
          <p style={{ textAlign: 'center', marginTop: 24, color: 'var(--gray-500)', fontSize: '0.9rem' }}>
            {t('Don\'t have an account?')} <Link to="/register" style={{ fontWeight: 600 }}>{t('Register')}</Link>
          </p>
        </div>

        <p style={{ textAlign: 'center', marginTop: 16 }}>
          <Link to="/admin/login" style={{ fontSize: '0.8rem', color: 'var(--gray-400)' }}>{t('Admin Login →')}</Link>
        </p>
      </div>
    </div>
  )
}
