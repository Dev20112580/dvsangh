import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAdmin } from '../../context/AdminContext';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { setAdmin } = useAdmin();
  const [step, setStep] = useState(1); // 1=credentials, 2=otp
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [otp, setOtp] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked] = useState(false);
  const [lockTimer, setLockTimer] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [adminData, setAdminData] = useState(null);

  useEffect(() => {
    let timer;
    if (locked && lockTimer > 0) {
      timer = setInterval(() => {
        setLockTimer(prev => prev - 1);
      }, 60000);
    } else if (lockTimer === 0) {
      setLocked(false);
    }
    return () => clearInterval(timer);
  }, [locked, lockTimer]);

  const isValidAdminId = (id) => {
    return /^DVS-[A-Z0-9]{4,6}$/.test(id);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (locked) {
      setError(`Account locked. Wait ${lockTimer} minutes.`);
      return;
    }

    if (!isValidAdminId(adminId)) {
      setError('Invalid Admin ID format. Use DVS-F001');
      return;
    }

    setLoading(true);

    try {
      // 1. Check admin in Supabase
      const { data: admin, error: adminError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('admin_id', adminId.toUpperCase())
        .eq('status', 'active')
        .single();

      if (adminError || !admin) {
        handleFailedAttempt();
        setError('Invalid Admin ID or password.');
        return;
      }

      // 2. Check if account is locked
      if (admin.locked_until && new Date(admin.locked_until) > new Date()) {
        const mins = Math.ceil((new Date(admin.locked_until) - new Date()) / 60000);
        setError(`Account locked for ${mins} more minutes.`);
        setLocked(true);
        setLockTimer(mins);
        return;
      }

      // 3. Verify password via Supabase Auth
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: admin.email,
        password: password
      });

      if (authError) {
        handleFailedAttempt(admin.id);
        setError('Invalid Admin ID or password.');
        return;
      }

      // 4. Reset failed attempts in DB
      await supabase
        .from('admin_users')
        .update({ login_attempts: 0, locked_until: null })
        .eq('id', admin.id);

      // 5. Store session data
      const sessionData = {
        id: admin.id,
        adminId: admin.admin_id,
        name: admin.full_name,
        level: admin.admin_level,
        type: admin.admin_type,
        designation: admin.designation,
        email: admin.email,
        lastLogin: new Date().toISOString()
      };
      
      setAdminData(sessionData);

      // 6. Handle 2FA (Mandatory for Level 1)
      if (admin.two_fa_enabled || admin.admin_level === 1) {
        await sendOTP(admin.email);
        setStep(2);
      } else {
        completeLogin(sessionData);
      }

    } catch (err) {
      setError('Something went wrong. Try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFailedAttempt = async (id) => {
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    if (newAttempts >= 3 && id) {
      const lockUntil = new Date(Date.now() + 15 * 60 * 1000);
      await supabase
        .from('admin_users')
        .update({ 
          login_attempts: newAttempts,
          locked_until: lockUntil.toISOString() 
        })
        .eq('id', id);

      // Alert Notification
      await supabase.from('notifications').insert({
        type: 'security_alert',
        title: 'Failed Admin Login Attempts',
        message: `Admin ID ${adminId} locked after 3 failed attempts.`,
      });

      setError('Account locked for 15 minutes. Founder has been notified.');
      setLocked(true);
      setLockTimer(15);
    }
  };

  const sendOTP = async (email) => {
    await supabase.auth.signInWithOtp({ email });
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.verifyOtp({
        email: adminData.email,
        token: otp,
        type: 'email'
      });

      if (error) {
        setError('Invalid OTP. Try again.');
        return;
      }

      completeLogin(adminData);
    } catch (err) {
      setError('OTP verification failed.');
    } finally {
      setLoading(false);
    }
  };

  const completeLogin = async (data) => {
    localStorage.setItem('dvs_admin', JSON.stringify(data));
    setAdmin(data);
    
    // Audit log
    await supabase.from('audit_logs').insert({
      admin_id: data.id,
      action: 'admin_login',
      ip_address: 'client_ip'
    });

    await supabase.from('admin_users')
      .update({ last_login_at: new Date() })
      .eq('id', data.id);

    navigate('/admin/dashboard');
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <img src="/logo_dvs.webp" alt="DVS Logo" width="60" height="60" style={{ borderRadius: '50%' }} />
          <h1>Admin Panel</h1>
          <p>प्रशासक लॉगिन</p>
          <span className="secure-badge">🔒 Secured by 2FA</span>
        </div>

        {step === 1 ? (
          <form onSubmit={handleLogin}>
            {error && <div className="error-box">⚠️ {error}</div>}

            <div className="form-group" style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', marginBottom: 8, fontSize: '0.85rem', fontWeight: 600, color: '#374151' }}>Admin ID</label>
              <input
                type="text"
                value={adminId}
                onChange={e => setAdminId(e.target.value.toUpperCase())}
                placeholder="DVS-F001"
                required
                disabled={locked}
                style={{ width: '100%', padding: '12px', borderRadius: 8, border: '1.5px solid #E5E7EB', outline: 'none' }}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', marginBottom: 8, fontSize: '0.85rem', fontWeight: 600, color: '#374151' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  disabled={locked}
                  style={{ width: '100%', padding: '12px', borderRadius: 8, border: '1.5px solid #E5E7EB', outline: 'none' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem' }}
                >
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button type="submit" className="admin-login-btn" disabled={loading || locked}>
              {loading ? 'Verifying...' : 'Login as Admin'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP}>
            <div className="otp-header" style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>📱</div>
              <p style={{ fontWeight: 700, margin: 0 }}>OTP Sent!</p>
              <p style={{ fontSize: '0.85rem', color: '#6B7280' }}>Hi {adminData?.name}, enter the 6-digit OTP sent to your email.</p>
            </div>

            {error && <div className="error-box">⚠️ {error}</div>}

            <input
              type="text"
              value={otp}
              onChange={e => setOtp(e.target.value)}
              placeholder="000000"
              maxLength="6"
              required
              style={{ width: '100%', padding: '16px', borderRadius: 12, border: '2px solid #E5E7EB', textAlign: 'center', fontSize: '1.5rem', letterSpacing: 8, outline: 'none', marginBottom: 20 }}
            />

            <button type="submit" className="admin-login-btn" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminLogin;
