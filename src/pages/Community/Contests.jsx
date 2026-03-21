import { useState } from 'react'
import { Trophy, Calendar, Award, Star, BookOpen, Camera, Zap, CheckCircle, ChevronRight, Share2 } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'

export default function Contests() {
  const { t } = useLanguage()

  const activeContests = [
    {
      id: 1,
      title: 'Monthly Essay Contest: Digital Jharkhand',
      type: 'Essay',
      prize: '₹500 + Certificate',
      deadline: 'Oct 31, 2024',
      participants: 145,
      icon: <BookOpen size={24} color="#FF6B35" />
    },
    {
      id: 2,
      title: 'Weekly Digital Quiz: Current Affairs',
      type: 'Quiz',
      prize: 'DVS Points + Badge',
      deadline: 'Every Sunday',
      participants: 840,
      icon: <Zap size={24} color="#1D4ED8" />
    },
    {
      id: 3,
      title: 'Photography: My Village Discovery',
      type: 'Photography',
      prize: 'Featured on Homepage',
      deadline: 'Nov 15, 2024',
      participants: 56,
      icon: <Camera size={24} color="#10B981" />
    }
  ]

  const winners = [
    { id: 10, name: 'Sadhana Kumari', contest: 'Essay Contest (Sept)', award: '1st Prize', village: 'Masalia' },
    { id: 11, name: 'Deepak Raj', contest: 'Quiz Week 42', award: 'Gold Winner', village: 'Dumka' }
  ]

  return (
    <div style={{ background: '#F9FAFB', minHeight: '100vh', paddingTop: 100 }}>
      <div className="container">
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 40 }}>
           
           <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
              <div>
                 <h1 className="hindi" style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: 12 }}>{t('Community Contests')} 🏆</h1>
                 <p className="hindi" style={{ color: '#64748b', fontSize: '1.2rem' }}>{t('Showcase your talent, compete with peers, and win exciting rewards.')}</p>
              </div>

              {/* Active Contests */}
              <div>
                 <h2 className="hindi" style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 24 }}>{t('Active Contests')}</h2>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    {activeContests.map(contest => (
                      <div key={contest.id} className="card" style={{ padding: 32, display: 'grid', gridTemplateColumns: '80px 1fr 180px', gap: 24, alignItems: 'center' }}>
                         <div style={{ width: 80, height: 80, borderRadius: 20, background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {contest.icon}
                         </div>
                         <div>
                            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>{t(contest.type)}</span>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#1e293b', marginTop: 4 }}>{contest.title}</h3>
                            <div style={{ display: 'flex', gap: 16, marginTop: 12, fontSize: '0.85rem', color: '#64748b' }}>
                               <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Calendar size={14} /> {t('Ends')}: {contest.deadline}</span>
                               <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Trophy size={14} /> {contest.prize}</span>
                            </div>
                         </div>
                         <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700, marginBottom: 12 }}>{contest.participants} {t('Participating')}</div>
                            <button className="btn btn-primary" style={{ width: '100%', borderRadius: 10 }}>{t('Enter Contest')}</button>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>

           {/* Sidebar */}
           <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div className="card" style={{ padding: 24, background: '#111827', color: 'white' }}>
                 <Trophy size={40} color="#FF6B35" style={{ marginBottom: 20 }} />
                 <h3 className="hindi" style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: 12 }}>{t('Hall of Winners')}</h3>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {winners.map(w => (
                      <div key={w.id} style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.05)', borderRadius: 12, borderLeft: '3px solid #FF6B35' }}>
                         <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>{w.name}</div>
                         <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{w.contest}</div>
                         <div style={{ marginTop: 6, color: '#FF6B35', fontWeight: 700, fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Award size={12} /> {w.award}
                         </div>
                      </div>
                    ))}
                 </div>
                 <button style={{ width: '100%', marginTop: 24, padding: '12px', background: 'white', color: '#111827', border: 'none', borderRadius: 10, fontWeight: 900, cursor: 'pointer' }}>{t('View All Past Winners')}</button>
              </div>

              <div className="card" style={{ padding: 24 }}>
                 <h4 className="hindi" style={{ fontWeight: 800, marginBottom: 12 }}>{t('How to Participate')}</h4>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {[
                      { step: 1, text: 'Select an active contest' },
                      { step: 2, text: 'Read requirements & rules' },
                      { step: 3, text: 'Submit your entry via the portal' },
                      { step: 4, text: 'Wait for admin verification' }
                    ].map(st => (
                      <div key={st.step} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                         <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 800 }}>{st.step}</div>
                         <p className="hindi" style={{ fontSize: '0.85rem', color: '#64748b' }}>{t(st.text)}</p>
                      </div>
                    ))}
                 </div>
              </div>
           </div>

        </div>

        {/* Global Leaderboard Section */}
        <div style={{ marginTop: 64, textAlign: 'center' }}>
           <h2 className="hindi" style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: 32 }}>{t('Monthly Leaderboard')} ⚡</h2>
           <div className="card" style={{ maxWidth: 800, margin: '0 auto', overflow: 'hidden', padding: 0 }}>
              <div style={{ background: '#f8fafc', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '0.85rem', color: '#64748b', textTransform: 'uppercase' }}>
                 <div style={{ flex: 1, textAlign: 'left' }}>{t('Rank & Name')}</div>
                 <div style={{ width: 100 }}>{t('Points')}</div>
                 <div style={{ width: 100 }}>{t('Trend')}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                 {[
                   { rank: 1, name: 'Sandeep Mahto', points: 4850, trend: 'up' },
                   { rank: 2, name: 'Anjali Bharti', points: 4200, trend: 'neutral' },
                   { rank: 3, name: 'Rahul Dev', points: 3950, trend: 'down' }
                 ].map(user => (
                   <div key={user.rank} style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9' }}>
                      <div style={{ flex: 1, textAlign: 'left', display: 'flex', alignItems: 'center', gap: 16 }}>
                         <span style={{ fontWeight: 900, color: user.rank === 1 ? '#FF6B35' : '#64748b', width: 24 }}>{user.rank}</span>
                         <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>{user.name[0]}</div>
                         <span style={{ fontWeight: 800 }}>{user.name}</span>
                      </div>
                      <div style={{ width: 100, fontWeight: 900 }}>{user.points.toLocaleString()}</div>
                      <div style={{ width: 100, color: user.trend === 'up' ? '#10b981' : user.trend === 'down' ? '#ef4444' : '#64748b', fontWeight: 800 }}>{user.trend === 'up' ? '▲' : user.trend === 'down' ? '▼' : '—'}</div>
                   </div>
                 ))}
              </div>
              <div style={{ padding: 20, background: '#f8fafc' }}>
                 <button style={{ color: '#FF6B35', fontWeight: 800, border: 'none', background: 'none', cursor: 'pointer' }}>{t('View Full Leaderboard')} →</button>
              </div>
           </div>
        </div>

      </div>
    </div>
  )
}
