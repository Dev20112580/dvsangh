import { useState } from 'react'
import { FileText, Save, History, Share2, Users, Lock, Eye, Edit3, MessageSquare, Plus, ChevronRight } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'

export default function CollaborativeNotes() {
  const { t } = useLanguage()
  const [activeNote, setActiveNote] = useState(1)
  const [content, setContent] = useState(`## Mughal Empire - Key Administrative Features

1. **Mansabdari System**: Introduced by Akbar. It was a grading system used by the Mughals to fix rank and salary.
2. **Land Revenue**: Todar Mal's Bandobast (Zabt System).
3. **Architecture**: Synthesis of Persian and Indian styles.

*Note: Please add details about Aurangzeb's Deccan Policy.*`)

  const notes = [
    { id: 1, title: 'History: Mughal Administration', category: 'UPSC', lastEdit: '10 mins ago', author: 'Amit K.' },
    { id: 2, title: 'Physics: Thermodynamics', category: 'Class 12', lastEdit: '2 hours ago', author: 'Sneha S.' },
    { id: 3, title: 'Current Affairs: Oct 2024', category: 'General', lastEdit: 'Yesterday', author: 'Team DVS' }
  ]

  const history = [
    { user: 'Sneha S.', action: 'Added points on Architecture', time: '10:45 AM' },
    { user: 'Amit K.', action: 'Initial draft created', time: '09:12 AM' }
  ]

  return (
    <div style={{ background: '#F8FAF8', minHeight: '100vh', paddingTop: 100 }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr 280px', gap: 24, height: 'calc(100vh - 140px)' }}>
          
          {/* Left: Notes List */}
          <div className="card" style={{ padding: 20, display: 'flex', flexDirection: 'column' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h3 className="hindi" style={{ fontSize: '1.1rem', fontWeight: 800 }}>{t('My Notes')}</h3>
                <button style={{ background: 'none', border: 'none', color: '#FF6B35' }}><Plus size={20} /></button>
             </div>
             <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {notes.map(note => (
                  <div 
                    key={note.id} 
                    onClick={() => setActiveNote(note.id)}
                    style={{ 
                      padding: 12, borderRadius: 12, cursor: 'pointer', border: '1px solid',
                      borderColor: activeNote === note.id ? '#FF6B35' : 'transparent',
                      background: activeNote === note.id ? '#fff' : '#f8fafc',
                      transition: 'all 0.2s'
                    }}
                  >
                     <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e293b', marginBottom: 4 }}>{note.title}</div>
                     <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: '#64748b' }}>
                        <span>{note.category}</span>
                        <span>{note.lastEdit}</span>
                     </div>
                  </div>
                ))}
             </div>
             
             <div style={{ marginTop: 'auto', padding: 16, background: '#eff6ff', borderRadius: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#1d4ed8', fontWeight: 700, fontSize: '0.8rem', marginBottom: 4 }}>
                   <Users size={16} /> {t('Community Power')}
                </div>
                <p style={{ fontSize: '0.7rem', color: '#1e40af' }}>{t('The best notes are featured in the DVS Materials Library!')}</p>
             </div>
          </div>

          {/* Middle: Editor */}
          <div className="card" style={{ padding: 0, display: 'flex', flexDirection: 'column' }}>
             <div style={{ padding: '16px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: 16, color: '#64748b' }}>
                   <Edit3 size={18} /> <Eye size={18} /> <Share2 size={18} />
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                   <span style={{ fontSize: '0.75rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <CheckCircle size={14} /> {t('Saved to DVS Cloud')}
                   </span>
                   <button className="btn btn-primary btn-sm"><Save size={16} /> {t('Save')}</button>
                </div>
             </div>
             <textarea 
               value={content}
               onChange={e => setContent(e.target.value)}
               className="hindi"
               style={{ 
                 flex: 1, padding: 32, border: 'none', outline: 'none', resize: 'none', 
                 fontSize: '1.1rem', lineHeight: 1.8, color: '#334155', fontFamily: 'monospace'
               }}
             />
          </div>

          {/* Right: Activity & Collaborators */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
             <div className="card" style={{ padding: 20 }}>
                <h4 className="hindi" style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                   <History size={16} /> {t('Version History')}
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                   {history.map((h, i) => (
                     <div key={i} style={{ position: 'relative', paddingLeft: 20 }}>
                        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 2, background: '#e2e8f0' }}></div>
                        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1e293b' }}>{h.user}</div>
                        <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{h.action}</div>
                        <div style={{ fontSize: '0.6rem', color: '#94a3b8', marginTop: 4 }}>{h.time}</div>
                     </div>
                   ))}
                </div>
             </div>

             <div className="card" style={{ padding: 20 }}>
                <h4 className="hindi" style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: 16 }}>{t('Active Collaborators')}</h4>
                <div style={{ display: 'flex', gap: -8 }}>
                   {['AS', 'MK', 'RP'].map((u, i) => (
                     <div key={i} style={{ 
                       width: 32, height: 32, borderRadius: '50%', background: '#ff6b35', color: 'white', 
                       border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                       fontSize: '0.7rem', fontWeight: 800, marginLeft: i > 0 ? -8 : 0
                     }}>{u}</div>
                   ))}
                </div>
                <button className="hindi" style={{ width: '100%', marginTop: 24, padding: '10px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: '0.8rem', fontWeight: 700, color: '#1d4ed8', cursor: 'pointer' }}>
                   {t('Invite Classmates')}
                </button>
             </div>
          </div>

        </div>
      </div>
    </div>
  )
}
