import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Image, Search, Heart, Download, X } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

const categories = ['All', 'Events', 'Sports', 'Cultural', 'Education', 'Social', 'Nature']

export default function Gallery() {
  const { t } = useLanguage()
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')
  const [lightbox, setLightbox] = useState(null)

  useEffect(() => {
    fetchPhotos()
  }, [])

  async function fetchPhotos() {
    const { data } = await supabase.from('gallery_photos').select('*').order('created_at', { ascending: false })
    setPhotos(data || [])
    setLoading(false)
  }

  const filtered = activeCategory === 'All' ? photos : photos.filter(p => p.category === activeCategory || (activeCategory === 'All' && p.category === 'सभी'))

  return (
    <>
      <div className="page-header">
        <h1 className="hindi">{t('Photo Gallery')}</h1>
        <p className="hindi">{t('Glimpses of various DVS programs')}</p>
        <div className="breadcrumb">
          <Link to="/">{t('Home')}</Link> <span>/</span> <span>{t('Gallery')}</span>
        </div>
      </div>

      <section className="section">
        <div className="container">
          {/* Category Filter */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 40 }}>
            {categories.map(cat => (
              <button
                key={cat}
                className={`btn btn-sm ${activeCategory === cat ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setActiveCategory(cat)}
              >
                {t(cat)}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-3">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="skeleton" style={{ height: 250, borderRadius: 'var(--radius-lg)' }} />
              ))}
            </div>
          ) : filtered.length > 0 ? (
            <div style={{ columnCount: language === 'en' ? 3 : 2, columnGap: 24, padding: '20px 0' }}>
              {filtered.map(photo => (
                <div key={photo.id} style={{ breakInside: 'avoid', marginBottom: 24, position: 'relative', borderRadius: 'var(--radius-lg)', overflow: 'hidden', cursor: 'pointer', background: 'var(--gray-100)', transition: 'transform 0.3s ease' }}
                  onClick={() => setLightbox(photo)}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                  <img src={photo.photo_url || photo.thumbnail_url} alt={photo.caption || 'DVS Gallery'}
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                    onError={(e) => { e.target.style.display = 'none' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(transparent 50%, rgba(0,0,0,0.8))', display: 'flex', alignItems: 'flex-end', padding: '20px', opacity: 0, transition: '0.3s' }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = 0}>
                    <div style={{ width: '100%' }}>
                      <p className="hindi" style={{ color: 'white', fontWeight: 800, fontSize: '0.95rem', marginBottom: 8, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>{photo.caption || 'DVS Photo'}</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', gap: 12 }}>
                          <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.8rem', fontWeight: 700 }}>❤️ {photo.likes_count || 0}</span>
                        </div>
                        <span className="badge" style={{ background: '#FF6B35', color: 'white', border: 'none', fontSize: '0.65rem' }}>{t(photo.category)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: 60, color: 'var(--gray-400)' }}>
              <Image size={64} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
              <p className="hindi" style={{ fontSize: '1.1rem' }}>{t('Photos will be uploaded soon')}</p>
              <p style={{ fontSize: '0.85rem', marginTop: 8 }}>{t('Add photos from the Admin panel')}</p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div className="modal-overlay" onClick={() => setLightbox(null)}>
          <div style={{ position: 'relative', maxWidth: 900, width: '100%' }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setLightbox(null)} style={{ position: 'absolute', top: -40, right: 0, background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
              <X size={28} />
            </button>
            <img src={lightbox.photo_url} alt={lightbox.caption} style={{ width: '100%', borderRadius: 'var(--radius-lg)' }} />
            {lightbox.caption && (
               <p style={{ color: 'white', textAlign: 'center', marginTop: 12, fontSize: '1rem' }}>{lightbox.caption}</p>
            )}
          </div>
        </div>
      )}
    </>
  )
}
