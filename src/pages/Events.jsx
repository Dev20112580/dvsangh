import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { Calendar, MapPin, Users, Clock, Video, CheckCircle, CalendarDays } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

export default function Events() {
  const { t, language } = useLanguage()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const { user } = useAuth()

  async function fetchEvents() {
    const { data } = await supabase.from('events').select('*').eq('status', 'published').order('event_date', { ascending: true })
    setEvents(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchEvents() }, [])

  async function handleRegister(eventId) {
    if (!user) { window.location.href = '/login'; return }
    const { error } = await supabase.from('event_registrations').insert({ event_id: eventId, user_id: user.id })
    if (!error) {
      setEvents(prev => prev.map(e => e.id === eventId ? { ...e, registered_count: (e.registered_count || 0) + 1, _registered: true } : e))
    }
  }

  const now = new Date()
  const filtered = events.filter(e => {
    if (filter === 'upcoming') return new Date(e.event_date) >= now
    if (filter === 'past') return new Date(e.event_date) < now
    return true
  })

  const typeColors = { workshop: '#3B82F6', sports: '#10B981', webinar: '#8B5CF6', coaching: '#F59E0B', cultural: '#EC4899', social: '#06B6D4' }

  return (
    <>
      <div className="page-header">
        <h1 className="hindi">{t('Events')}</h1>
        <p className="hindi">{t('Educational, cultural, and sports events by DVS')}</p>
        <div className="breadcrumb"><Link to="/">{t('Home')}</Link> <span>/</span> <span>{t('Events')}</span></div>
      </div>

      <section className="section">
        <div className="container">
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 40 }}>
            {['all', 'upcoming', 'past'].map(f => (
              <button key={f} className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFilter(f)}>
                {f === 'all' ? t('All') : f === 'upcoming' ? t('Upcoming') : t('Past')}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-2">{[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: 200, borderRadius: 'var(--radius-lg)' }} />)}</div>
          ) : filtered.length > 0 ? (
            <div className="grid grid-2">
              {filtered.map(event => {
                const isPast = new Date(event.event_date) < now
                return (
                  <div className="card" key={event.id} style={{ display: 'flex', gap: 24, flexWrap: 'wrap', opacity: isPast ? 0.7 : 1 }}>
                    <div style={{ flex: '0 0 90px', textAlign: 'center' }}>
                      <div style={{ background: 'var(--dvs-orange-bg)', borderRadius: 'var(--radius-md)', padding: 16 }}>
                        <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--dvs-orange)', lineHeight: 1 }}>
                          {new Date(event.event_date).getDate()}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--gray-500)', fontWeight: 600, marginTop: 4 }}>
                          {new Date(event.event_date).toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-US', { month: 'short' })}
                        </div>
                      </div>
                    </div>
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <div style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                        <span className="badge" style={{ background: (typeColors[event.type] || '#6B7280') + '15', color: typeColors[event.type] || '#6B7280' }}>{event.type}</span>
                        <span className="badge" style={{ background: event.mode === 'online' ? 'var(--info-bg)' : 'var(--success-bg)', color: event.mode === 'online' ? 'var(--info)' : 'var(--success)' }}>
                          {event.mode === 'online' ? '🌐 Online' : '📍 Offline'}
                        </span>
                        {isPast && <span className="badge badge-warning">{t('Finished')}</span>}
                      </div>
                      <h4 style={{ marginBottom: 8 }}>{language === 'hi' ? (event.title_hi || event.title) : event.title}</h4>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, color: 'var(--gray-500)', fontSize: '0.85rem', marginBottom: 16 }}>
                        {event.location && <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={14} /> {event.location}</span>}
                        {event.capacity && <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Users size={14} /> {event.registered_count || 0}/{event.capacity}</span>}
                      </div>
                      {!isPast && (
                        <button className="btn btn-sm btn-primary" onClick={() => handleRegister(event.id)}
                          disabled={event._registered}>
                          {event._registered ? `✅ ${t('Registered')}` : `📝 ${t('Register Now')}`}
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: 60, color: 'var(--gray-400)' }}>
              <CalendarDays size={64} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
              <p className="hindi" style={{ fontSize: '1.1rem' }}>{t('No events available right now')}</p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
