import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Trophy, Medal, Star, TrendingUp, Users, Search, Crown } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'

export default function Leaderboard() {
  const { t } = useLanguage()
  const [leaders, setLeaders] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('alltime')

  useEffect(() => {
    fetchLeaders()
  }, [activeTab])

  async function fetchLeaders() {
    setLoading(true)
    const { data } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url, total_points, current_level, district')
      .order('total_points', { ascending: false })
      .limit(20)
    
    setLeaders(data || [])
    setLoading(false)
  }

  const topThree = leaders.slice(0, 3)
  const rest = leaders.slice(3)

  return (
    <div style={{ maxWidth: 900, margin: '40px auto', padding: '0 24px' }}>
      <div style={{ textAlign: 'center', marginBottom: 60 }}>
        <h1 className="hindi" style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: 12 }}>
          {t('DVS Champions')} <Trophy color="#FFB800" size={40} style={{ verticalAlign: 'middle' }} />
        </h1>
        <p className="hindi" style={{ color: '#64748b', fontSize: '1.1rem' }}>{t('Celebrating our most active students and community members.')}</p>
      </div>

      {/* Podium for Top 3 */}
      {!loading && topThree.length > 0 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 20, marginBottom: 60, flexWrap: 'wrap' }}>
          
          {/* 2nd Place */}
          {topThree[1] && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 200, animation: 'fadeInUp 0.6s ease-out 0.2s both' }}>
              <div style={{ position: 'relative', marginBottom: 16 }}>
                <img 
                  src={topThree[1].avatar_url || `https://ui-avatars.com/api/?name=${topThree[1].full_name}&background=random`} 
                  width="80" 
                  height="80" 
                  alt={topThree[1].full_name} 
                  style={{ width: 80, height: 80, borderRadius: '50%', border: '4px solid #e2e8f0', objectFit: 'cover' }} 
                  loading="eager"
                />
                <div style={{ position: 'absolute', bottom: -5, right: -5, background: '#e2e8f0', width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.8rem' }}>2</div>
              </div>
              <div style={{ height: 100, width: '100%', background: 'linear-gradient(to top, #f1f5f9, #ffffff)', borderRadius: '16px 16px 0 0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '1px solid #e2e8f0', borderBottom: 'none', padding: '0 12px' }}>
                <div style={{ fontWeight: 800, fontSize: '0.9rem', textAlign: 'center' }}>{topThree[1].full_name}</div>
                <div style={{ color: '#FF6B35', fontWeight: 900 }}>{topThree[1].total_points}</div>
              </div>
            </div>
          )}

          {/* 1st Place */}
          {topThree[0] && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 240, animation: 'fadeInUp 0.8s ease-out' }}>
              <Crown color="#FFB800" fill="#FFB800" size={32} style={{ marginBottom: 4 }} />
              <div style={{ position: 'relative', marginBottom: 16 }}>
                <img 
                  src={topThree[0].avatar_url || `https://ui-avatars.com/api/?name=${topThree[0].full_name}&background=random`} 
                  width="110" 
                  height="110" 
                  alt={topThree[0].full_name} 
                  style={{ width: 110, height: 110, borderRadius: '50%', border: '6px solid #FFD700', objectFit: 'cover', boxShadow: '0 10px 30px rgba(255, 215, 0, 0.3)' }} 
                  loading="eager"
                />
                <div style={{ position: 'absolute', bottom: -5, right: -5, background: '#FFD700', width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: 'white', fontSize: '1.2rem', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>1</div>
              </div>
              <div style={{ height: 140, width: '100%', background: 'linear-gradient(to top, #FFFDE7, #ffffff)', borderRadius: '24px 24px 0 0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '2px solid #FFD700', borderBottom: 'none', padding: '0 12px' }}>
                <div style={{ fontWeight: 900, fontSize: '1.1rem', textAlign: 'center' }}>{topThree[0].full_name}</div>
                <div style={{ color: '#FF6B35', fontWeight: 900, fontSize: '1.25rem' }}>{topThree[0].total_points}</div>
              </div>
            </div>
          )}

          {/* 3rd Place */}
          {topThree[2] && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 200, animation: 'fadeInUp 0.6s ease-out 0.4s both' }}>
              <div style={{ position: 'relative', marginBottom: 16 }}>
                <img 
                  src={topThree[2].avatar_url || `https://ui-avatars.com/api/?name=${topThree[2].full_name}&background=random`} 
                  width="80" 
                  height="80" 
                  alt={topThree[2].full_name} 
                  style={{ width: 80, height: 80, borderRadius: '50%', border: '4px solid #cd7f32', objectFit: 'cover' }} 
                  loading="eager"
                />
                <div style={{ position: 'absolute', bottom: -5, right: -5, background: '#cd7f32', width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: 'white', fontSize: '0.8rem' }}>3</div>
              </div>
              <div style={{ height: 80, width: '100%', background: 'linear-gradient(to top, #FFF8E1, #ffffff)', borderRadius: '16px 16px 0 0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '1px solid #cd7f32', borderBottom: 'none', padding: '0 12px' }}>
                <div style={{ fontWeight: 800, fontSize: '0.9rem', textAlign: 'center' }}>{topThree[2].full_name}</div>
                <div style={{ color: '#FF6B35', fontWeight: 900 }}>{topThree[2].total_points}</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* List for the rest */}
      <div style={{ background: 'white', borderRadius: 24, padding: 32, boxShadow: '0 10px 40px rgba(0,0,0,0.03)', border: '1px solid #f1f5f9' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
           <h3 className="hindi" style={{ fontSize: '1.25rem', fontWeight: 800 }}>{t('Leaderboard Rankings')}</h3>
           <div style={{ display: 'flex', background: '#f8fafc', padding: 6, borderRadius: 12 }}>
              <button onClick={() => setActiveTab('monthly')} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: activeTab === 'monthly' ? 'white' : 'transparent', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', boxShadow: activeTab === 'monthly' ? '0 4px 10px rgba(0,0,0,0.05)' : 'none' }}>{t('Monthly')}</button>
              <button onClick={() => setActiveTab('alltime')} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: activeTab === 'alltime' ? 'white' : 'transparent', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', boxShadow: activeTab === 'alltime' ? '0 4px 10px rgba(0,0,0,0.05)' : 'none' }}>{t('All-time')}</button>
           </div>
        </div>

        {loading ? (
          <div style={{ padding: 40, textAlign: 'center' }}>Loading...</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {rest.map((m, i) => (
              <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '16px 24px', borderRadius: 16, border: '1px solid #f1f5f9', background: '#ffffff', transition: 'all 0.2s' }}>
                <span style={{ fontWeight: 900, color: '#94a3b8', width: 30, fontSize: '1.1rem' }}>{i + 4}</span>
                <img 
                  src={m.avatar_url || `https://ui-avatars.com/api/?name=${m.full_name}&background=random`} 
                  width="44" 
                  height="44" 
                  alt={m.full_name} 
                  style={{ width: 44, height: 44, borderRadius: '50%' }} 
                  loading="lazy"
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, color: '#111' }}>{m.full_name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{m.district || 'Jharkhand'} • {m.current_level || 'Elite'}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 900, color: '#FF6B35', fontSize: '1.1rem' }}>{m.total_points}</div>
                  <div style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 800 }}>PTS</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
