import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Image, Search, Heart, Download, X, Globe } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

const categories = ['All', 'Events', 'Sports', 'Cultural', 'Education', 'Social', 'Nature']

export default function Gallery() {
  const { t, language } = useLanguage()
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
    <div className="gallery-page">
      <div className="page-header">
        <div className="container">
          <h1 className="hindi">{t('Photo Gallery')}</h1>
          <p className="hindi">{t('Glimpses of various DVS programs')}</p>
          <div className="breadcrumb">
            <Link to="/">{t('Home')}</Link> <span>/</span> <span>{t('Gallery')}</span>
          </div>
        </div>
      </div>

      <section className="section bg-white">
        <div className="container">
          {/* Category Filter - Scrollable on Mobile */}
          <div className="category-scroll-wrapper" style={{ marginBottom: 48 }}>
            <div className="category-scroll-inner">
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`btn-pill ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {t(cat)}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="grid grid-3">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="skeleton" style={{ height: 280, borderRadius: 24 }} />
              ))}
            </div>
          ) : filtered.length > 0 ? (
            <div className="masonry-grid">
              {filtered.map(photo => (
                <div 
                  key={photo.id} 
                  className="masonry-item"
                  onClick={() => setLightbox(photo)}
                >
                  <img src={photo.photo_url || photo.thumbnail_url} alt={photo.caption || 'DVS Gallery'} loading="lazy" />
                  <div className="masonry-overlay">
                    <div className="overlay-content">
                       <span className="badge-pill">{t(photo.category)}</span>
                       <p className="hindi">{photo.caption || 'DVS Presence'}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <Image size={80} strokeWidth={1} />
              <h3 className="hindi">{t('Photos will be uploaded soon')}</h3>
              <p>{t('Our team is currently capturing the latest moments.')}</p>
            </div>
          )}
        </div>
      </section>

      {/* Premium Lightbox */}
      {lightbox && (
        <div className="lightbox-overlay" onClick={() => setLightbox(null)}>
          <button className="lightbox-close" onClick={() => setLightbox(null)}><X size={32} /></button>
          <div className="lightbox-container" onClick={e => e.stopPropagation()}>
            <img src={lightbox.photo_url} alt={lightbox.caption} />
            <div className="lightbox-caption">
              <span className="badge-pill">{t(lightbox.category)}</span>
              <p className="hindi">{lightbox.caption}</p>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .category-scroll-wrapper { overflow-x: auto; padding: 4px 0 12px; margin: 0 -16px; scrollbar-width: none; }
        .category-scroll-wrapper::-webkit-scrollbar { display: none; }
        .category-scroll-inner { display: flex; gap: 12px; padding: 0 16px; justify-content: center; min-width: max-content; }
        
        .btn-pill { 
          padding: 10px 24px; borderRadius: 30px; border: 1.5px solid var(--gray-200); background: white; 
          color: var(--gray-600); font-weight: 700; font-size: 0.9rem; transition: all 0.2s; white-space: nowrap; cursor: pointer;
        }
        .btn-pill.active { background: var(--dvs-orange); color: white; border-color: var(--dvs-orange); box-shadow: 0 4px 12px rgba(255,107,53,0.3); }
        
        .masonry-grid { columns: 3; column-gap: 24px; }
        .masonry-item { 
          break-inside: avoid; margin-bottom: 24px; position: relative; border-radius: 24px; overflow: hidden; 
          cursor: pointer; background: var(--gray-50); transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
        }
        .masonry-item:hover { transform: translateY(-8px); box-shadow: var(--shadow-xl); }
        .masonry-item img { width: 100%; height: auto; display: block; border-radius: 24px; }
        
        .masonry-overlay { 
          position: absolute; inset: 0; background: linear-gradient(transparent 30%, rgba(0,0,0,0.8)); 
          display: flex; alignItems: flex-end; padding: 24px; opacity: 0; transition: opacity 0.3s; 
        }
        .masonry-item:hover .masonry-overlay { opacity: 1; }
        .overlay-content { width: 100%; }
        .overlay-content p { color: white; margin-top: 10px; font-weight: 700; font-size: 0.95rem; }
        
        .badge-pill { background: rgba(255,255,255,0.2); backdrop-filter: blur(4px); color: white; padding: 4px 12px; borderRadius: 20px; fontSize: 0.7rem; fontWeight: 800; textTransform: uppercase; border: 1px solid rgba(255,255,255,0.3); }

        .empty-state { textAlign: center; padding: 100px 20px; color: var(--gray-300); }
        .empty-state h3 { color: var(--gray-600); margin-top: 24px; }

        .lightbox-overlay { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.95); backdrop-filter: blur(10px); z-index: 2000; display: flex; alignItems: center; justifyContent: center; padding: 20px; animation: fadeIn 0.3s ease; }
        .lightbox-close { position: absolute; top: 30px; right: 30px; background: none; border: none; color: white; cursor: pointer; z-index: 2001; }
        .lightbox-container { maxWidth: 1000px; width: 100%; position: relative; }
        .lightbox-container img { width: 100%; maxHeight: 80vh; objectFit: contain; borderRadius: 16px; box-shadow: 0 20px 50px rgba(0,0,0,0.5); }
        .lightbox-caption { marginTop: 20px; textAlign: center; color: white; }
        .lightbox-caption p { fontSize: 1.1rem; marginTop: 12px; fontWeight: 600; }

        @media (max-width: 1023px) { .masonry-grid { columns: 2; } }
        @media (max-width: 768px) { 
          .category-scroll-inner { justify-content: flex-start; }
          .masonry-grid { columns: 1; column-gap: 0; }
          .masonry-overlay { opacity: 1; background: linear-gradient(transparent 60%, rgba(0,0,0,0.7)); }
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  )
}
