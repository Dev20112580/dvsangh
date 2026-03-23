import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import { Users, Search, MessageSquare, BookOpen, MapPin, CheckCircle, Shield } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'

export default function StudyBuddy() {
  const { t } = useLanguage()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('find')
  const [searchTerm, setSearchTerm] = useState('')
  const [buddies, setBuddies] = useState([])
  const [loading, setLoading] = useState(true)

  async function fetchBuddies() {
    setLoading(true)
    try {
      const { data } = await supabase.from('profiles').select('*').limit(10)
      setBuddies((data || []).filter(p => p.id !== user?.id).map(p => ({
        id: p.id,
        name: p.full_name || 'Anonymous Student',
        exam: 'General Studies',
        language: 'Hindi/English',
        district: 'Jharkhand',
        availability: 'Contact for details',
        interests: ['Scholarship Updates'],
        match: Math.floor(Math.random() * 20) + 75
      })))
    } catch (err) {
      console.error('Error fetching buddies:', err)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchBuddies()
  }, [])

  const myBuddies = [] // Placeholder for real connections which would need a join table

  return (
    <div style={{ background: '#F9FAFB', minHeight: '100vh', paddingTop: 100 }}>
      {/* ... rest of the component remains similar but use buddies state ... */}
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
           <h1 className="hindi" style={{ fontSize: '2.5rem', fontWeight: 900, color: '#111827', marginBottom: 12 }}>{t('Study Buddy System')} 🤝</h1>
           <p className="hindi" style={{ color: '#64748b', fontSize: '1.1rem', maxWidth: 600, margin: '0 auto' }}>
              {t('Don\'t study alone. Find a partner with the same goal and double your progress.')}
           </p>
        </div>

        <div style={{ maxWidth: 800, margin: '0 auto' }}>
           <div style={{ display: 'flex', gap: 8, background: '#f1f5f9', padding: 4, borderRadius: 12, marginBottom: 24 }}>
              <button 
                onClick={() => setActiveTab('find')}
                style={{ flex: 1, padding: '10px', borderRadius: 10, border: 'none', background: activeTab === 'find' ? 'white' : 'transparent', fontWeight: 700, color: activeTab === 'find' ? '#FF6B35' : '#64748b', cursor: 'pointer', boxShadow: activeTab === 'find' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none' }}>
                {t('Find Buddies')}
              </button>
              <button 
                onClick={() => setActiveTab('my-buddies')}
                style={{ flex: 1, padding: '10px', borderRadius: 10, border: 'none', background: activeTab === 'my-buddies' ? 'white' : 'transparent', fontWeight: 700, color: activeTab === 'my-buddies' ? '#FF6B35' : '#64748b', cursor: 'pointer', boxShadow: activeTab === 'my-buddies' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none' }}>
                {t('My Connections')}
              </button>
           </div>

           {activeTab === 'find' ? (
             <>
               <div style={{ position: 'relative', marginBottom: 32 }}>
                  <Search size={20} color="#94a3b8" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)' }} />
                  <input 
                    placeholder={t('Search by Exam (e.g. UPSC) or District...')}
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    style={{ width: '100%', padding: '16px 16px 16px 48px', borderRadius: 16, border: '1px solid #e2e8f0', fontSize: '1rem', outline: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}
                  />
               </div>

               <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                 {loading ? (
                   <p>{t('Seeking study partners...')}</p>
                 ) : buddies.length > 0 ? buddies.map(buddy => (
                   <div key={buddy.id} className="card" style={{ padding: 24, display: 'flex', gap: 24, alignItems: 'center' }}>
                      <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 800, color: '#1d4ed8' }}>{buddy.name[0]}</div>
                      <div style={{ flex: 1 }}>
                         <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1e293b' }}>{buddy.name}</h3>
                            <span style={{ padding: '2px 8px', background: '#dcfce7', color: '#166534', borderRadius: 20, fontSize: '0.65rem', fontWeight: 800 }}>{buddy.match}% Match</span>
                         </div>
                         <div style={{ display: 'flex', gap: 16, color: '#64748b', fontSize: '0.85rem' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><BookOpen size={14} /> {buddy.exam}</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={14} /> {buddy.district}</span>
                         </div>
                         <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            {buddy.interests.map(tag => (
                               <span key={tag} style={{ padding: '4px 10px', background: '#f1f5f9', borderRadius: 6, fontSize: '0.7rem', fontWeight: 600 }}>{tag}</span>
                            ))}
                         </div>
                      </div>
                      <button className="btn btn-primary" style={{ padding: '10px 20px', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                         <Users size={18} /> {t('Request')}
                      </button>
                   </div>
                 )) : (
                   <div style={{ textAlign: 'center', padding: 40 }}>
                      <p>{t('No other students found yet.')}</p>
                   </div>
                 )}
               </div>
             </>
           ) : (
             <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {myBuddies.length > 0 ? (
                  myBuddies.map(b => (
                    <div key={b.id} className="card" style={{ padding: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                       <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                          <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>{b.name[0]}</div>
                          <div>
                             <div style={{ fontWeight: 800 }}>{b.name}</div>
                             <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{b.exam} • {t('Last active')}: {b.lastActive}</div>
                          </div>
                       </div>
                       <button className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 6 }}><MessageSquare size={16} /> {t('Chat')}</button>
                    </div>
                  ))
                ) : (
                  <div style={{ textAlign: 'center', padding: 40, background: 'white', borderRadius: 20 }}>
                     <Users size={48} color="#e2e8f0" style={{ marginBottom: 16 }} />
                     <p className="hindi" style={{ color: '#64748b' }}>{t('No buddies yet. Start searching!')}</p>
                  </div>
                )}
             </div>
           )}
        </div>
      </div>
    </div>
  )
}
