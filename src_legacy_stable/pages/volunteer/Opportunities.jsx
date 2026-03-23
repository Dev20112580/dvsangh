import { useState } from 'react'
import { 
  Briefcase, Search, Filter, MapPin, Clock, 
  ChevronRight, Sparkles, Star, Users, CheckCircle
} from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'

export default function VolunteerOpportunities() {
  const { t } = useLanguage()
  const [searchTerm, setSearchTerm] = useState('')

  const opportunities = [
    { 
      id: 1, 
      title: t('Teaching Assistant'), 
      category: 'Education', 
      location: 'Rural Ranchi / Remote', 
      time: '5 hrs/week', 
      desc: 'Help students with basic Maths and English via our digital platform.',
      tags: ['Online', 'Flexible']
    },
    { 
      id: 2, 
      title: t('Content Creator'), 
      category: 'Marketing', 
      location: 'Remote', 
      time: '3 hrs/week', 
      desc: 'Create inspiring success stories and social media content for DVS.',
      tags: ['Creative', 'Writing']
    },
    { 
      id: 3, 
      title: t('Event Coordinator'), 
      category: 'Management', 
      location: 'On-site (Jharkhand)', 
      time: 'Weekend Prep', 
      desc: 'Coordinate local workshops and community outreach programs.',
      tags: ['Leadership', 'Social']
    }
  ]

  return (
    <div style={{ padding: '32px' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 40 }}>
        <div style={{ maxWidth: 600 }}>
          <h1 className="hindi" style={{ fontSize: '2rem', fontWeight: 800, color: '#111' }}>{t('Volunteer Opportunities')}</h1>
          <p className="hindi" style={{ color: '#64748b', marginTop: 8, fontSize: '0.95rem' }}>{t('Explore and apply for teaching, mentoring, and administrative roles.')}</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
           <div style={{ position: 'relative' }}>
             <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)' }} />
             <input className="hindi" placeholder={t('Search roles...')} style={{ padding: '12px 16px 12px 48px', borderRadius: 10, border: '1px solid #e2e8f0', width: 260, fontSize: '0.9rem', outline: 'none' }} />
           </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 24 }}>
        {opportunities.map(op => (
          <div key={op.id} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 20, padding: '32px', transition: 'all 0.3s', cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.06)'} onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
               <div style={{ background: '#f8fafc', padding: '10px', borderRadius: 12, color: '#1d4ed8' }}><Briefcase size={24} /></div>
               <div style={{ display: 'flex', gap: 6 }}>
                  {op.tags.map(tag => (
                    <span key={tag} style={{ padding: '4px 10px', background: '#eff6ff', color: '#1d4ed8', fontSize: '0.65rem', fontWeight: 800, borderRadius: 20, textTransform: 'uppercase' }}>{tag}</span>
                  ))}
               </div>
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e293b', marginBottom: 12 }}>{op.title}</h3>
            <p className="hindi" style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.6, marginBottom: 24 }}>{t(op.desc)}</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 32 }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <MapPin size={16} color="#94a3b8" />
                  <span style={{ fontSize: '0.8rem', color: '#4b5563', fontWeight: 600 }}>{op.location}</span>
               </div>
               <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Clock size={16} color="#94a3b8" />
                  <span style={{ fontSize: '0.8rem', color: '#4b5563', fontWeight: 600 }}>{op.time}</span>
               </div>
            </div>

            <button className="hindi" style={{ width: '100%', padding: '14px', borderRadius: 12, background: '#111', color: 'white', fontWeight: 700, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
              {t('Apply for Role')} <ChevronRight size={18} />
            </button>
          </div>
        ))}

        <div style={{ background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)', borderRadius: 20, padding: '32px', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
           <div style={{ width: 64, height: 64, background: 'rgba(255,255,255,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}><Sparkles size={32} /></div>
           <h3 className="hindi" style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: 12 }}>{t('Custom Expertise?')}</h3>
           <p className="hindi" style={{ fontSize: '0.85rem', opacity: 0.9, lineHeight: 1.6, marginBottom: 24 }}>{t('If you have specific skills not listed here, we would love to hear from you!')}</p>
           <button className="hindi" style={{ padding: '12px 24px', borderRadius: 10, background: 'white', color: '#1d4ed8', fontWeight: 800, border: 'none', cursor: 'pointer', fontSize: '0.85rem' }}>{t('Propose a Role')}</button>
        </div>
      </div>

    </div>
  )
}
