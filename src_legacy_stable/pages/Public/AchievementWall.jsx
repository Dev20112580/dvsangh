import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { Star, MessageSquare, Share2, Award, Heart, Trophy } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'

export default function AchievementWall() {
  const { t } = useLanguage()
  
  const [achievements, setAchievements] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAchievements()
  }, [])

  async function fetchAchievements() {
    // Attempt to fetch from success_stories table
    const { data } = await supabase.from('success_stories').select('*').limit(6)
    setAchievements(data || [])
    setLoading(false)
  }

  return (
    <div className="section bg-gray" style={{ minHeight: '100vh', paddingTop: 120 }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
           <p className="hindi" style={{ color: '#FF6B35', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12 }}>{t('Wall of Honor')}</p>
           <h1 className="hindi" style={{ fontSize: '3.5rem', fontWeight: 900, color: '#111827', marginBottom: 24 }}>{t('Celebrating Our DVS Champions')} 🏆</h1>
           <p className="hindi" style={{ color: '#64748b', fontSize: '1.2rem', maxWidth: 700, margin: '0 auto' }}>
              {t('Every child from a rural village has the potential to lead. Here are the stories of those who dared to dream and conquered.')}
           </p>
        </div>

        {/* Featured Card */}
        {achievements.length > 0 ? (
          <div style={{ background: '#111827', borderRadius: 32, padding: 64, color: 'white', position: 'relative', overflow: 'hidden', marginBottom: 64, boxShadow: '0 30px 60px rgba(0,0,0,0.15)' }}>
             <div style={{ position: 'absolute', top: 0, right: 0, padding: 40, opacity: 0.1 }}>
                <Trophy size={300} />
             </div>
             
             <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 300px) 1fr', gap: 64, alignItems: 'center', position: 'relative', zIndex: 1 }}>
                <div style={{ position: 'relative' }}>
                   <div style={{ width: '100%', height: 350, borderRadius: 24, overflow: 'hidden', border: '4px solid #FF6B35' }}>
                      <img src={achievements[0].image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                   </div>
                   <div style={{ position: 'absolute', bottom: -20, left: '50%', transform: 'translateX(-50%)', background: '#FF6B35', padding: '10px 24px', borderRadius: 12, fontWeight: 900, whiteSpace: 'nowrap', boxShadow: '0 10px 20px rgba(255,107,53,0.3)' }}>
                      {t('STUDENT OF THE WEEK')}
                   </div>
                </div>
                <div>
                   <Award size={48} color="#FF6B35" style={{ marginBottom: 24 }} />
                   <h2 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: 16 }}>{achievements[0].name}</h2>
                   <p style={{ fontSize: '1.2rem', color: '#FF6B35', fontWeight: 700, marginBottom: 24 }}>{achievements[0].village}, Jharkhand</p>
                   <p style={{ fontSize: '1.5rem', fontStyle: 'italic', color: '#e2e8f0', lineHeight: 1.6, marginBottom: 32, borderLeft: '4px solid #FF6B35', paddingLeft: 24 }}>
                      "{achievements[0].quote}"
                   </p>
                   <div style={{ display: 'flex', gap: 16 }}>
                      <button className="btn btn-primary">{t('Full Story')}</button>
                      <button className="btn btn-secondary" style={{ borderColor: 'white', color: 'white' }}><Share2 size={18} /> {t('Share Achievement')}</button>
                   </div>
                </div>
             </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: 100, background: '#f8fafc', borderRadius: 32, marginBottom: 64 }}>
            <Award size={64} color="#94a3b8" style={{ marginBottom: 24, opacity: 0.5 }} />
            <h3 style={{ color: '#64748b' }}>{t('Our wall of honor is waiting for its first champions.')}</h3>
          </div>
        )}

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 32 }}>
           {achievements.map(student => (
             <div key={student.id} style={{ background: 'white', borderRadius: 24, padding: 32, border: '1px solid #e2e8f0', transition: 'all 0.3s' }} className="hover-up">
                <div style={{ display: 'flex', gap: 20, marginBottom: 24 }}>
                   <img src={student.image} style={{ width: 80, height: 80, borderRadius: 20, objectFit: 'cover' }} alt="" />
                   <div>
                      <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827' }}>{student.name}</h4>
                      <p style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600 }}>{student.village}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4, color: '#FF6B35', fontSize: '0.75rem', fontWeight: 800 }}>
                         <Star size={14} fill="#FF6B35" /> {student.award}
                      </div>
                   </div>
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 850, color: '#1e293b', marginBottom: 12 }}>{student.achievement}</h3>
                <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: 24 }}>"{student.quote}"</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: 20 }}>
                   <div style={{ display: 'flex', gap: 12 }}>
                      <button style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: 4, color: '#64748b', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}><Heart size={16} /> 24</button>
                      <button style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: 4, color: '#64748b', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}><MessageSquare size={16} /> 5</button>
                   </div>
                   <button style={{ color: '#FF6B35', border: 'none', background: 'none', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer' }}>{t('Read More')} →</button>
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  )
}
