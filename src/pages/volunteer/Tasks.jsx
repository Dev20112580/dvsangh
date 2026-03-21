import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { Home, CheckSquare, Clock, User, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'

export default function VolunteerTasks() {
  const { t } = useLanguage()
  const { user } = useAuth()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) fetchTasks()
  }, [user])

  async function fetchTasks() {
    setLoading(true)
    const { data } = await supabase
      .from('volunteer_tasks')
      .select('*')
      .or(`volunteer_id.eq.${user.id},status.eq.open`)
      .order('created_at', { ascending: false })
    setTasks(data || [])
    setLoading(false)
  }

  async function updateStatus(taskId, newStatus) {
    const { error } = await supabase
      .from('volunteer_tasks')
      .update({ status: newStatus, volunteer_id: newStatus === 'assigned' ? user.id : undefined })
      .eq('id', taskId)
    
    if (error) {
      alert(t('Error updating task'))
    } else {
      fetchTasks()
    }
  }

  const myTasks = tasks.filter(t => t.volunteer_id === user?.id)
  const openTasks = tasks.filter(t => t.status === 'open')

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <nav className="sidebar-nav" style={{ paddingTop: 24 }}>
          <NavLink to="/dashboard/volunteer"><Home size={18} /> {t('Dashboard')}</NavLink>
          <NavLink to="/volunteer/tasks"><CheckSquare size={18} /> {t('Tasks')}</NavLink>
          <NavLink to="/volunteer/hours"><Clock size={18} /> {t('Hours Log')}</NavLink>
          <NavLink to="/volunteer/profile"><User size={18} /> {t('Profile')}</NavLink>
        </nav>
      </aside>
      <main className="dashboard-content">
        <div className="dashboard-header"><h1 className="hindi">📋 {t('Task Board')}</h1></div>

        {loading ? (
          <div className="skeleton" style={{ height: 300, borderRadius: 20 }} />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 300px', gap: 24 }}>
            <div>
              <h3 className="hindi" style={{ marginBottom: 20, fontSize: '1.2rem' }}>{t('My Assignments')}</h3>
              {myTasks.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {myTasks.map(task => (
                    <div className="card" key={task.id} style={{ padding: 24, borderLeft: `4px solid ${task.status === 'completed' ? '#10B981' : '#3b82f6'}` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                        <h4 className="hindi" style={{ fontSize: '1.1rem' }}>{task.title}</h4>
                        <span className="badge" style={{ 
                          background: task.status === 'completed' ? '#f0fdf4' : '#eff6ff', 
                          color: task.status === 'completed' ? '#16a34a' : '#1d4ed8' 
                        }}>{t(task.status.toUpperCase())}</span>
                      </div>
                      <p className="hindi" style={{ color: 'var(--gray-500)', fontSize: '0.9rem', marginBottom: 20 }}>{task.description}</p>
                      {task.status !== 'completed' && (
                        <button 
                          onClick={() => updateStatus(task.id, 'completed')}
                          className="btn btn-sm btn-primary"
                        >
                          <CheckCircle2 size={16} /> {t('Mark as Completed')}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="card" style={{ padding: 40, textAlign: 'center', opacity: 0.7 }}>
                  <p className="hindi">{t('No active assignments. Claim a task from the board!')}</p>
                </div>
              )}
            </div>

            <div>
              <h3 className="hindi" style={{ marginBottom: 20, fontSize: '1.2rem' }}>{t('Open Roles')}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {openTasks.length > 0 ? openTasks.map(task => (
                  <div className="card-flat" key={task.id} style={{ padding: 20 }}>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                       <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#FF6B35', textTransform: 'uppercase' }}>{task.priority || 'Medium'} {t('Priority')}</span>
                    </div>
                    <h5 className="hindi" style={{ marginBottom: 12 }}>{task.title}</h5>
                    <button 
                      onClick={() => updateStatus(task.id, 'assigned')}
                      className="btn btn-sm btn-secondary w-full"
                    >
                      {t('Claim Role')} <ArrowRight size={14} />
                    </button>
                  </div>
                )) : (
                  <p className="hindi" style={{ textAlign: 'center', color: 'var(--gray-400)', fontSize: '0.85rem', padding: 20 }}>
                    {t('All roles are currently filled.')}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
