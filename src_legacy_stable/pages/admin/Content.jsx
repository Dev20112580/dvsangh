import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import AdminLayout from '../../components/admin/AdminLayout'
import { 
  Plus, Edit, Trash2, Image, Newspaper, Star, Eye,
  Search, CheckCircle, Clock, LayoutGrid, FileText, Upload, Filter, MoreVertical
} from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'

export default function AdminContent() {
  const { t, language } = useLanguage()
  const [tab, setTab] = useState('news')
  const [news, setNews] = useState([])
  const [stories, setStories] = useState([])
  const [gallery, setGallery] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [newsForm, setNewsForm] = useState({ title: '', content: '', category: '', status: 'draft' })
  const [uploading, setUploading] = useState(false)

  useEffect(() => { fetchContent() }, [])

  async function fetchContent() {
    setLoading(true)
    const [nr, sr, gr] = await Promise.all([
      supabase.from('news_articles').select('*').order('created_at', { ascending: false }),
      supabase.from('success_stories').select('*').order('created_at', { ascending: false }),
      supabase.from('gallery_photos').select('*').order('created_at', { ascending: false })
    ])
    setNews(nr.data || [])
    setStories(sr.data || [])
    setGallery(gr.data || [])
    setLoading(false)
  }

  async function createNews(e) {
    e.preventDefault()
    const { error } = await supabase.from('news_articles').insert({ ...newsForm, published_at: newsForm.status === 'published' ? new Date().toISOString() : null })
    if (!error) { setShowForm(false); fetchContent(); setNewsForm({ title: '', content: '', category: '', status: 'draft' }) }
  }

  async function deleteNews(id) {
    if (confirm(t('Permanently delete this article?'))) {
      await supabase.from('news_articles').delete().eq('id', id)
      setNews(prev => prev.filter(n => n.id !== id))
    }
  }

  async function updateStory(id, updates) {
    const { error } = await supabase.from('success_stories').update(updates).eq('id', id)
    if (!error) fetchContent()
  }

  async function handleGalleryUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random()}.${fileExt}`
    const filePath = `gallery/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('gallery')
      .upload(filePath, file)

    if (uploadError) {
      alert(t('Upload failed'))
      setUploading(false)
      return
    }

    const { data: { publicUrl } } = supabase.storage
      .from('gallery')
      .getPublicUrl(filePath)

    const { error: dbError } = await supabase.from('gallery_photos').insert({
      photo_url: publicUrl,
      category: 'General',
      caption: file.name
    })

    if (!dbError) fetchContent()
    setUploading(false)
  }

  async function deletePhoto(id, url) {
    if (!confirm(t('Remove this photo from gallery?'))) return
    
    // Extract file path from URL
    const filePath = url.split('/').pop()
    await supabase.storage.from('gallery').remove([`gallery/${filePath}`])
    await supabase.from('gallery_photos').delete().eq('id', id)
    fetchContent()
  }

  return (
    <AdminLayout title={t("Digital Assets & CMS")}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
         <div>
            <div className="hindi" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111' }}>{t('Content Management')}</div>
            <div className="hindi" style={{ fontSize: '0.8rem', color: '#64748b', marginTop: 4 }}>{t('Curate public-facing news, success stories, and media.')}</div>
         </div>
         {tab === 'news' && (
           <button onClick={() => setShowForm(!showForm)} className="hindi" style={{ padding: '8px 16px', background: showForm ? 'transparent' : '#111', border: showForm ? '1px solid #e2e8f0' : 'none', color: showForm ? '#475569' : 'white', borderRadius: 8, fontSize: '0.8rem', fontWeight: 600, display: 'flex', gap: 8, alignItems: 'center', cursor: 'pointer' }}>
             {showForm ? t('Cancel Editor') : <><Plus size={16} /> {t('New Article')}</>}
           </button>
         )}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid #e2e8f0' }}>
         <button onClick={() => setTab('news')} className="hindi" style={{ padding: '10px 20px', background: tab === 'news' ? '#fff7ed' : 'transparent', border: tab === 'news' ? '1px solid #ffedd5' : '1px solid transparent', color: tab === 'news' ? '#A1401D' : '#64748b', borderRadius: 10, fontSize: '0.8rem', fontWeight: 700, display: 'flex', gap: 8, alignItems: 'center', cursor: 'pointer' }}>
            <Newspaper size={16} /> {t('News & Updates')}
         </button>
         <button onClick={() => setTab('stories')} className="hindi" style={{ padding: '10px 20px', background: tab === 'stories' ? '#fffbeb' : 'transparent', border: tab === 'stories' ? '1px solid #fde68a' : '1px solid transparent', color: tab === 'stories' ? '#d97706' : '#64748b', borderRadius: 10, fontSize: '0.8rem', fontWeight: 700, display: 'flex', gap: 8, alignItems: 'center', cursor: 'pointer' }}>
            <Star size={16} /> {t('Success Stories')}
         </button>
         <button onClick={() => setTab('gallery')} className="hindi" style={{ padding: '10px 20px', background: tab === 'gallery' ? '#f4f4f5' : 'transparent', border: tab === 'gallery' ? '1px solid #e4e4e7' : '1px solid transparent', color: tab === 'gallery' ? '#3f3f46' : '#64748b', borderRadius: 10, fontSize: '0.8rem', fontWeight: 700, display: 'flex', gap: 8, alignItems: 'center', cursor: 'pointer' }}>
            <Image size={16} /> {t('Media Gallery')}
         </button>
      </div>

      {tab === 'news' && (
        <>
          {showForm && (
            <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', padding: 32, marginBottom: 24, boxShadow: '0 10px 40px rgba(0,0,0,0.04)' }}>
              <div className="hindi" style={{ fontSize: '1.1rem', fontWeight: 800, color: '#111', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
                <FileText size={20} color="#A1401D" /> {t('Content Editor')}
              </div>
              <form onSubmit={createNews}>
                <div style={{ marginBottom: 20 }}>
                  <label className="hindi" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>{t('Headlines')}</label>
                  <input className="hindi" required value={newsForm.title} onChange={e => setNewsForm({ ...newsForm, title: e.target.value })} style={{ width: '100%', padding: '16px 20px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: '1.1rem', fontWeight: 600, outline: 'none' }} placeholder={t("Catchy article title...")} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
                  <div>
                    <label className="hindi" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>{t('Classification / Category')}</label>
                    <input className="hindi" value={newsForm.category} onChange={e => setNewsForm({ ...newsForm, category: e.target.value })} style={{ width: '100%', padding: '12px 16px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: '0.9rem', outline: 'none' }} placeholder={t("e.g. Technology, Outreach")} />
                  </div>
                  <div>
                    <label className="hindi" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>{t('Publication Status')}</label>
                    <select className="hindi" value={newsForm.status} onChange={e => setNewsForm({ ...newsForm, status: e.target.value })} style={{ width: '100%', padding: '12px 16px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: '0.9rem', outline: 'none', backgroundColor: 'white' }}>
                      <option value="draft">{t('Save as Draft')}</option>
                      <option value="published">{t('Publish Immediately')}</option>
                    </select>
                  </div>
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label className="hindi" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>{t('Article Body')}</label>
                  <textarea className="hindi" required value={newsForm.content} onChange={e => setNewsForm({ ...newsForm, content: e.target.value })} style={{ width: '100%', padding: '16px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: '0.9rem', outline: 'none', minHeight: 250, resize: 'vertical' }} placeholder={t("Support markdown format...")} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, borderTop: '1px solid #f1f5f9', paddingTop: 24 }}>
                  <button type="submit" className="hindi" style={{ padding: '12px 32px', background: '#A1401D', border: 'none', borderRadius: 8, fontSize: '0.9rem', fontWeight: 700, color: 'white', cursor: 'pointer', boxShadow: '0 4px 12px rgba(161, 64, 29, 0.2)' }}>
                    {newsForm.status === 'published' ? t('Publish Article') : t('Save Draft')}
                  </button>
                </div>
              </form>
            </div>
          )}

          <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  <th className="hindi" style={{ padding: '16px 24px', fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, borderBottom: '1px solid #e2e8f0' }}>{t('Article Details')}</th>
                  <th className="hindi" style={{ padding: '16px 24px', fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, borderBottom: '1px solid #e2e8f0' }}>{t('Status')}</th>
                  <th className="hindi" style={{ padding: '16px 24px', fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, borderBottom: '1px solid #e2e8f0' }}>{t('Metrics')}</th>
                  <th className="hindi" style={{ padding: '16px 24px', fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, borderBottom: '1px solid #e2e8f0', textAlign: 'right' }}>{t('Actions')}</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={4} className="hindi" style={{ padding: 40, textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem' }}>{t('Loading articles...')}</td></tr>
                ) : news.length === 0 ? (
                  <tr><td colSpan={4} className="hindi" style={{ padding: 40, textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem' }}>{t('No articles published yet.')}</td></tr>
                ) : (
                  news.map(n => (
                    <tr key={n.id} style={{ borderBottom: '1px solid #f1f5f9', background: 'white' }}>
                      <td style={{ padding: '20px 24px' }}>
                         <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#111' }}>{n.title}</div>
                         <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                            <span className="hindi" style={{ color: '#1d4ed8', fontWeight: 600 }}>{t(n.category || 'General')}</span>
                            <span>•</span>
                            <Clock size={12} /> {new Date(n.created_at).toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN', { month: 'short', day: 'numeric', year: 'numeric'})}
                         </div>
                      </td>
                      <td style={{ padding: '20px 24px' }}>
                         {n.status === 'published' ? (
                            <div className="hindi" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#ecfdf5', color: '#047857', padding: '4px 10px', borderRadius: 6, fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}><CheckCircle size={14} /> {t('Published')}</div>
                         ) : (
                            <div className="hindi" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#f1f5f9', color: '#475569', padding: '4px 10px', borderRadius: 6, fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}><FileText size={14} /> {t('Draft')}</div>
                         )}
                      </td>
                      <td style={{ padding: '20px 24px' }}>
                         <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155', display: 'flex', alignItems: 'center', gap: 6 }}><Eye size={14} color="#94a3b8" /> {n.views || 0}</div>
                      </td>
                      <td style={{ padding: '20px 24px', textAlign: 'right' }}>
                         <button onClick={() => deleteNews(n.id)} style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 6, padding: 8, color: '#dc2626', display: 'inline-flex', cursor: 'pointer' }}><Trash2 size={14} /></button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === 'stories' && (
        <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                <th className="hindi" style={{ padding: '16px 24px', fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, borderBottom: '1px solid #e2e8f0' }}>{t('Success Story')}</th>
                <th className="hindi" style={{ padding: '16px 24px', fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, borderBottom: '1px solid #e2e8f0' }}>{t('Visibility')}</th>
                <th className="hindi" style={{ padding: '16px 24px', fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, borderBottom: '1px solid #e2e8f0' }}>{t('Approval Status')}</th>
                <th className="hindi" style={{ padding: '16px 24px', fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, borderBottom: '1px solid #e2e8f0', textAlign: 'right' }}>{t('Actions')}</th>
              </tr>
            </thead>
            <tbody>
              {stories.length === 0 ? (
                <tr><td colSpan={4} className="hindi" style={{ padding: 40, textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem' }}>{t('No success stories submitted yet.')}</td></tr>
              ) : (
                stories.map(s => (
                  <tr key={s.id} style={{ borderBottom: '1px solid #f1f5f9', background: 'white' }}>
                    <td style={{ padding: '20px 24px' }}>
                       <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#111' }}>{s.title}</div>
                       <div className="hindi" style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 4 }}>{t('Village')}: {s.village || '-'}</div>
                    </td>
                    <td style={{ padding: '20px 24px' }}>
                       <button 
                         onClick={() => updateStory(s.id, { is_featured: !s.is_featured })}
                         className="hindi" 
                         style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, color: s.is_featured ? '#d97706' : '#94a3b8', fontSize: '0.75rem', fontWeight: 700 }}
                       >
                         <Star size={14} fill={s.is_featured ? "#d97706" : "none"} /> {s.is_featured ? t('Featured') : t('Standard')}
                       </button>
                    </td>
                    <td style={{ padding: '20px 24px' }}>
                        {s.is_approved ? (
                          <div className="hindi" style={{ display: 'inline-flex', background: '#ecfdf5', color: '#047857', padding: '4px 10px', borderRadius: 6, fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>{t('Approved')}</div>
                        ) : (
                          <button 
                            onClick={() => updateStory(s.id, { is_approved: true, approved_at: new Date().toISOString() })}
                            className="hindi"
                            style={{ background: '#fef3c7', border: 'none', color: '#b45309', padding: '4px 10px', borderRadius: 6, fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', cursor: 'pointer' }}
                          >
                            {t('Approve')}
                          </button>
                        )}
                    </td>
                    <td style={{ padding: '20px 24px', textAlign: 'right' }}>
                       <button onClick={() => updateStory(s.id, { is_approved: false })} className="hindi" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 6, padding: '6px 14px', fontSize: '0.75rem', fontWeight: 600, color: '#dc2626', cursor: 'pointer' }}>{t('Reject')}</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'gallery' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
            <label className="btn btn-primary btn-sm hindi" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
              {uploading ? <Clock size={16} className="animate-spin" /> : <Upload size={16} />}
              {uploading ? t('Uploading...') : t('Upload New Photo')}
              <input type="file" hidden accept="image/*" onChange={handleGalleryUpload} disabled={uploading} />
            </label>
          </div>
          <div className="grid grid-4" style={{ gap: 20 }}>
            {gallery.length === 0 ? (
               <div colSpan={4} className="card" style={{ padding: 48, textAlign: 'center', background: '#f8fafc', gridColumn: 'span 4' }}>
                  <Image size={48} color="#cbd5e1" style={{ margin: '0 auto 16px' }} />
                  <p className="hindi" style={{ color: '#64748b' }}>{t('Your gallery is empty.')}</p>
               </div>
            ) : gallery.map(item => (
              <div key={item.id} className="card-flat" style={{ padding: 0, overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column' }}>
                <img src={item.photo_url} alt={item.caption} style={{ width: '100%', height: 180, objectFit: 'cover' }} />
                <div style={{ padding: 12 }}>
                   <div className="hindi" style={{ fontSize: '0.7rem', fontWeight: 800, color: '#A1401D', textTransform: 'uppercase', marginBottom: 4 }}>{t(item.category)}</div>
                   <div style={{ fontSize: '0.75rem', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.caption}</div>
                </div>
                <button 
                  onClick={() => deletePhoto(item.id, item.photo_url)}
                  style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#dc2626', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </>
      )}

    </AdminLayout>
  )
}
