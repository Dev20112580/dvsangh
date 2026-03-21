import { useAuth } from '../../context/AuthContext'

export default function VolunteerHours() {
  const { user } = useAuth()
  const { t, language } = useLanguage()
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [newLog, setNewLog] = useState({ date: new Date().toISOString().split('T')[0], activity: '', hours: '' })

  useEffect(() => {
    if (user) fetchLogs()
  }, [user])

  async function fetchLogs() {
    setLoading(true)
    const { data } = await supabase
      .from('volunteer_hours')
      .select('*')
      .eq('volunteer_id', user.id)
      .order('activity_date', { ascending: false })
    setLogs(data || [])
    setLoading(false)
  }

  const totalHours = logs.reduce((acc, log) => acc + (log.status === 'approved' ? parseFloat(log.hours_logged) : 0), 0)

  const handleAddLog = async (e) => {
    e.preventDefault()
    if (!user) return
    
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('volunteer_hours')
        .insert([{
          volunteer_id: user.id,
          activity_date: newLog.date,
          activity_description: newLog.activity,
          hours_logged: parseFloat(newLog.hours),
          status: 'pending'
        }])
        .select()
        .single()

      if (error) throw error
      
      setLogs([data, ...logs])
      setShowModal(false)
      setNewLog({ date: new Date().toISOString().split('T')[0], activity: '', hours: '' })
    } catch (err) {
      console.error('Error logging hours:', err)
      alert(t('Failed to log hours. Please try again.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="dashboard" style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
      <aside className="sidebar" style={{ width: 260, background: 'white', borderRight: '1px solid #e2e8f0', padding: '24px 16px' }}>
        <div style={{ padding: '0 12px 24px', borderBottom: '1px solid #f1f5f9', marginBottom: 24 }}>
           <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111' }}>DVS Volunteer</h2>
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/dashboard/volunteer" style={navStyle}><Home size={18} /> {t('Dashboard')}</NavLink>
          <NavLink to="/volunteer/tasks" style={navStyle}><CheckSquare size={18} /> {t('Tasks')}</NavLink>
          <NavLink to="/volunteer/hours" style={{ ...navStyle, background: '#eff6ff', color: '#1d4ed8', fontWeight: 700 }}><Clock size={18} /> {t('Hours Log')}</NavLink>
          <NavLink to="/volunteer/opportunities" style={navStyle}><Plus size={18} /> {t('Opportunities')}</NavLink>
          <NavLink to="/volunteer/profile" style={navStyle}><User size={18} /> {t('Profile')}</NavLink>
        </nav>
      </aside>

      <main className="dashboard-content" style={{ flex: 1, padding: 40 }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
           <div>
              <h1 className="hindi" style={{ fontSize: '2rem', fontWeight: 800, color: '#111' }}>{t('Hours Log')}</h1>
              <p className="hindi" style={{ color: '#64748b', marginTop: 4 }}>{t('Track your contributions and earned impact points.')}</p>
           </div>
           <button 
             onClick={() => setShowModal(true)}
             className="hindi" 
             style={{ background: '#111', color: 'white', border: 'none', padding: '12px 24px', borderRadius: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
           >
             <Plus size={18} /> {t('Log New Hours')}
           </button>
        </header>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginBottom: 40 }}>
           <div className="card" style={statCardStyle}>
              <div style={{ color: '#3b82f6', marginBottom: 12 }}><Clock size={24} /></div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{totalHours}h</div>
              <div className="hindi" style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>{t('Total Approved Hours')}</div>
           </div>
           <div className="card" style={statCardStyle}>
              <div style={{ color: '#10b981', marginBottom: 12 }}><Calendar size={24} /></div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{logs.length}</div>
              <div className="hindi" style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>{t('Activities Logged')}</div>
           </div>
           <div className="card" style={statCardStyle}>
              <div style={{ color: '#f59e0b', marginBottom: 12 }}><CheckCircle size={24} /></div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{Math.floor(totalHours * 10)}</div>
              <div className="hindi" style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>{t('Estimated Impact Points')}</div>
           </div>
        </div>

        {/* History Table */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
           <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 className="hindi" style={{ fontSize: '1rem', fontWeight: 700 }}>{t('Contribution History')}</h3>
           </div>
           <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                 <tr style={{ background: '#f8fafc' }}>
                    <th className="hindi" style={thStyle}>{t('Date')}</th>
                    <th className="hindi" style={thStyle}>{t('Activity Description')}</th>
                    <th className="hindi" style={thStyle}>{t('Duration')}</th>
                    <th className="hindi" style={thStyle}>{t('Status')}</th>
                 </tr>
              </thead>
              <tbody>
                 {loading && logs.length === 0 ? (
                    <tr><td colSpan="4" style={{ padding: 40, textAlign: 'center' }}>{t('Loading history...')}</td></tr>
                 ) : logs.map(log => (
                    <tr key={log.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                       <td style={tdStyle}>{log.activity_date}</td>
                       <td style={{ ...tdStyle, fontWeight: 700 }}>{log.activity_description}</td>
                       <td style={tdStyle}>{log.hours_logged} {t('hours')}</td>
                       <td style={tdStyle}>
                          <span style={{ 
                            padding: '4px 10px', borderRadius: 20, fontSize: '0.7rem', fontWeight: 700,
                            background: log.status === 'approved' ? '#f0fdf4' : log.status === 'rejected' ? '#fef2f2' : '#fffbeb',
                            color: log.status === 'approved' ? '#16a34a' : log.status === 'rejected' ? '#ef4444' : '#d97706'
                          }}>
                             {t(log.status.toUpperCase())}
                          </span>
                       </td>
                    </tr>
                 ))}
              </tbody>
           </table>
        </div>
      </main>

      {/* Log Hours Modal */}
      {showModal && (
        <div style={modalOverlayStyle}>
           <div style={modalStyle}>
              <h2 className="hindi" style={{ marginBottom: 24 }}>{t('Log Your Contribution')}</h2>
              <form onSubmit={handleAddLog}>
                 <div style={{ marginBottom: 16 }}>
                    <label style={labelStyle}>{t('Date')}</label>
                    <input 
                      type="date" required 
                      style={inputStyle} 
                      value={newLog.date} 
                      onChange={e => setNewLog({...newLog, date: e.target.value})}
                    />
                 </div>
                 <div style={{ marginBottom: 16 }}>
                    <label style={labelStyle}>{t('Activity / Task')}</label>
                    <input 
                      placeholder={t('e.g. Taught science for Grade 9')} required 
                      style={inputStyle}
                      value={newLog.activity}
                      onChange={e => setNewLog({...newLog, activity: e.target.value})}
                    />
                 </div>
                 <div style={{ marginBottom: 24 }}>
                    <label style={labelStyle}>{t('Hours Spent')}</label>
                    <input 
                      type="number" step="0.5" required 
                      style={inputStyle}
                      value={newLog.hours}
                      onChange={e => setNewLog({...newLog, hours: e.target.value})}
                    />
                 </div>
                 <div style={{ display: 'flex', gap: 12 }}>
                    <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: 12, borderRadius: 10, border: '1px solid #e2e8f0', background: 'white', fontWeight: 600, cursor: 'pointer' }}>{t('Cancel')}</button>
                    <button type="submit" style={{ flex: 1, padding: 12, borderRadius: 10, background: '#111', color: 'white', fontWeight: 600, border: 'none', cursor: 'pointer' }}>{t('Save Entry')}</button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  )
}

const navStyle = { display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 12, color: '#64748b', textDecoration: 'none', marginBottom: 4, transition: 'all 0.2s', fontSize: '0.95rem', fontWeight: 500 }
const statCardStyle = { padding: 24, display: 'flex', flexDirection: 'column', background: 'white', borderRadius: 20, border: '1px solid #e2e8f0' }
const thStyle = { padding: '16px 24px', fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.5 }
const tdStyle = { padding: '16px 24px', fontSize: '0.9rem', color: '#1e293b' }
const modalOverlayStyle = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }
const modalStyle = { background: 'white', padding: 32, borderRadius: 24, width: '100%', maxWidth: 400, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }
const labelStyle = { display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: 8 }
const inputStyle = { width: '100%', padding: '12px 16px', borderRadius: 10, border: '1px solid #e2e8f0', fontSize: '0.9rem', outline: 'none' }
