import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import AdminLayout from '../../components/admin/AdminLayout'
import { 
  Calendar, Plus, Clock, Users, MapPin, 
  MoreHorizontal, Video, AlignLeft, Search, Filter, Trash2
} from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'

export default function AdminEvents() {
  const { t, language } = useLanguage()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', title_hi: '', description: '', type: 'workshop', mode: 'offline', event_date: '', location: '', capacity: '' })

  useEffect(() => { fetchEvents() }, [])

  async function fetchEvents() {
    const { data } = await supabase.from('events').select('*').order('event_date', { ascending: false })
    setEvents(data || [])
    setLoading(false)
  }

  async function handleCreate(e) {
    e.preventDefault()
    const { error } = await supabase.from('events').insert({ ...form, status: 'published', capacity: form.capacity ? parseInt(form.capacity) : null })
    if (!error) { setShowForm(false); fetchEvents(); setForm({ title: '', title_hi: '', description: '', type: 'workshop', mode: 'offline', event_date: '', location: '', capacity: '' }) }
  }

  async function handleDelete(id) {
    if (confirm('Delete this event permanently?')) {
      await supabase.from('events').delete().eq('id', id)
      setEvents(prev => prev.filter(e => e.id !== id))
    }
  }

  const getTypeStyle = (type) => {
    const types = {
      'workshop': { bg: '#fff7ed', color: '#A1401D', label: t('Workshop') },
      'sports': { bg: '#ffedd5', color: '#c2410c', label: t('Sports') },
      'webinar': { bg: '#f3e8ff', color: '#7e22ce', label: t('Webinar') },
      'coaching': { bg: '#ecfdf5', color: '#047857', label: t('Coaching') },
      'cultural': { bg: '#fef2f2', color: '#dc2626', label: t('Cultural') }
    }
    return types[type] || { bg: '#f1f5f9', color: '#475569', label: t(type) }
  }

  return (
    <AdminLayout title={t("Engagement & Scheduling")}>
      
      {/* Top Action Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
         <div>
            <div className="hindi" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111' }}>{t('Event Operations')}</div>
            <div className="hindi" style={{ fontSize: '0.8rem', color: '#64748b', marginTop: 4 }}>{t('Manage')} {events.length} {t('upcoming and past engagements.')}</div>
         </div>
         <div style={{ display: 'flex', gap: 12 }}>
            <button 
              onClick={() => setShowForm(!showForm)}
              className="hindi"
              style={{ padding: '8px 16px', background: showForm ? '#ef4444' : '#111', border: 'none', borderRadius: 8, fontSize: '0.8rem', fontWeight: 600, color: 'white', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', transition: 'all 0.2s' }}
            >
              {showForm ? t('Cancel Creation') : <><Plus size={16} /> {t('Schedule New Event')}</>}
            </button>
         </div>
      </div>

      {showForm && (
        <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', padding: 32, marginBottom: 24, boxShadow: '0 10px 40px rgba(0,0,0,0.04)' }}>
          <div className="hindi" style={{ fontSize: '1.1rem', fontWeight: 800, color: '#111', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Calendar size={20} color="#A1401D" /> {t('Create New Event')}
          </div>
          <form onSubmit={handleCreate}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              <div>
                <label className="hindi" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>{t('Event Title (English)')}</label>
                <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} style={{ width: '100%', padding: '12px 16px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: '0.9rem', outline: 'none' }} placeholder="e.g. Annual Tech Summit" />
              </div>
              <div>
                <label className="hindi" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>{t('Title (Hindi)')}</label>
                <input value={form.title_hi} onChange={e => setForm({ ...form, title_hi: e.target.value })} style={{ width: '100%', padding: '12px 16px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: '0.9rem', outline: 'none' }} placeholder="हिंदी शीर्षक" />
              </div>

              <div>
                <label className="hindi" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>{t('Event Format')}</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <select className="hindi" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} style={{ width: '100%', padding: '12px 16px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: '0.9rem', outline: 'none', backgroundColor: 'white' }}>
                    <option value="workshop">{t('Workshop')}</option>
                    <option value="sports">{t('Sports')}</option>
                    <option value="webinar">{t('Webinar')}</option>
                    <option value="coaching">{t('Coaching')}</option>
                    <option value="cultural">{t('Cultural')}</option>
                  </select>
                  <select className="hindi" value={form.mode} onChange={e => setForm({ ...form, mode: e.target.value })} style={{ width: '100%', padding: '12px 16px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: '0.9rem', outline: 'none', backgroundColor: 'white' }}>
                    <option value="offline">{t('In-Person')}</option>
                    <option value="online">{t('Virtual')}</option>
                    <option value="hybrid">{t('Hybrid')}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="hindi" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>{t('Date & Time')}</label>
                <input type="datetime-local" required value={form.event_date} onChange={e => setForm({ ...form, event_date: e.target.value })} style={{ width: '100%', padding: '12px 16px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: '0.9rem', outline: 'none' }} />
              </div>

              <div>
                <label className="hindi" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>{t('Location / URL')}</label>
                <input className="hindi" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} style={{ width: '100%', padding: '12px 16px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: '0.9rem', outline: 'none' }} placeholder={form.mode === 'offline' ? t("Venue Address") : t("Meeting Link")} />
              </div>
              
              <div>
                <label className="hindi" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>{t('Attendee Capacity')}</label>
                <input className="hindi" type="number" value={form.capacity} onChange={e => setForm({ ...form, capacity: e.target.value })} style={{ width: '100%', padding: '12px 16px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: '0.9rem', outline: 'none' }} placeholder={t("Max participants (leave empty for unlimited)")} />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label className="hindi" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>{t('Event Description')}</label>
                <textarea className="hindi" required value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={{ width: '100%', padding: '16px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: '0.9rem', outline: 'none', minHeight: 120, resize: 'vertical' }} placeholder={t("Detailed overview of the event...")} />
              </div>
            </div>

            <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end', gap: 12, borderTop: '1px solid #f1f5f9', paddingTop: 24 }}>
              <button type="button" onClick={() => setShowForm(false)} className="hindi" style={{ padding: '12px 24px', background: 'transparent', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: '0.9rem', fontWeight: 700, color: '#475569', cursor: 'pointer' }}>{t('Cancel')}</button>
              <button type="submit" className="hindi" style={{ padding: '12px 32px', background: '#A1401D', border: 'none', borderRadius: 8, fontSize: '0.9rem', fontWeight: 700, color: 'white', cursor: 'pointer', boxShadow: '0 4px 12px rgba(161, 64, 29, 0.2)' }}>{t('Publish Event')}</button>
            </div>
          </form>
        </div>
      )}

      {/* Events List */}
      <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        
        {/* Filter Bar */}
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', gap: 16, alignItems: 'center', background: '#f8fafc' }}>
          <div style={{ position: 'relative', width: 320 }}>
            <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
            <input className="hindi" placeholder={t("Search events...")} style={{ width: '100%', padding: '10px 16px 10px 40px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: '0.85rem', outline: 'none' }} />
          </div>
          <div style={{ flex: 1 }}></div>
          <button className="hindi" style={{ background: 'transparent', border: 'none', color: '#64748b', display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
             <Filter size={16} /> {t('Filter by Mode')}
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'white' }}>
                <th className="hindi" style={{ padding: '16px 24px', fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, borderBottom: '1px solid #f1f5f9' }}>{t('Engagement Details')}</th>
                <th className="hindi" style={{ padding: '16px 24px', fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, borderBottom: '1px solid #f1f5f9' }}>{t('Categorization')}</th>
                <th className="hindi" style={{ padding: '16px 24px', fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, borderBottom: '1px solid #f1f5f9' }}>{t('Logistics')}</th>
                <th className="hindi" style={{ padding: '16px 24px', fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, borderBottom: '1px solid #f1f5f9' }}>{t('Attendance Status')}</th>
                <th className="hindi" style={{ padding: '16px 24px', fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, borderBottom: '1px solid #f1f5f9', textAlign: 'right' }}>{t('Management')}</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="hindi" style={{ padding: 40, textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem' }}>{t('Loading engagements...')}</td></tr>
              ) : events.length === 0 ? (
                <tr><td colSpan={5} className="hindi" style={{ padding: 40, textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem' }}>{t('No events scheduled currently.')}</td></tr>
              ) : (
                events.map(ev => {
                  const typeStyle = getTypeStyle(ev.type)
                  const isPast = new Date(ev.event_date) < new Date()
                  return (
                    <tr key={ev.id} style={{ borderBottom: '1px solid #f1f5f9', background: 'white', transition: 'background 0.2s', opacity: isPast ? 0.7 : 1 }} onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'} onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                      <td style={{ padding: '20px 24px' }}>
                         <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#111' }}>{language === 'hi' && ev.title_hi ? ev.title_hi : ev.title}</div>
                         <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                            <AlignLeft size={12} /> {ev.description?.substring(0, 50)}...
                         </div>
                      </td>
                      <td style={{ padding: '20px 24px' }}>
                         <div className="hindi" style={{ display: 'inline-flex', padding: '4px 10px', background: typeStyle.bg, color: typeStyle.color, borderRadius: 6, fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                           {typeStyle.label}
                         </div>
                      </td>
                      <td style={{ padding: '20px 24px' }}>
                         <div style={{ fontSize: '0.8rem', color: '#334155', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}>
                            <Clock size={14} color="#1d4ed8" />
                            {new Date(ev.event_date).toLocaleString(language === 'hi' ? 'hi-IN' : 'en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                         </div>
                         <div className="hindi" style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
                            {ev.mode === 'online' ? <Video size={14} /> : <MapPin size={14} />}
                            {t(ev.mode === 'offline' ? 'In-Person' : ev.mode === 'online' ? 'Virtual' : 'Hybrid')} • {ev.location || 'TBA'}
                         </div>
                      </td>
                      <td style={{ padding: '20px 24px' }}>
                         <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                           <div style={{ width: 120, height: 6, background: '#f1f5f9', borderRadius: 3, overflow: 'hidden' }}>
                              <div style={{ width: `${ev.capacity ? Math.min(100, (ev.registered_count || 0) / ev.capacity * 100) : 0}%`, height: '100%', background: '#1d4ed8', borderRadius: 3 }}></div>
                           </div>
                           <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#111' }}>
                             {ev.registered_count || 0} <span style={{ color: '#94a3b8', fontWeight: 500 }}>/ {ev.capacity || '∞'}</span>
                           </div>
                         </div>
                      </td>
                      <td style={{ padding: '20px 24px', textAlign: 'right' }}>
                         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8 }}>
                            <button className="hindi" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 6, padding: '6px 14px', fontSize: '0.75rem', fontWeight: 600, color: '#475569', cursor: 'pointer' }}>{t('Manage')}</button>
                            <button onClick={() => handleDelete(ev.id)} style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 6, padding: 6, color: '#dc2626', display: 'flex', cursor: 'pointer' }} title={t("Delete Event")}><Trash2 size={16} /></button>
                         </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}
