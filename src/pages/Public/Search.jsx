import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { Search as SearchIcon, FileText, Calendar, GraduationCap, BookOpen, ChevronRight, AlertCircle } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'

export default function SearchPage() {
  const { t, language } = useLanguage()
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const [results, setResults] = useState({
    scholarships: [],
    events: [],
    news: [],
    materials: []
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (query) performSearch()
  }, [query])

  async function performSearch() {
    setLoading(true)
    const lowerQuery = query.toLowerCase()

    // 1. Search Scholarships
    const { data: scholarships } = await supabase
      .from('scholarship_programs')
      .select('*')
      .or(`name.ilike.%${query}%,name_hi.ilike.%${query}%`)

    // 2. Search Events
    const { data: events } = await supabase
      .from('events')
      .select('*')
      .or(`title.ilike.%${query}%,title_hi.ilike.%${query}%`)

    // 3. Search News
    const { data: news } = await supabase
      .from('news_articles')
      .select('*')
      .or(`title.ilike.%${query}%,content.ilike.%${query}%`)

    // 4. Search Materials
    const { data: materials } = await supabase
      .from('study_materials')
      .select('*')
      .or(`title.ilike.%${query}%,subject.ilike.%${query}%`)

    setResults({
      scholarships: scholarships || [],
      events: events || [],
      news: news || [],
      materials: materials || []
    })
    setLoading(false)
  }

  const totalResults = results.scholarships.length + results.events.length + results.news.length + results.materials.length

  return (
    <div className="container" style={{ margin: '40px auto', padding: '0 16px' }}>
      <div style={{ marginBottom: 48 }}>
        <h1 className="hindi responsive-title" style={{ fontWeight: 900, marginBottom: 12 }}>
          {t('Search Results for')} "{query}"
        </h1>
        <p style={{ color: '#64748b' }}>{totalResults} {t('results found')}</p>
      </div>

      {loading ? (
        <div style={{ padding: 100, textAlign: 'center' }}>{t('Searching...') }</div>
      ) : totalResults > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
          
          {/* Scholarships */}
          {results.scholarships.length > 0 && (
            <Section title={t('Scholarships')} icon={<GraduationCap />} items={results.scholarships} type="scholarship" t={t} language={language} />
          )}

          {/* Events */}
          {results.events.length > 0 && (
            <Section title={t('Events')} icon={<Calendar />} items={results.events} type="event" t={t} language={language} />
          )}

          {/* Materials */}
          {results.materials.length > 0 && (
            <Section title={t('Study Materials')} icon={<BookOpen />} items={results.materials} type="material" t={t} language={language} />
          )}

          {/* News */}
          {results.news.length > 0 && (
            <Section title={t('Latest News')} icon={<FileText />} items={results.news} type="news" t={t} language={language} />
          )}

        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '100px 40px', background: '#f8fafc', borderRadius: 32 }}>
          <AlertCircle size={64} color="#94a3b8" style={{ margin: '0 auto 24px' }} />
          <h2 className="hindi" style={{ fontSize: '1.5rem', color: '#1e293b' }}>{t('No results found')}</h2>
          <p className="hindi" style={{ color: '#64748b', marginTop: 8 }}>{t('Try searching with different keywords like Bihar, UPSC, or Scholarship.')}</p>
        </div>
      )}
    </div>
  )
}

function Section({ title, icon, items, type, t, language }) {
  return (
    <div>
      <h3 className="hindi" style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '1.25rem', fontWeight: 800, marginBottom: 20, color: '#1e293b' }}>
        <div style={{ color: '#FF6B35' }}>{icon}</div> {title}
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {items.map(item => (
          <Link 
            key={item.id} 
            to={type === 'scholarship' ? '/scholarship/apply' : type === 'event' ? '/events' : type === 'material' ? '/student/materials' : `/news/${item.slug}`} 
            style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 16, padding: '16px 24px', borderRadius: 16, border: '1px solid #e2e8f0', background: 'white', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#FF6B35'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.04)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            <div style={{ flex: 1 }}>
              <div className="hindi" style={{ fontWeight: 800, color: '#111' }}>
                {language === 'hi' ? (item.title_hi || item.name_hi || item.title || item.name) : (item.title || item.name)}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: 4 }}>
                {item.category || item.subject || item.type || t('General')}
              </div>
            </div>
            <ChevronRight size={18} color="#94a3b8" />
          </Link>
        ))}
      </div>
    </div>
  )
}
