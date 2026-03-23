import { useState } from 'react'
import { 
  Users, MessageSquare, BookOpen, Video, Plus, 
  Search, Filter, ChevronRight, Lock, Bell, Star
} from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'

export default function StudyGroups() {
  const { t } = useLanguage()

  const groups = [
    { id: 1, name: 'UPSC 2024 - Jharkhand Batch', members: 45, activity: '2h ago', type: 'PSC', target: 'UPSC 2024' },
    { id: 2, name: 'SSC CGL Math Focus', members: 82, activity: '5m ago', type: 'General', target: 'SSC CGL' },
    { id: 3, name: 'JPSC Prelims Strategy', members: 28, activity: 'Just Now', type: 'PSC', target: 'JPSC Prelims' },
    { id: 4, name: 'Basic English Grammar', members: 156, activity: '1h ago', type: 'Language', target: 'All Exams' }
  ]

  return (
    <div style={{ padding: '32px' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 40 }}>
        <div>
           <h1 className="hindi" style={{ fontSize: '2rem', fontWeight: 800 }}>{t('Study Groups')}</h1>
           <p className="hindi" style={{ color: '#64748b', marginTop: 8 }}>{t('Join peer groups for UPSC, SSC, and JPSC preparation. Learn and grow together.')}</p>
        </div>
        <button style={{ padding: '12px 24px', background: '#111', color: 'white', border: 'none', borderRadius: 10, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
           <Plus size={18} /> {t('Create Group')}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
        {groups.map(group => (
          <div key={group.id} style={{ background: 'white', borderRadius: 20, border: '1px solid #e2e8f0', padding: 24, transition: 'all 0.3s', cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.borderColor = '#1d4ed8'}>
             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <div style={{ width: 48, height: 48, background: '#f8fafc', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1d4ed8' }}>
                   <Users size={24} />
                </div>
                <div style={{ padding: '4px 10px', background: '#eff6ff', color: '#1d4ed8', fontSize: '0.65rem', fontWeight: 800, borderRadius: 20 }}>{group.type}</div>
             </div>

             <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1e293b', marginBottom: 8 }}>{group.name}</h3>
             <div style={{ fontSize: '0.75rem', color: '#1d4ed8', fontWeight: 700, marginBottom: 12 }}>{t('Target')}: {t(group.target)}</div>
             <div style={{ display: 'flex', gap: 16, fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Users size={14} /> {group.members} {t('Members')}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Bell size={14} /> {t(group.activity)}</span>
             </div>

             <div style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: 20 }}>
                <div style={{ display: 'flex', marginLeft: -8 }}>
                   {[1, 2, 3].map(i => (
                     <div key={i} style={{ width: 28, height: 28, borderRadius: '50%', background: '#e2e8f0', border: '2px solid white', marginLeft: -8 }}></div>
                   ))}
                </div>
                <button className="hindi" style={{ background: 'none', border: 'none', color: '#1d4ed8', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                   {t('Join Discussion')} <ChevronRight size={16} />
                </button>
             </div>
          </div>
        ))}
      </div>

    </div>
  )
}
