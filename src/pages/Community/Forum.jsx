import { useState, useEffect } from 'react'
import { MessageSquare, ThumbsUp, CheckCircle, Search, Filter, Plus, Users, Award, X } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'

export default function Forum() {
  const { t } = useLanguage()
  const { user, profile } = useAuth()
  const [activeTab, setActiveTab] = useState('all')
  const [search, setSearch] = useState('')
  const [threads, setThreads] = useState([])
  const [loading, setLoading] = useState(true)
  const [showNewModal, setShowNewModal] = useState(false)
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'General' })
  const [stats, setStats] = useState({ totalPosts: 0, points: 0 })

  useEffect(() => {
    fetchThreads()
    fetchStats()
  }, [activeTab])

  async function fetchThreads() {
    setLoading(true)
    let query = supabase.from('forum_posts').select('*').order('created_at', { ascending: false })
    if (activeTab !== 'all') {
      query = query.eq('category', activeTab)
    }
    const { data } = await query
    setThreads(data || [])
    setLoading(false)
  }

  async function fetchStats() {
    const { count } = await supabase.from('forum_posts').select('*', { count: 'exact', head: true })
    const { data: pointsData } = await supabase
      .from('gamification_points')
      .select('points')
      .eq('user_id', user?.id)
    
    const totalPoints = pointsData?.reduce((acc, curr) => acc + curr.points, 0) || 0
    setStats({ totalPosts: count || 0, points: totalPoints })
  }

  async function handleCreatePost(e) {
    e.preventDefault()
    if (!user) return alert(t('Please log in to post'))
    
    // 1. Create the post
    const { error } = await supabase.from('forum_posts').insert([{
      ...newPost,
      user_id: user.id,
      author_name: profile?.full_name || user.email.split('@')[0],
      author_role: profile?.role || 'Member'
    }])

    if (error) {
      alert(error.message)
    } else {
      // 2. Award 10 points for participating
      await supabase.from('gamification_points').insert([{
        user_id: user.id,
        points: 10,
        reason: 'Forum Post Creation'
      }])
      
      setShowNewModal(false)
      setNewPost({ title: '', content: '', category: 'General' })
      fetchThreads()
      fetchStats()
    }
  }

  async function handleLike(postId, currentLikes) {
    if (!user) return alert(t('Please log in to like posts'))
    
    // Increment likes
    const { error } = await supabase
      .from('forum_posts')
      .update({ likes_count: (currentLikes || 0) + 1 })
      .eq('id', postId)
    
    if (!error) {
      // Award 2 points to the author (if we had author_id in the row)
      // For now, refresh feed
      fetchThreads()
    }
  }

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40, borderBottom: '1px solid #f1f5f9', pb: 24 }}>
        <div>
           <h1 className="hindi" style={{ fontSize: '2.5rem', marginBottom: 12 }}>{t('Discussion Forum')} 💬</h1>
           <p className="hindi" style={{ color: 'var(--gray-500)', fontSize: '1.1rem' }}>{t('Connect with peers, share knowledge, and grow together.')}</p>
        </div>
        <button onClick={() => setShowNewModal(true)} className="btn btn-primary hindi" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
           <Plus size={20} /> {t('Start New Discussion')}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 40 }}>
        {/* Sidebar */}
        <aside>
          <div style={{ marginBottom: 32 }}>
             <h4 className="hindi" style={{ marginBottom: 16 }}>{t('Categories')}</h4>
             <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {['all', 'Exam Tips', 'General', 'Resources', 'Technical'].map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setActiveTab(cat)}
                    style={{ 
                      textAlign: 'left', padding: '12px 16px', borderRadius: 12, border: 'none',
                      background: activeTab === cat ? '#A1401D' : 'transparent',
                      color: activeTab === cat ? 'white' : 'var(--gray-600)',
                      fontWeight: activeTab === cat ? 700 : 500,
                      cursor: 'pointer', transition: 'all 0.2s'
                    }}
                  >
                    {t(cat.charAt(0).toUpperCase() + cat.slice(1))}
                  </button>
                ))}
             </div>
          </div>

          <div className="card" style={{ padding: 20, background: '#f8fafc', marginBottom: 16 }}>
             <h4 className="hindi" style={{ marginBottom: 16, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Award size={18} color="#FF6B35" /> {t('Your Reputation')}
             </h4>
             <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#FF6B35' }}>{stats.points.toLocaleString()}</div>
                <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>{t('Points Earned')}</div>
             </div>
             <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: 8 }}>{t('Accumulated through daily activity')}</p>
          </div>

          <div className="card" style={{ padding: 20, background: '#f8fafc' }}>
             <h4 className="hindi" style={{ marginBottom: 12, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Users size={18} color="#A1401D" /> {t('Forum Stats')}
             </h4>
             <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                   <span>{t('Total Threads')}</span>
                   <span style={{ fontWeight: 700 }}>{stats.totalPosts}</span>
                 </div>
                 <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span>{t('Active Members')}</span>
                    <span style={{ fontWeight: 700 }}>450+</span>
                 </div>
              </div>
           </div>
        </aside>

        {/* Main Feed */}
        <section>
          <div style={{ position: 'relative', marginBottom: 24 }}>
             <Search size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
             <input 
               className="form-control" 
               placeholder={t('Search discussions...')} 
               value={search} 
               onChange={e => setSearch(e.target.value)} 
               style={{ paddingLeft: 48, height: 56, borderRadius: 16 }} 
             />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>{t('Loading discussions...')}</div>
            ) : threads.length > 0 ? threads.filter(th => th.title.toLowerCase().includes(search.toLowerCase())).map(th => (
              <div key={th.id} style={{ background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(20px)', borderRadius: 24, padding: 32, border: '1px solid rgba(255, 255, 255, 0.3)', boxShadow: '0 8px 32px rgba(0,0,0,0.03)', cursor: 'pointer', transition: 'all 0.3s' }} onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = '#FF6B35'; }}>
                <div style={{ display: 'flex', gap: 24 }}>
                  <div style={{ textAlign: 'center', minWidth: 64, background: '#f8fafc', borderRadius: 16, padding: '12px 8px', height: 'fit-content' }}>
                     <button 
                       onClick={(e) => { e.stopPropagation(); handleLike(th.id, th.likes_count) }}
                       style={{ background: 'none', border: 'none', cursor: 'pointer', color: (th.likes_count || 0) > 50 ? '#FF6B35' : '#94a3b8' }}
                     >
                       <ThumbsUp size={22} fill={(th.likes_count || 0) > 50 ? '#FF6B35' : 'none'} />
                     </button>
                     <div style={{ fontWeight: 900, fontSize: '1.2rem', marginTop: 4, color: '#1e293b' }}>{th.likes_count || 0}</div>
                  </div>
                  <div style={{ flex: 1 }}>
                     <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
                        <span style={{ padding: '4px 12px', borderRadius: 8, background: '#FF6B3515', color: '#FF6B35', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase' }}>{t(th.category)}</span>
                        {th.is_solved && <span style={{ padding: '4px 12px', borderRadius: 8, background: '#10b98115', color: '#10b981', fontSize: '0.7rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 4 }}>✓ {t('Solved')}</span>}
                     </div>
                     <h3 className="hindi" style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1e293b', marginBottom: 12, lineHeight: 1.4 }}>{th.title}</h3>
                     <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: '0.85rem', color: '#64748b' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                           <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', fontWeight: 800 }}>{th.author_name?.[0] || '?'}</div>
                           <span style={{ fontWeight: 700, color: '#475569' }}>{th.author_name}</span>
                        </div>
                        <span>•</span>
                        <span>{new Date(th.created_at).toLocaleDateString()}</span>
                        <span>•</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><MessageSquare size={16} /> {th.replies_count || 0} {t('Replies')}</span>
                     </div>
                  </div>
                </div>
              </div>
            )) : (
              <div style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>{t('No discussions found in this category.')}</div>
            )}
          </div>
        </section>
      </div>

      {showNewModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: 'white', width: '100%', maxWidth: 600, borderRadius: 24, padding: 40, position: 'relative' }}>
             <button onClick={() => setShowNewModal(false)} style={{ position: 'absolute', right: 24, top: 24, background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}><X size={24} /></button>
             <h2 className="hindi" style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: 8 }}>{t('Start New Discussion')}</h2>
             <p className="hindi" style={{ color: '#64748b', marginBottom: 32 }}>{t('Share your question or resource with the DVS community.')}</p>
             
             <form onSubmit={handleCreatePost} style={{ display: 'grid', gap: 20 }}>
                <div>
                  <label className="hindi" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', marginBottom: 8 }}>{t('Category')}</label>
                  <select 
                    value={newPost.category} 
                    onChange={e => setNewPost({...newPost, category: e.target.value})}
                    style={{ width: '100%', padding: '12px', borderRadius: 10, border: '1px solid #e2e8f0' }}
                  >
                    {['General', 'Exam Tips', 'Resources', 'Technical'].map(c => <option key={c} value={c}>{t(c)}</option>)}
                  </select>
                </div>
                <div>
                  <label className="hindi" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', marginBottom: 8 }}>{t('Discussion Title')}</label>
                  <input 
                    required
                    value={newPost.title}
                    onChange={e => setNewPost({...newPost, title: e.target.value})}
                    placeholder={t('e.g. UPSC preparation books...')} 
                    style={{ width: '100%', padding: '14px', borderRadius: 12, border: '1px solid #e2e8f0' }} 
                  />
                </div>
                <div>
                  <label className="hindi" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', marginBottom: 8 }}>{t('Content')}</label>
                  <textarea 
                    required
                    value={newPost.content}
                    onChange={e => setNewPost({...newPost, content: e.target.value})}
                    placeholder={t('Detail your question or message...')} 
                    style={{ width: '100%', minHeight: 150, padding: 16, borderRadius: 12, border: '1px solid #e2e8f0', resize: 'none' }} 
                  />
                </div>
                <button type="submit" style={{ width: '100%', padding: '16px', borderRadius: 12, border: 'none', background: '#FF6B35', color: 'white', fontWeight: 800, marginTop: 12, cursor: 'pointer' }}>
                   {t('Post Discussion')}
                </button>
             </form>
          </div>
        </div>
      )}
    </div>
  )
}
