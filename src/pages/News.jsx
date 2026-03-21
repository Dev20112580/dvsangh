import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Calendar, Eye, ArrowRight, Search, Newspaper, Tag, Clock, Share2 } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

export default function News() {
  const { t, language } = useLanguage()
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('All')

  const categories = ['All', 'Events', 'Scholarships', 'Impact', 'Programs']

  async function fetchNews() {
    const { data } = await supabase.from('news_articles').select('*').eq('status', 'published').order('published_at', { ascending: false })
    setArticles(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchNews()
  }, [])

  const filtered = articles.filter(a => {
    const matchesSearch = !search || 
      (a.title && a.title.toLowerCase().includes(search.toLowerCase())) || 
      (a.title_hi && a.title_hi.toLowerCase().includes(search.toLowerCase()))
    const matchesTab = activeTab === 'All' || a.category === activeTab
    return matchesSearch && matchesTab
  })

  const featuredArticle = articles[0]
  const otherArticles = filtered.filter(a => a.id !== (featuredArticle?.id || ''))

  return (
    <div className="news-page" style={{ background: '#F8FAFC', minHeight: '100vh' }}>
      <div className="page-header" style={{ background: 'var(--dark)', padding: '100px 0 140px' }}>
        <div className="container">
          <h1 className="hindi responsive-title" style={{ color: 'white', fontWeight: 900, marginBottom: 16 }}>{t('News & Updates')}</h1>
          <p className="hindi" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem', maxWidth: 600, margin: '0 auto' }}>{t('Stay informed with the latest happenings at DVS Foundation')}</p>
          <div className="breadcrumb" style={{ justifyContent: 'center', marginTop: 24 }}>
            <Link to="/">{t('Home')}</Link> <span>/</span> <span style={{ color: 'rgba(255,255,255,0.5)' }}>{t('News')}</span>
          </div>
        </div>
      </div>

      <section className="section" style={{ marginTop: -100 }}>
        <div className="container">
          
          {/* Featured Hero Article */}
          {!loading && featuredArticle && !search && activeTab === 'All' && (
            <div className="featured-news-card">
              <div className="featured-image">
                <img src={featuredArticle.featured_image || '/images/news-community.png'} alt="Featured" />
                <div className="featured-tag">{t('Featured')}</div>
              </div>
              <div className="featured-content">
                <div className="news-meta">
                  <span><Calendar size={14} /> {new Date(featuredArticle.published_at).toLocaleDateString()}</span>
                  <span><Clock size={14} /> 5 min read</span>
                </div>
                <h2 className="hindi">{language === 'hi' ? (featuredArticle.title_hi || featuredArticle.title) : featuredArticle.title}</h2>
                <p className="hindiExcerpt">{language === 'hi' ? featuredArticle.excerpt_hi : featuredArticle.excerpt}</p>
                <div style={{ marginTop: 'auto', paddingTop: 24 }}>
                  <Link to={`/news/${featuredArticle.slug}`} className="btn btn-primary">{t('Read Full Story')} <ArrowRight size={18} /></Link>
                </div>
              </div>
            </div>
          )}

          {/* Filters & Search Bar */}
          <div className="news-controls">
            <div className="news-filters">
              {categories.map(cat => (
                <button 
                  key={cat} 
                  className={`filter-btn ${activeTab === cat ? 'active' : ''}`}
                  onClick={() => setActiveTab(cat)}
                >
                  {t(cat)}
                </button>
              ))}
            </div>
            <div className="news-search">
              <Search size={20} color="var(--gray-400)" />
              <input 
                type="text" 
                placeholder={t('Search articles...')} 
                value={search} 
                onChange={e => setSearch(e.target.value)} 
              />
            </div>
          </div>

          {/* Articles Grid */}
          {loading ? (
            <div className="grid grid-3">
              {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 450, borderRadius: 24 }} />)}
            </div>
          ) : filtered.length > 0 ? (
            <div className="grid grid-3">
              {filtered.map(article => (
                <div key={article.id} className="news-card hover-up">
                  <div className="card-image">
                    <img src={article.featured_image || (article.category === 'Scholarships' ? '/images/news-scholarship.png' : '/images/news-community.png')} alt="News" />
                    <div className="card-category">{t(article.category)}</div>
                  </div>
                  <div className="card-body">
                    <div className="news-meta">
                      <span><Calendar size={14} /> {new Date(article.published_at).toLocaleDateString()}</span>
                    </div>
                    <h3 className="hindi">{language === 'hi' ? (article.title_hi || article.title) : article.title}</h3>
                    <p className="hindi" style={{ opacity: 0.7, fontSize: '0.9rem', marginBottom: 20 }}>
                      {(language === 'hi' ? article.excerpt_hi : article.excerpt)?.substring(0, 90)}...
                    </p>
                    <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Link to={`/news/${article.slug}`} className="read-more-link">{t('Read More')} <ArrowRight size={16} /></Link>
                      <button className="share-btn"><Share2 size={16} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="news-empty">
               <Newspaper size={80} strokeWidth={1} style={{ opacity: 0.2, marginBottom: 24 }} />
               <p className="hindi">{t('No articles found matching your criteria')}</p>
            </div>
          )}
        </div>
      </section>

      <style>{`
        .featured-news-card { 
          display: flex; background: white; border-radius: 32px; overflow: hidden; 
          box-shadow: 0 20px 50px rgba(0,0,0,0.08); margin-bottom: 60px; min-height: 440px;
        }
        .featured-image { flex: 1.2; position: relative; }
        .featured-image img { width: 100%; height: 100%; object-fit: cover; }
        .featured-tag { position: absolute; top: 24px; left: 24px; background: var(--dvs-orange); color: white; padding: 8px 16px; border-radius: 20px; font-weight: 800; font-size: 0.75rem; }
        .featured-content { flex: 1; padding: 48px; display: flex; flexDirection: column; }
        .news-meta { display: flex; gap: 16px; margin-bottom: 16px; color: var(--gray-400); font-size: 0.85rem; font-weight: 600; }
        .news-meta span { display: flex; align-items: center; gap: 6px; }
        .featured-content h2 { font-size: 2.25rem; font-weight: 800; color: var(--dark); margin-bottom: 16px; line-height: 1.2; }
        .hindiExcerpt { color: var(--gray-600); font-size: 1.1rem; line-height: 1.7; }

        .news-controls { display: flex; justify-content: space-between; align-items: center; margin-bottom: 48px; gap: 24px; flex-wrap: wrap; }
        .news-filters { display: flex; gap: 10px; overflow-x: auto; padding-bottom: 8px; flex: 1; scrollbar-width: none; }
        .news-filters::-webkit-scrollbar { display: none; }
        .filter-btn { padding: 10px 24px; borderRadius: 30px; border: 1.5px solid var(--gray-200); background: white; color: var(--gray-600); font-weight: 700; white-space: nowrap; cursor: pointer; transition: all 0.2s; }
        .filter-btn.active { background: var(--dark); color: white; border-color: var(--dark); }
        .news-search { position: relative; width: 100%; maxWidth: 320px; }
        .news-search input { width: 100%; padding: 12px 20px 12px 48px; borderRadius: 30px; border: 1.5px solid var(--gray-200); outline: none; transition: 0.2s; }
        .news-search input:focus { border-color: var(--dvs-orange); }
        .news-search svg { position: absolute; left: 16px; top: 12px; }

        .news-card { background: white; border-radius: 24px; overflow: hidden; display: flex; flex-direction: column; transition: all 0.4s; }
        .card-image { height: 220px; position: relative; }
        .card-image img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1); }
        .news-card:hover .card-image img { transform: scale(1.05); }
        .card-category { position: absolute; bottom: 12px; left: 12px; background: rgba(255,255,255,0.9); backdrop-filter: blur(8px); padding: 5px 14px; border-radius: 12px; font-weight: 800; font-size: 0.7rem; color: var(--dvs-orange); }
        .card-body { padding: 24px; flex: 1; display: flex; flex-direction: column; }
        .card-body h3 { font-size: 1.25rem; font-weight: 800; color: var(--dark); margin-bottom: 12px; line-height: 1.4; }
        .read-more-link { display: flex; align-items: center; gap: 6px; color: var(--dvs-orange); font-weight: 800; text-decoration: none; font-size: 0.9rem; }
        .share-btn { background: var(--gray-50); border: none; padding: 8px; border-radius: 50%; color: var(--gray-400); cursor: pointer; transition: 0.2s; }
        .share-btn:hover { background: var(--dvs-orange-bg); color: var(--dvs-orange); }

        .news-empty { text-align: center; padding: 80px 20px; background: white; border-radius: 32px; color: var(--gray-400); }

        @media (max-width: 1023px) {
          .featured-news-card { flex-direction: column; }
          .featured-image { height: 300px; }
          .featured-content { padding: 32px; }
          .featured-content h2 { font-size: 1.75rem; }
        }
        @media (max-width: 768px) {
          .news-controls { gap: 16px; }
          .news-search { max-width: 100%; }
          .news-page .section { padding: 40px 0; }
        }
      `}</style>
    </div>
  )
}
