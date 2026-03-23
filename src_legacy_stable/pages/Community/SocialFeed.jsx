import { useState } from 'react'
import { Heart, MessageCircle, Share2, MoreHorizontal, Image as ImageIcon, Video, MapPin, Send } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'

export default function SocialFeed() {
  const { t } = useLanguage()
  const [posts, setPosts] = useState([
    {
      id: 1,
      user: { name: 'Vikram Mahto', role: 'Volunteer', avatar: 'https://i.pravatar.cc/150?u=vikram' },
      content: 'Just finished distributing study kits in Masalia village. The smiles on kids\' faces are priceless! ❤️ 📚',
      image: '/images/news-community.png',
      likes: 42,
      comments: 12,
      time: '2 hours ago',
      location: 'Masalia, Dumka'
    },
    {
      id: 2,
      user: { name: 'Kavita Das', role: 'Student', avatar: 'https://i.pravatar.cc/150?u=kavita' },
      content: 'Finally completed my first month of Digital Literacy training! Thank you DVS and Guru Bot for constant support. 💻 ✨',
      likes: 35,
      comments: 8,
      time: '5 hours ago',
      location: 'Dumka DVS Hub'
    }
  ])

  return (
    <div style={{ background: '#F9FAFB', minHeight: '100vh', paddingTop: 32 }}>
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '0 16px' }}>
        
        {/* Create Post */}
        <div style={{ background: 'white', borderRadius: 24, padding: 24, marginBottom: 24, boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
           <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#ff6b3515', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FF6B35', fontWeight: 800 }}>U</div>
              <input 
                placeholder={t('Share your study milestone or volunteer story...')}
                style={{ flex: 1, border: 'none', background: '#f8fafc', borderRadius: 12, padding: '0 20px', fontSize: '0.95rem', outline: 'none' }}
              />
           </div>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: 16 }}>
              <div style={{ display: 'flex', gap: 16 }}>
                 <button style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: 8, color: '#64748b', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}><ImageIcon size={18} color="#FF6B35" /> {t('Photo')}</button>
                 <button style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: 8, color: '#64748b', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}><Video size={18} color="#1D4ED8" /> {t('Video')}</button>
                 <button style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: 8, color: '#64748b', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}><MapPin size={18} color="#10B981" /> {t('Location')}</button>
              </div>
              <button className="btn btn-primary" style={{ padding: '8px 24px', borderRadius: 10 }}>{t('Post')}</button>
           </div>
        </div>

        {/* Feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
           {posts.map(post => (
             <div key={post.id} style={{ background: 'white', borderRadius: 24, padding: 0, overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                {/* Header */}
                <div style={{ padding: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                   <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                      <img 
                        src={post.user.avatar} 
                        width="44" 
                        height="44" 
                        style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover' }} 
                        alt={post.user.name} 
                        loading="lazy"
                      />
                      <div>
                         <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1e293b' }}>{post.user.name}</h4>
                         <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
                            <span style={{ color: post.user.role === 'Volunteer' ? '#FF6B35' : '#1D4ED8' }}>{t(post.user.role)}</span>
                            <span>•</span>
                            <span>{post.time}</span>
                         </div>
                      </div>
                   </div>
                   <button style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><MoreHorizontal size={20} /></button>
                </div>

                {/* Content */}
                <div style={{ padding: '0 24px 16px', fontSize: '1rem', color: '#334155', lineHeight: 1.6 }}>
                   {post.content}
                </div>

                {/* Image if any */}
                {post.image && (
                  <div style={{ width: '100%', maxHeight: 400, overflow: 'hidden' }}>
                     <img 
                       src={post.image} 
                       width="640" 
                       height="400" 
                       style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                       alt="Post content" 
                       loading="lazy" 
                     />
                  </div>
                )}

                {/* Location */}
                {post.location && (
                  <div style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: '#64748b', borderBottom: '1px solid #f8fafc' }}>
                     <MapPin size={14} /> {post.location}
                  </div>
                )}

                {/* Footer Actions */}
                <div style={{ padding: 16, display: 'flex', gap: 24, justifyContent: 'center', borderTop: '1px solid #f1f5f9' }}>
                   <button style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: 8, color: '#64748b', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer' }}><Heart size={20} /> {post.likes}</button>
                   <button style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: 8, color: '#64748b', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer' }}><MessageCircle size={20} /> {post.comments}</button>
                   <button style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: 8, color: '#64748b', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer' }}><Share2 size={20} /> {t('Share')}</button>
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  )
}
