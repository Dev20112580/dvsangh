import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import { Home, FileText, BookOpen, User, GraduationCap, Download, Search, Filter, TrendingUp, Users } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'

export default function StudentMaterials() {
  const { user } = useAuth()
  const { t, language } = useLanguage()
  const [materials, setMaterials] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [classFilter, setClassFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')

  useEffect(() => { fetchMaterials() }, [])

  async function fetchMaterials() {
    setLoading(true)
    const { data } = await supabase.from('study_materials').select('*').order('created_at', { ascending: false })
    setMaterials(data || [])
    setLoading(false)
  }

  const filtered = materials.filter(m => 
    ((language === 'hi' ? (m.title_hi || m.title) : m.title).toLowerCase().includes(search.toLowerCase()) || 
     (m.subject || '').toLowerCase().includes(search.toLowerCase()) ||
     (m.category || '').toLowerCase().includes(search.toLowerCase())) && 
    (!classFilter || m.class_level === classFilter) &&
    (!categoryFilter || m.category === categoryFilter)
  )

  const trending = [...materials].sort((a, b) => (b.download_count || 0) - (a.download_count || 0)).slice(0, 3)
  const featured = materials.filter(m => m.tags?.includes('featured')).slice(0, 2)
  const recommended = featured.length > 0 ? featured : materials.slice(0, 2)

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <nav className="sidebar-nav" style={{ paddingTop: 24 }}>
          <NavLink to="/dashboard/student"><Home size={18} /> {t('Dashboard')}</NavLink>
          <NavLink to="/scholarship/apply"><GraduationCap size={18} /> {t('Scholarship')}</NavLink>
          <NavLink to="/student/applications"><FileText size={18} /> {t('Applications')}</NavLink>
          <NavLink to="/student/materials"><BookOpen size={18} /> {t('Study Materials')}</NavLink>
          <NavLink to="/community/study-groups"><Users size={18} /> {t('Study Groups')}</NavLink>
          <NavLink to="/student/profile"><User size={18} /> {t('Profile')}</NavLink>
        </nav>
      </aside>
      <main className="dashboard-content">
        <div className="dashboard-header">
          <h1 className="hindi">📚 {t('Study Library')}</h1>
          <p className="hindi" style={{ color: 'var(--gray-500)' }}>{t('Access notes, previous year papers, and strategy guides')}</p>
        </div>

        {/* Search & Filters */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 32, flexWrap: 'wrap', background: 'white', padding: 20, borderRadius: 16, boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 250 }}>
            <Search size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
            <input 
              className="hindi form-control" 
              placeholder={t('Search notes, subjects...')} 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              style={{ paddingLeft: 44, borderRadius: 12, border: '1px solid var(--gray-200)' }} 
            />
          </div>
          <select className="form-control hindi" style={{ width: 'auto', borderRadius: 12 }} value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
            <option value="">{t('All Categories')}</option>
            {['UPSC', 'SSC', 'JPSC', 'General', 'Strategy', 'Notes'].map(c => <option key={c} value={c}>{t(c)}</option>)}
          </select>
          <select className="form-control hindi" style={{ width: 'auto', borderRadius: 12 }} value={classFilter} onChange={e => setClassFilter(e.target.value)}>
            <option value="">{t('Select Class')}</option>
            {['6','7','8','9','10','11','12','Graduation'].map(c => <option key={c} value={c}>{t('Class')} {c}</option>)}
          </select>
        </div>

        {/* Top Downloads / Trending */}
        {!search && trending.length > 0 && (
          <div style={{ marginBottom: 40, padding: '24px', background: 'linear-gradient(135deg, #FF6B35 0%, #FF9F1C 100%)', borderRadius: 24, color: 'white' }}>
             <h3 className="hindi" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, fontSize: '1.25rem' }}>
                <TrendingUp size={24} /> {t('Trending Resources')}
             </h3>
             <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 12 }}>
                {trending.map((item, i) => (
                  <div key={i} onClick={() => window.open(item.file_url, '_blank')} style={{ minWidth: 260, background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', padding: 20, borderRadius: 16, border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer' }}>
                     <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', opacity: 0.8 }}>{item.category || item.exam_type}</span>
                     <div className="hindi" style={{ fontWeight: 800, marginTop: 8, marginBottom: 16, height: 40 }}>{language === 'hi' ? (item.title_hi || item.title) : item.title}</div>
                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.7rem', opacity: 0.9 }}>{item.download_count || 0} {t('downloads')}</span>
                        <Download size={16} />
                     </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {/* Featured Section */}
        {!search && !categoryFilter && !classFilter && recommended.length > 0 && (
           <div style={{ marginBottom: 40 }}>
              <h3 className="hindi" style={{ fontSize: '1.1rem', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
                 <Filter size={20} color="#A1401D" /> {t('Recommended for You')}
              </h3>
              <div className="grid grid-2">
                 {recommended.map(m => (
                    <div key={m.id} className="card" style={{ padding: 24, borderLeft: '4px solid #A1401D' }}>
                       <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                          <span className="badge badge-orange">{m.category || m.exam_type || 'General'}</span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>{m.download_count || 0} {t('downloads')}</span>
                       </div>
                       <h4 className="hindi" style={{ fontSize: '1rem', marginBottom: 20 }}>{language === 'hi' ? (m.title_hi || m.title) : m.title}</h4>
                       <button 
                         onClick={async () => {
                           if (!user) return
                           await supabase.from('gamification_points').insert([
                             { user_id: user.id, action: 'material_download', points: 10, description: `Downloaded ${m.title}` }
                           ])
                           await supabase.from('study_materials').update({ download_count: (m.download_count || 0) + 1 }).eq('id', m.id)
                           window.open(m.file_url, '_blank')
                         }} 
                         className="btn btn-sm btn-primary w-full"
                       >
                         <Download size={14} /> {t('Download Now')}
                       </button>
                    </div>
                 ))}
              </div>
           </div>
        )}

        {/* Regular List */}
        <h3 className="hindi" style={{ fontSize: '1.1rem', marginBottom: 20 }}>{t('All Resources')}</h3>
        {loading ? <div className="skeleton" style={{ height: 200, borderRadius: 'var(--radius-lg)' }} /> : filtered.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filtered.map(m => (
              <div className="card-flat" key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', padding: '16px 20px' }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: '#f0f9ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0369a1' }}>
                  <FileText size={22} />
                </div>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <h5 className="hindi" style={{ fontSize: '0.95rem' }}>{language === 'hi' ? (m.title_hi || m.title) : m.title}</h5>
                  <div style={{ display: 'flex', gap: 8, marginTop: 4, alignItems: 'center' }}>
                    {m.subject && <span className="badge badge-info" style={{ fontSize: '0.65rem' }}>{m.subject}</span>}
                    {m.class_level && <span className="badge badge-orange" style={{ fontSize: '0.65rem' }}>{t('Class')} {m.class_level}</span>}
                    <span style={{ fontSize: '0.75rem', color: 'var(--gray-400)', marginLeft: 8 }}>{m.download_count || 0} {t('downloads')}</span>
                  </div>
                </div>
                <button 
                  onClick={async () => {
                    if (!user) return
                    // Award 10 points for downloading material
                    await supabase.from('gamification_points').insert([
                      { user_id: user.id, action: 'material_download', points: 10, description: `Downloaded ${m.title}` }
                    ])
                    // Increment download count in DB
                    await supabase.from('study_materials').update({ download_count: (m.download_count || 0) + 1 }).eq('id', m.id)
                    // Open file
                    window.open(m.file_url, '_blank')
                  }} 
                  className="btn btn-sm btn-secondary"
                >
                  <Download size={14} /> {t('Download')}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="card" style={{ textAlign: 'center', padding: 64 }}>
            <BookOpen size={48} color="var(--gray-300)" style={{ margin: '0 auto 16px' }} />
            <p className="hindi" style={{ color: 'var(--gray-500)' }}>{t('No materials found. Try clearing filters.')}</p>
          </div>
        )}
      </main>
    </div>
  )
}
