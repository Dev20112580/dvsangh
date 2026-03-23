import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Search as SearchIcon, GraduationCap, Calendar, MessageSquare, ChevronRight, Loader } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

export default function SearchPage() {
  const { t } = useLanguage()
  const [searchParams] = useSearchParams()
  const q = searchParams.get('q') || ''
  const [results, setResults] = useState({ scholarships: [], events: [], forum: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (q) performSearch()
  }, [q])

  async function performSearch() {
    setLoading(true)
    try {
      const [scholarships, events, forum, profiles] = await Promise.all([
        // Search by application number or district
        supabase.from('scholarship_applications').select('*')
          .or(`application_number.ilike.%${q}%,district.ilike.%${q}%`).limit(5),
        
        supabase.from('events').select('*').ilike('title', `%${q}%`).limit(5),
        
        supabase.from('forum_posts').select('*').ilike('title', `%${q}%`).limit(5),
        
        // Search Donors & Volunteers in profiles
        supabase.from('profiles').select('*')
          .ilike('full_name', `%${q}%`)
          .in('role', ['donor', 'volunteer'])
          .limit(5)
      ])

      setResults({
        scholarships: scholarships.data || [],
        events: events.data || [],
        forum: forum.data || [],
        profiles: profiles.data || []
      })
    } catch (err) {
      console.error('Search error:', err)
    } finally {
      setLoading(false)
    }
  }

  const hasResults = results.scholarships.length > 0 || results.events.length > 0 || results.forum.length > 0

  return (
    <div className="container" style={{ padding: '60px 20px', minHeight: '100vh' }}>
      <div style={{ marginBottom: 48 }}>
        <h1 className="hindi" style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: 12 }}>
          {t('Search Results for')} "{q}"
        </h1>
        <p style={{ color: 'var(--gray-500)' }}>{loading ? t('Searching DVS archives...') : `${t('Found')} ${results.scholarships.length + results.events.length + results.forum.length} ${t('matches')}`}</p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '100px 0' }}>
          <Loader className="spin" size={48} color="#A1401D" />
        </div>
      ) : !hasResults ? (
        <div style={{ textAlign: 'center', padding: '100px 0', background: '#f8fafc', borderRadius: 24, border: '1px dashed #e2e8f0' }}>
           <h2 className="hindi">{t('No results found')}</h2>
           <p style={{ marginTop: 12, color: 'var(--gray-500)' }}>{t('Try searching with different keywords like "Scholarship", "Batch", or "UPSC".')}</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 60 }}>
          
          {results.scholarships.length > 0 && (
            <section>
              <h3 className="hindi" style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
                <GraduationCap size={24} color="#A1401D" /> {t('Scholarships & Programs')}
              </h3>
              <div style={{ display: 'grid', gap: 16 }}>
                {results.scholarships.map(s => (
                  <Link key={s.id} to={`/dashboard/student`} style={{ textDecoration: 'none' }}>
                    <div className="card" style={{ padding: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                       <div>
                          <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--dark)' }}>{s.full_name}</div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--gray-500)', marginTop: 4 }}>{s.income_bracket} • {s.status}</div>
                       </div>
                       <ChevronRight size={20} color="var(--gray-300)" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {results.events.length > 0 && (
            <section>
              <h3 className="hindi" style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
                <Calendar size={24} color="#FF6B35" /> {t('Upcoming Events')}
              </h3>
              <div style={{ display: 'grid', gap: 16 }}>
                {results.events.map(e => (
                  <Link key={e.id} to={`/events`} style={{ textDecoration: 'none' }}>
                    <div className="card" style={{ padding: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                       <div>
                          <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--dark)' }}>{e.title}</div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--gray-500)', marginTop: 4 }}>{e.date} • {e.location}</div>
                       </div>
                       <ChevronRight size={20} color="var(--gray-300)" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {results.profiles?.length > 0 && (
            <section>
              <h3 className="hindi" style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
                <Loader size={24} color="#059669" /> {t('Donors & Volunteers')}
              </h3>
              <div style={{ display: 'grid', gap: 16 }}>
                {results.profiles.map(p => (
                  <Link key={p.id} to={`/admin/users`} style={{ textDecoration: 'none' }}>
                    <div className="card" style={{ padding: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                       <div>
                          <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--dark)' }}>{p.full_name}</div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--gray-500)', marginTop: 4 }}>
                            {t(p.role?.toUpperCase() || 'USER')} • {p.district || 'DVS Network'}
                          </div>
                       </div>
                       <ChevronRight size={20} color="var(--gray-300)" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {results.forum.length > 0 && (
            <section>
              <h3 className="hindi" style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
                <MessageSquare size={24} color="#3b82f6" /> {t('Community Discussions')}
              </h3>
              <div style={{ display: 'grid', gap: 16 }}>
                {results.forum.map(f => (
                  <Link key={f.id} to={`/forum`} style={{ textDecoration: 'none' }}>
                    <div className="card" style={{ padding: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                       <div>
                          <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--dark)' }}>{f.title}</div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--gray-500)', marginTop: 4 }}>{f.author_name} • {f.category}</div>
                       </div>
                       <ChevronRight size={20} color="var(--gray-300)" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

        </div>
      )}
      <style>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
