import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import AdminLayout from '../../components/admin/AdminLayout'
import { 
  Send, Users, Mail, Phone, MessageSquare, 
  Search, Filter, ChevronRight, Bell, Sparkles,
  CheckCircle, AlertCircle, Clock, Smartphone
} from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'

export default function AdminCommunication() {
  const { t } = useLanguage()
  const [target, setTarget] = useState('students')
  const [method, setMethod] = useState('sms')
  const [message, setMessage] = useState('')
  const [schedule, setSchedule] = useState('now')
  const [loading, setLoading] = useState(false)
  const [recentLogs, setRecentLogs] = useState([])
  const [stats, setStats] = useState({ total_sent: 0, reach: '0%', success: '0%' })

  async function fetchLogs() {
    const { data } = await supabase
      .from('communication_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)
    setRecentLogs(data || [])
  }

  async function fetchStats() {
    const { count } = await supabase.from('communication_logs').select('*', { count: 'exact', head: true })
    setStats({ total_sent: count || 0, reach: '98%', success: '94%' })
  }

  useEffect(() => {
    fetchLogs()
    fetchStats()
  }, [])

  async function handleBroadcast(e) {
    e.preventDefault()
    setLoading(true)

    const { data, error } = await supabase.functions.invoke('send-broadcast', {
      body: {
        type: method,
        target: target,
        message: message
      }
    })

    if (error || (data && data.error)) {
      alert(error?.message || data?.error)
    } else {
      alert(`${t('Broadcast launched successfully to')} ${data.reach} ${t('recipients')}!`)
      setMessage('')
      fetchLogs()
      fetchStats()
    }
    setLoading(false)
  }

  return (
    <AdminLayout title={t("Communication Center")}>
      
      {/* Top Banner */}
      <div style={{ background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)', borderRadius: 16, padding: '32px 40px', color: 'white', marginBottom: 24, boxShadow: '0 10px 30px rgba(29, 78, 216, 0.2)', position: 'relative', overflow: 'hidden' }}>
         <div style={{ position: 'relative', zIndex: 2 }}>
            <h1 className="hindi" style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: 8 }}>{t('Broadcast Operations')}</h1>
            <p className="hindi" style={{ opacity: 0.9, fontSize: '0.95rem', maxWidth: 600 }}>{t('Instantly reach thousands of students, volunteers, and donors via multi-channel messaging.')}</p>
         </div>
         <Sparkles size={120} style={{ position: 'absolute', right: -20, top: -20, opacity: 0.1, transform: 'rotate(15deg)' }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>
        
        {/* Left: Compose Area */}
        <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', padding: 32 }}>
          <form onSubmit={handleBroadcast}>
            <div style={{ marginBottom: 32 }}>
              <label className="hindi" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', marginBottom: 16, textTransform: 'uppercase', letterSpacing: 1 }}>{t('1. Select Audience')}</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                {[
                  { id: 'students', label: t('Students'), icon: <Users size={18} /> },
                  { id: 'volunteers', label: t('Volunteers'), icon: <Sparkles size={18} /> },
                  { id: 'donors', label: t('Donors'), icon: <Bell size={18} /> }
                ].map(item => (
                  <div key={item.id} onClick={() => setTarget(item.id)} style={{ padding: '16px', borderRadius: 12, border: target === item.id ? '2px solid #1d4ed8' : '1px solid #e2e8f0', background: target === item.id ? '#eff6ff' : 'transparent', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ color: target === item.id ? '#1d4ed8' : '#94a3b8' }}>{item.icon}</div>
                    <span className="hindi" style={{ fontWeight: 700, color: target === item.id ? '#1d4ed8' : '#334155', fontSize: '0.9rem' }}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 32 }}>
              <label className="hindi" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', marginBottom: 16, textTransform: 'uppercase', letterSpacing: 1 }}>{t('2. Delivery Method')}</label>
              <div style={{ display: 'flex', gap: 24 }}>
                {[
                  { id: 'sms', label: 'SMS', icon: <Smartphone size={18} />, color: '#10b981' },
                  { id: 'whatsapp', label: 'WhatsApp', icon: <MessageSquare size={18} />, color: '#22c55e' },
                  { id: 'email', label: 'Email', icon: <Mail size={18} />, color: '#3b82f6' }
                ].map(item => (
                  <label key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                    <input type="radio" checked={method === item.id} onChange={() => setMethod(item.id)} style={{ width: 18, height: 18 }} />
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1e293b', display: 'flex', alignItems: 'center', gap: 6 }}>{item.icon} {item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 32 }}>
              <label className="hindi" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>{t('3. Message Content')}</label>
              <textarea 
                className="hindi"
                required
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder={t('Type your broadcast message here...')}
                style={{ width: '100%', minHeight: 180, padding: 20, borderRadius: 12, border: '1px solid #e2e8f0', fontSize: '1rem', outline: 'none', background: '#f8fafc', resize: 'vertical' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>{message.length} / {method === 'sms' ? '160 (1 Page)' : '2000'} chars</div>
                <div className="hindi" style={{ fontSize: '0.75rem', color: '#1d4ed8', fontWeight: 700, cursor: 'pointer' }}>{t('Use Template')}</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: 24 }}>
               <div style={{ display: 'flex', gap: 12 }}>
                 <select className="hindi" value={schedule} onChange={e => setSchedule(e.target.value)} style={{ padding: '10px 16px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: '0.85rem', fontWeight: 600, color: '#4b5563', cursor: 'pointer', outline: 'none' }}>
                    <option value="now">{t('Send Now')}</option>
                    <option value="later">{t('Schedule for Later')}</option>
                 </select>
               </div>
               <button type="submit" disabled={loading || !message} style={{ padding: '12px 32px', background: '#1d4ed8', color: 'white', border: 'none', borderRadius: 10, fontSize: '0.9rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', opacity: (loading || !message) ? 0.6 : 1, boxShadow: '0 4px 12px rgba(29, 78, 216, 0.2)' }}>
                 {loading ? t('Processing...') : <><Send size={18} /> {t('Launch Broadcast')}</>}
               </button>
            </div>
          </form>
        </div>

        {/* Right: Stats & Logs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
           
           <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', padding: 24 }}>
             <h3 className="hindi" style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1e293b', marginBottom: 20, textTransform: 'uppercase', letterSpacing: 0.5 }}>{t('Monthly Reach')}</h3>
             <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
               <div>
                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span className="hindi" style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>{t('SMS Credits Used')}</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#111' }}>8,420 / 25,000</span>
                 </div>
                 <div style={{ height: 6, background: '#f1f5f9', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ width: '34%', height: '100%', background: '#10b981', borderRadius: 3 }}></div>
                 </div>
               </div>
               <div>
                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span className="hindi" style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>{t('Email Delivery')}</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#111' }}>99.2%</span>
                 </div>
                 <div style={{ height: 6, background: '#f1f5f9', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ width: '99%', height: '100%', background: '#3b82f6', borderRadius: 3 }}></div>
                 </div>
               </div>
             </div>
           </div>

           <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', padding: 24, flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h3 className="hindi" style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1e293b', textTransform: 'uppercase', letterSpacing: 0.5 }}>{t('Recent Activity')}</h3>
                <ChevronRight size={16} color="#94a3b8" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                 {recentLogs.length > 0 ? recentLogs.map((log, i) => (
                   <div key={log.id} style={{ display: 'flex', gap: 12 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: log.type === 'sms' ? '#10b981' : log.type === 'email' ? '#3b82f6' : '#22c55e', marginTop: 4 }}></div>
                      <div>
                        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>{log.type.toUpperCase()} to {log.target.toUpperCase()}</div>
                        <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: 2 }}>
                          {new Date(log.created_at).toLocaleString()} • <span style={{ textTransform: 'capitalize' }}>{log.status}</span>
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: 4, fontStyle: 'italic', borderLeft: '2px solid #e2e8f0', paddingLeft: 8 }}>
                          {log.message.substring(0, 60)}{log.message.length > 60 ? '...' : ''}
                        </div>
                      </div>
                   </div>
                 )) : (
                   <div style={{ textAlign: 'center', padding: '20px 0', color: '#94a3b8', fontSize: '0.8rem' }}>
                     {t('No recent activity found')}
                   </div>
                 )}
              </div>
              <button className="hindi" style={{ width: '100%', background: 'none', border: '1px dashed #ced4da', padding: '10px', borderRadius: 8, fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginTop: 24, cursor: 'pointer' }}>{t('VIEW ALL LOGS')}</button>
           </div>

        </div>

      </div>

    </AdminLayout>
  )
}
