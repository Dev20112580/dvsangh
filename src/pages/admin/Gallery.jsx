import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import AdminLayout from '../../components/admin/AdminLayout'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/LanguageContext'
import { 
  Plus, Search, Image as ImageIcon, Trash2, 
  Grid, List, Upload, Eye, Edit3
} from 'lucide-react'

export default function AdminGallery() {
  const { profile } = useAuth()
  const { t, language } = useLanguage()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState('grid')

  async function fetchGallery() {
    setLoading(true)
    const { data: res, error } = await supabase
      .from('gallery')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) console.error('Error fetching gallery:', error)
    else setData(res || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchGallery()
  }, [])

  return (
    <AdminLayout title={t("Gallery Management")} adminInfo={profile}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
        <div>
           <h1 className="hindi" style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111', marginBottom: 8 }}>{t('Gallery Management')}</h1>
           <p className="hindi" style={{ color: '#6b7280', fontSize: '0.9rem' }}>{t('Manage event photos, achievement banners, and community stories.')}</p>
        </div>
        <button className="btn btn-primary">
           <Plus size={18} /> {t('Upload Photos')}
        </button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, background: 'white', padding: 16, borderRadius: 12, border: '1px solid #e2e8f0' }}>
         <div style={{ position: 'relative', width: 300 }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input placeholder={t('Search gallery...')} style={{ width: '100%', padding: '8px 10px 8px 36px', borderRadius: 8, border: '1px solid #e2e8f0', outline: 'none', fontSize: '0.85rem' }} />
         </div>
         <div style={{ display: 'flex', background: '#f8fafc', padding: 4, borderRadius: 8 }}>
            <button onClick={() => setViewMode('grid')} style={{ padding: 8, background: viewMode === 'grid' ? 'white' : 'transparent', border: 'none', borderRadius: 6, cursor: 'pointer', boxShadow: viewMode === 'grid' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none', color: viewMode === 'grid' ? '#C94E1A' : '#64748b' }}><Grid size={18} /></button>
            <button onClick={() => setViewMode('list')} style={{ padding: 8, background: viewMode === 'list' ? 'white' : 'transparent', border: 'none', borderRadius: 6, cursor: 'pointer', boxShadow: viewMode === 'list' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none', color: viewMode === 'list' ? '#C94E1A' : '#64748b' }}><List size={18} /></button>
         </div>
      </div>

      {loading ? (
        <div style={{ padding: 100, textAlign: 'center' }}>Syncing Library...</div>
      ) : data.length === 0 ? (
        <div style={{ padding: 100, textAlign: 'center', background: 'white', borderRadius: 16, border: '1px dashed #e2e8f0' }}>
           <ImageIcon size={48} style={{ color: '#cbd5e1', marginBottom: 16 }} />
           <p style={{ color: '#64748b' }}>{t('Your gallery is empty. Start by uploading event photos.')}</p>
        </div>
      ) : (
        <div style={{ 
          display: viewMode === 'grid' ? 'grid' : 'flex', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', 
          flexDirection: 'column',
          gap: 20 
        }}>
           {data.map(item => (
             <div key={item.id} style={{ 
               background: 'white', 
               borderRadius: 12, 
               border: '1px solid #e2e8f0', 
               overflow: 'hidden',
               display: viewMode === 'list' ? 'flex' : 'block',
               alignItems: viewMode === 'list' ? 'center' : 'initial',
               padding: viewMode === 'list' ? 12 : 0
             }}>
                <div style={{ 
                  width: viewMode === 'list' ? 100 : '100%', 
                  height: viewMode === 'list' ? 60 : 180, 
                  background: '#f1f5f9',
                  borderRadius: viewMode === 'list' ? 8 : 0,
                  overflow: 'hidden'
                }}>
                   <img src={item.photo_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={item.caption} />
                </div>
                <div style={{ padding: viewMode === 'list' ? '0 20px' : 16, flex: 1 }}>
                   <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1e293b', marginBottom: 4 }}>{item.caption || 'Untitled Media'}</div>
                   <div style={{ display: 'flex', gap: 8 }}>
                      <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>{item.category || 'General'}</span>
                   </div>
                </div>
                <div style={{ padding: 16, display: 'flex', gap: 12, justifyContent: 'flex-end', borderTop: viewMode === 'grid' ? '1px solid #f1f5f9' : 'none' }}>
                   <button style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}><Eye size={16} /></button>
                   <button style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}><Edit3 size={16} /></button>
                   <button style={{ background: 'none', border: 'none', color: '#991B1B', cursor: 'pointer' }}><Trash2 size={16} /></button>
                </div>
             </div>
           ))}
        </div>
      )}
    </AdminLayout>
  )
}
