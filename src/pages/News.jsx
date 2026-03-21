import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Calendar, Eye, ArrowRight, Search, Newspaper, Tag, Clock } from 'lucide-react'
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
    <div style={{ background: '#fcfcfd', minHeight: '100vh', paddingBottom: 100 }}>
      <div className="page-header" style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #E85A24 100%)' }}>
        <div className="container" style={{ textAlign: 'center', color: 'white' }}>
          <h1 className="hindi responsive-title" style={{ fontWeight: 900, marginBottom: 16 }}>{t('News & Updates')}</h1>
          <p className="hindi" style={{ fontSize: '1.1rem', opacity: 0.9 }}>{t('Stay informed with the latest happenings at DVS Foundation')}</p>
        </div>
      </div>

      <section className="section" style={{ marginTop: -80 }}>
        <div className="container">
          
          {/* Featured Hero */}
          {!loading && featuredArticle && (
            <div className="card grid grid-2" style={{ marginBottom: 60, padding: 0, overflow: 'hidden', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', borderRadius: 24, background: 'white' }}>
              <div style={{ height: 400, position: 'relative' }}>
                <img src={featuredArticle.featured_image || '/images/news-community.png'} alt="Featured News" width="800" height="400" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', top: 20, left: 20, background: '#FF6B35', color: 'white', padding: '8px 16px', borderRadius: 40, fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase' }}>{t('Featured')}</div>
              </div>
              <div style={{ padding: 'clamp(20px, 5vw, 48px)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', color: '#64748b' }}><Calendar size={14} /> {new Date(featuredArticle.published_at).toLocaleDateString()}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', color: '#64748b' }}><Clock size={14} /> 5 min read</span>
                </div>
                <h2 className="responsive-h2" style={{ fontWeight: 900, lineHeight: 1.2, marginBottom: 20, color: '#1e293b' }}>{language === 'hi' ? (featuredArticle.title_hi || featuredArticle.title) : featuredArticle.title}</h2>
                <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: 32 }}>{language === 'hi' ? featuredArticle.excerpt_hi : featuredArticle.excerpt}</p>
                <Link to={`/news/${featuredArticle.slug}`} style={{ width: 'fit-content', display: 'flex', alignItems: 'center', gap: 10, padding: '12px 28px', background: '#111', color: 'white', borderRadius: 40, textDecoration: 'none', fontWeight: 700 }}>{t('Read Full Story')} <ArrowRight size={18} /></Link>
              </div>
            </div>
          )}

          {/* Filters & Search */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40, gap: 20, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 10 }}>
              {categories.map(cat => (
                <button key={cat} onClick={() => setActiveTab(cat)} style={{ padding: '10px 24px', borderRadius: 40, border: '2px solid', borderColor: activeTab === cat ? '#FF6B35' : '#e2e8f0', background: activeTab === cat ? '#FF6B35' : 'white', color: activeTab === cat ? 'white' : '#475569', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap' }}>{t(cat)}</button>
              ))}
            </div>
            <div style={{ position: 'relative', width: 300 }}>
              <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input type="text" placeholder={t('Search articles...')} value={search} onChange={e => setSearch(e.target.value)} style={{ width: '100%', padding: '12px 14px 12px 42px', borderRadius: 40, border: '1px solid #e2e8f0', outline: 'none' }} />
            </div>
          </div>

          {/* Articles Grid */}
          {loading ? (
            <div className="grid grid-3">{[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 400, borderRadius: 24 }} />)}</div>
          ) : otherArticles.length > 0 ? (
            <div className="grid grid-3">
              {otherArticles.map(article => (
                <div key={article.id} className="card" style={{ padding: 0, borderRadius: 24, overflow: 'hidden', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', transition: 'transform 0.3s ease' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-10px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                  <div style={{ height: 200, position: 'relative' }}>
                    <img src={article.featured_image || (article.category === 'TECH' ? '/images/news-digital.png' : '/images/news-community.png')} alt="News Article" width="400" height="200" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', bottom: 12, left: 12, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', padding: '4px 12px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 800, color: '#FF6B35' }}>{t(article.category)}</div>
                  </div>
                  <div style={{ padding: 24 }}>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}><Calendar size={14} /> {new Date(article.published_at).toLocaleDateString()}</div>
                    <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e293b', marginBottom: 12, lineHeight: 1.4 }}>{language === 'hi' ? (article.title_hi || article.title) : article.title}</h4>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: 20 }}>{(language === 'hi' ? article.excerpt_hi : article.excerpt)?.substring(0, 100)}...</p>
                    <Link to={`/news/${article.slug}`} style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#FF6B35', fontWeight: 800, textDecoration: 'none', fontSize: '0.9rem' }}>{t('Read More')} <ArrowRight size={16} /></Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '100px 0', background: 'white', borderRadius: 24 }}>
               <Newspaper size={80} style={{ margin: '0 auto 24px', opacity: 0.2 }} />
               <p className="hindi" style={{ fontSize: '1.25rem', color: '#64748b' }}>{t('No articles found matching your criteria')}</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
