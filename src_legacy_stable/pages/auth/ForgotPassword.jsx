import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error: err } = await supabase.auth.resetPasswordForEmail(email)
    if (err) { setError(err.message); setLoading(false); return }
    setSent(true)
    setLoading(false)
  }

  return (
    <div style={{ marginTop: 72, minHeight: 'calc(100vh - 72px)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--gray-50)', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div className="card">
          {sent ? (
            <div style={{ textAlign: 'center', padding: 24 }}>
              <CheckCircle size={56} color="var(--success)" style={{ margin: '0 auto 16px' }} />
              <h3 className="hindi">ईमेल भेज दिया गया!</h3>
              <p style={{ color: 'var(--gray-500)', marginTop: 8, fontSize: '0.9rem' }}>
                Password reset link आपके email <strong>{email}</strong> पर भेजा गया है। कृपया अपना email check करें।
              </p>
              <Link to="/login" className="btn btn-primary mt-3">लॉगिन पर वापस जाएं</Link>
            </div>
          ) : (
            <>
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <h3 className="hindi">पासवर्ड रीसेट</h3>
                <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem', marginTop: 4 }}>
                  अपना registered email दर्ज करें, हम reset link भेजेंगे
                </p>
              </div>
              <form onSubmit={handleSubmit}>
                {error && <div style={{ background: 'var(--danger-bg)', color: 'var(--danger)', padding: 12, borderRadius: 'var(--radius-sm)', marginBottom: 16, fontSize: '0.85rem' }}>{error}</div>}
                <div className="form-group">
                  <label>Email</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
                    <input className="form-control" type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="email@example.com" style={{ paddingLeft: 40 }} />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary w-full" disabled={loading}>{loading ? 'Sending...' : 'Reset Link भेजें'}</button>
              </form>
              <p style={{ textAlign: 'center', marginTop: 16 }}>
                <Link to="/login" style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'center', fontSize: '0.9rem', color: 'var(--gray-500)' }}><ArrowLeft size={16} /> लॉगिन पर वापस जाएं</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
