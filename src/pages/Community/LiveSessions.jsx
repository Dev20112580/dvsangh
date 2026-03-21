import { useState } from 'react'
import { Video, Calendar, Clock, User, ExternalLink, PlayCircle, Download, CheckCircle } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'

export default function LiveSessions() {
  const { t } = useLanguage()
  const [activeSegment, setActiveSegment] = useState('upcoming') // 'upcoming' or 'recordings'

  const upcoming = [
    {
      id: 1,
      title: 'UPSC 2024: Strategy for Ethics & Integrity',
      instructor: 'Prashant Kumar (VP)',
      date: 'Tomorrow, Oct 24',
      time: '06:00 PM - 07:30 PM',
      platform: 'Zoom',
      enrolled: 45
    },
    {
      id: 2,
      title: 'Digital Literacy: Internet Safety Workshop',
      instructor: 'Riya Dass',
      date: 'Oct 26, 2024',
      time: '11:00 AM - 12:30 PM',
      platform: 'Google Meet',
      enrolled: 120
    }
  ]

  const recordings = [
    {
      id: 101,
      title: 'SSC CGL: Quantitative Aptitude Basics',
      date: 'Oct 20, 2024',
      duration: '1h 15m',
      instructor: 'Vijay Sharma',
      views: 842
    },
    {
      id: 102,
      title: 'JPSC: Jharkhand History Part 1',
      date: 'Oct 15, 2024',
      duration: '2h 05m',
      instructor: 'Madhu Devi',
      views: 1205
    }
  ]

  return (
    <div style={{ background: '#F9FAFB', minHeight: '100vh', paddingTop: 100 }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
           <h1 className="hindi" style={{ fontSize: '2.5rem', fontWeight: 900, color: '#111827', marginBottom: 12 }}>{t('Live Doubt Clearing')} 🎥</h1>
           <p className="hindi" style={{ color: '#64748b', fontSize: '1.1rem', maxWidth: 600, margin: '0 auto' }}>
              {t('Interactive live sessions with mentors and experts. Real-time answers to your questions.')}
           </p>
        </div>

        <div style={{ maxWidth: 900, margin: '0 auto' }}>
           <div style={{ display: 'flex', gap: 8, background: '#f1f5f9', padding: 4, borderRadius: 12, marginBottom: 32 }}>
              <button 
                onClick={() => setActiveSegment('upcoming')}
                style={{ flex: 1, padding: '12px', borderRadius: 10, border: 'none', background: activeSegment === 'upcoming' ? 'white' : 'transparent', fontWeight: 700, color: activeSegment === 'upcoming' ? '#1D4ED8' : '#64748b', cursor: 'pointer', boxShadow: activeSegment === 'upcoming' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none' }}>
                {t('Upcoming Sessions')}
              </button>
              <button 
                onClick={() => setActiveSegment('recordings')}
                style={{ flex: 1, padding: '12px', borderRadius: 10, border: 'none', background: activeSegment === 'recordings' ? 'white' : 'transparent', fontWeight: 700, color: activeSegment === 'recordings' ? '#1D4ED8' : '#64748b', cursor: 'pointer', boxShadow: activeSegment === 'recordings' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none' }}>
                {t('Previous Recordings')}
              </button>
           </div>

           {activeSegment === 'upcoming' ? (
             <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {upcoming.map(session => (
                  <div key={session.id} className="card" style={{ padding: 32, borderLeft: '6px solid #1D4ED8' }}>
                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                        <div>
                           <div style={{ color: '#1D4ED8', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>{session.platform} LIVE SESSION</div>
                           <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#1e293b' }}>{session.title}</h3>
                        </div>
                        <span style={{ padding: '6px 12px', background: '#eff6ff', color: '#1d4ed8', borderRadius: 20, fontSize: '0.8rem', fontWeight: 700 }}>{session.enrolled} {t('joined')}</span>
                     </div>
                     
                     <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
                        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                           <User size={20} color="#64748b" />
                           <div>
                              <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase' }}>{t('Instructor')}</div>
                              <div style={{ fontWeight: 700 }}>{session.instructor}</div>
                           </div>
                        </div>
                        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                           <Clock size={20} color="#64748b" />
                           <div>
                              <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase' }}>{t('Date & Time')}</div>
                              <div style={{ fontWeight: 700 }}>{session.date} | {session.time}</div>
                           </div>
                        </div>
                     </div>

                     <div style={{ display: 'flex', gap: 12 }}>
                        <button className="btn btn-primary" style={{ padding: '12px 24px', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
                           <Video size={18} /> {t('Join Session')}
                        </button>
                        <button className="btn btn-secondary" style={{ padding: '12px 24px', borderRadius: 10 }}>
                           {t('Add to Calendar')}
                        </button>
                     </div>
                  </div>
                ))}
             </div>
           ) : (
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 24 }}>
                {recordings.map(r => (
                  <div key={r.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                     <div style={{ height: 180, background: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', position: 'relative' }}>
                        <PlayCircle size={64} style={{ opacity: 0.6 }} />
                        <span style={{ position: 'absolute', bottom: 12, right: 12, background: 'rgba(0,0,0,0.7)', padding: '2px 8px', borderRadius: 4, fontSize: '0.7rem' }}>{r.duration}</span>
                     </div>
                     <div style={{ padding: 24 }}>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 12, color: '#334155' }}>{r.title}</h4>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: '#64748b' }}>
                           <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Calendar size={14} /> {r.date}</div>
                           <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><User size={14} /> {r.instructor}</div>
                        </div>
                        <button className="hindi" style={{ width: '100%', marginTop: 20, padding: '10px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, color: '#1d4ed8', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                           <Download size={16} /> {t('Download Recording')}
                        </button>
                     </div>
                  </div>
                ))}
             </div>
           )}

           <div style={{ marginTop: 40, padding: 32, background: 'white', borderRadius: 24, border: '1px solid #e2e8f0', textAlign: 'center' }}>
              <CheckCircle size={48} color="#10B981" style={{ margin: '0 auto 16px' }} />
              <h3 className="hindi" style={{ fontSize: '1.2rem', fontWeight: 800 }}>{t('Attendance Certificate')}</h3>
              <p className="hindi" style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: 20 }}>
                 {t('Join the full session to automatically receive a digital certificate from DVS.')}
              </p>
              <button className="btn btn-secondary">{t('View My Certificates')}</button>
           </div>
        </div>
      </div>
    </div>
  )
}
