import { Bell, Pin, Clock } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'

export default function Announcements() {
  const { t } = useLanguage()

  const items = [
    {
      id: 1,
      title: 'New Scholarship Program for 10th Class Students 2024',
      content: 'Applications are now open for the DVS Merit-cum-Means scholarship for students scoring above 80% in boards.',
      isPinned: true,
      date: 'March 20, 2024'
    },
    {
      id: 2,
      title: 'Upcoming Career Guidance Webinar',
      content: 'Join us for a session with senior bureaucrats on preparation strategy for JPSC on March 25th.',
      isPinned: false,
      date: 'March 18, 2024'
    },
    {
       id: 3,
       title: 'Official DVS Mobile App Launch',
       content: 'Download our official PWA for offline access to study materials and real-time alerts.',
       isPinned: false,
       date: 'March 15, 2024'
    }
  ]

  return (
    <div className="container" style={{ padding: '40px 20px', maxWidth: 1000 }}>
      <div style={{ textAlign: 'center', marginBottom: 56 }}>
         <h1 className="hindi" style={{ fontSize: '2.5rem', marginBottom: 12 }}>📢 {t('Announcements')}</h1>
         <p className="hindi" style={{ color: 'var(--gray-500)', fontSize: '1.1rem' }}>{t('Stay updated with official news and alerts from DVS Foundation.')}</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
         {items.map(item => (
           <div key={item.id} className="card" style={{ padding: 32, borderLeft: item.isPinned ? '6px solid #A1401D' : '1px solid #e2e8f0', position: 'relative' }}>
              {item.isPinned && (
                <div style={{ position: 'absolute', right: 24, top: 24, color: '#A1401D', display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', fontWeight: 800 }}>
                   <Pin size={16} /> {t('Pinned')}
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--gray-400)', fontSize: '0.85rem', marginBottom: 12 }}>
                 <Clock size={14} /> {item.date}
              </div>
              <h2 className="hindi" style={{ fontSize: '1.4rem', marginBottom: 16 }}>{item.title}</h2>
              <p className="hindi" style={{ color: 'var(--gray-600)', lineHeight: 1.8, fontSize: '1.1rem' }}>{item.content}</p>
              
              <div style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid #f1f5f9' }}>
                 <button className="btn btn-secondary btn-sm hindi">{t('Read More')}</button>
              </div>
           </div>
         ))}
      </div>
    </div>
  )
}
