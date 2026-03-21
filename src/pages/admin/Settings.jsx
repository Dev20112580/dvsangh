import { useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { 
  ShieldAlert, Settings as SettingsIcon, Globe, Lock, 
  Unlink, Bell, Save, AlertTriangle, Key, ExternalLink 
} from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'
import { useLockdown } from '../../context/LockdownContext'

export default function AdminSettings() {
  const { t } = useLanguage()
  const { isLockdown, toggleLockdown } = useLockdown()
  const [unlockString, setUnlockString] = useState('')

  return (
    <AdminLayout title={t("System Settings")}>
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 24 }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* API Configuration */}
          <div className="card" style={{ padding: 24 }}>
            <h3 className="hindi" style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
              <SettingsIcon size={20} /> {t('API Configurations')}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { label: 'Fast2SMS API Key', value: 'f2s_********************', type: 'password' },
                { label: 'Razorpay Key ID', value: 'rzp_live_**********', type: 'text' },
                { label: 'SendGrid API Key', value: 'SG.*************************', type: 'password' },
                { label: 'Google Analytics ID', value: 'G-XXXXXXXXXX', type: 'text' }
              ].map(api => (
                <div key={api.label}>
                   <label className="hindi" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#64748b', marginBottom: 6 }}>{t(api.label)}</label>
                   <div style={{ display: 'flex', gap: 10 }}>
                      <input 
                        type={api.type} 
                        value={api.value}
                        readOnly 
                        style={{ flex: 1, padding: '10px 14px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '0.85rem' }}
                      />
                      <button className="btn btn-secondary btn-sm">{t('Update')}</button>
                   </div>
                </div>
              ))}
            </div>
            <button className="btn btn-primary hindi" style={{ marginTop: 24, width: '100%', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Save size={18} /> {t('Save All Changes')}
            </button>
          </div>

          {/* 2FA Status */}
          <div className="card" style={{ padding: 24, background: '#f8fafc' }}>
             <h3 className="hindi" style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
               <Key size={18} /> {t('Two-Factor Authentication (2FA)')}
             </h3>
             <p className="hindi" style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: 20 }}>{t('Mandatory for Founder and VP accounts for enhanced security.')}</p>
             <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 44, height: 24, background: '#10b981', borderRadius: 12, position: 'relative', cursor: 'pointer' }}>
                   <div style={{ position: 'absolute', right: 2, top: 2, width: 20, height: 20, background: 'white', borderRadius: '50%' }}></div>
                </div>
                <span className="hindi" style={{ fontWeight: 700, color: '#10b981' }}>{t('ENABLED')} (Authenticator App)</span>
             </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Emergency Lockdown */}
          <div className="card" style={{ padding: 24, border: '1px solid #fee2e2' }}>
            <h3 className="hindi" style={{ fontSize: '1.1rem', fontWeight: 700, color: '#dc2626', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
              <ShieldAlert size={20} /> {t('Emergency Lockdown')}
            </h3>
            <p className="hindi" style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: 20 }}>
              {t('Activating this will make the website read-only instantly. No donations or applications will be allowed.')}
            </p>
            
            {!isLockdown ? (
              <button 
                onClick={() => toggleLockdown(true)}
                className="hindi" 
                style={{ width: '100%', padding: '12px', background: '#dc2626', color: 'white', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}
              >
                {t('ACTIVATE LOCKDOWN')}
              </button>
            ) : (
              <div style={{ padding: 16, background: '#fef2f2', borderRadius: 8, border: '1px solid #fecaca' }}>
                 <div className="hindi" style={{ fontSize: '0.8rem', fontWeight: 700, color: '#dc2626', marginBottom: 12 }}>{t('SYSTEM IS LOCKED')}</div>
                 <input 
                   placeholder={t('Type "UNLOCK DVS" to restore')}
                   value={unlockString}
                   onChange={e => setUnlockString(e.target.value)}
                   style={{ width: '100%', padding: '10px', borderRadius: 6, border: '1px solid #dc2626', marginBottom: 10 }}
                 />
                 <button 
                    disabled={unlockString !== 'UNLOCK DVS'}
                    onClick={() => {toggleLockdown(false); setUnlockString('')}}
                    className="hindi" 
                    style={{ width: '100%', padding: '10px', background: unlockString === 'UNLOCK DVS' ? '#10b981' : '#e2e8f0', color: 'white', border: 'none', borderRadius: 8, fontWeight: 700, cursor: unlockString === 'UNLOCK DVS' ? 'pointer' : 'not-allowed' }}
                 >
                    {t('RESTORE ACCESS')}
                 </button>
              </div>
            )}
          </div>

          {/* Site Maintenance */}
          <div className="card" style={{ padding: 24 }}>
             <h3 className="hindi" style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 16 }}>{t('Backup & Maintenance')}</h3>
             <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <button className="btn btn-secondary hindi" style={{ width: '100%', justifyContent: 'flex-start' }}><Globe size={16} /> {t('Force DB Backup Now')}</button>
                <button className="btn btn-secondary hindi" style={{ width: '100%', justifyContent: 'flex-start' }}><Lock size={16} /> {t('Update SSL Certificate')}</button>
                <div style={{ padding: '12px', background: '#f8fafc', borderRadius: 8, fontSize: '0.75rem', color: '#64748b' }}>
                   {t('Last Backup')}: Today, 07:48 AM
                </div>
             </div>
          </div>
        </div>

      </div>
    </AdminLayout>
  )
}
