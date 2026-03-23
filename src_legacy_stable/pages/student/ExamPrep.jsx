import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { 
  BookOpen, Video, FileText, Download, Play, 
  Search, Filter, ChevronRight, Award, Clock,
  ExternalLink, GraduationCap, Library, Sparkles
} from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'

export default function StudentExamPrep() {
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState('courses')
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState({
    courses: [],
    videos: [],
    practice: [],
    pyqs: []
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      // 1. Fetch Courses (Programs)
      const { data: programs } = await supabase
        .from('scholarship_programs')
        .select('*')
        .eq('status', 'published')
        .or('name.ilike.%Coaching%,name.ilike.%Course%,name.ilike.%Prep%')

      const formattedCourses = (programs || []).map(p => ({
        id: p.id,
        title: p.name,
        category: p.target_group,
        icon: <Library size={24} />,
        students: p.current_applicants || 0
      }))

      // 2. Fetch Videos
      const { data: materials } = await supabase
        .from('study_materials')
        .select('*')

      const videoList = (materials || []).filter(m => m.file_type === 'video').map(v => ({
        id: v.id,
        title: v.title,
        duration: '30:00', // Mock for now until we have metadata
        teacher: 'DVS Faculty',
        views: v.download_count || 0,
        thumbnail: '/images/news-digital.png'
      }))

      const pyqList = (materials || []).filter(m => m.tags?.includes('pyq')).map(p => ({
        year: p.tags?.find(t => !isNaN(t)) || '2023',
        exam: p.exam_type,
        subject: p.subject,
        link: p.file_url
      }))

      // 3. Fetch Tests from real table
      const { data: tests } = await supabase
        .from('tests')
        .select('*')
        .order('created_at', { ascending: false })

      const testList = (tests || []).map(t => ({
        id: t.id,
        name: t.name,
        subject: t.subject,
        duration: t.duration,
        questions: t.questions_count,
        status: t.status
      }))

      setData({
        courses: formattedCourses,
        videos: videoList,
        pyqs: pyqList,
        practice: testList
      })
    } catch (error) {
      console.error('Error fetching exam prep data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div style={{ padding: 100, textAlign: 'center' }} className="hindi">{t('Loading preparation resources...')}</div>
  }

  return (
    <div style={{ padding: '32px' }}>
      
      {/* Search & Welcome */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
        <div>
           <h1 className="hindi" style={{ fontSize: '2rem', fontWeight: 800, color: '#111' }}>{t('Competitive Exam Coaching')}</h1>
           <p className="hindi" style={{ color: '#64748b', marginTop: 4 }}>{t('Quality preparation for UPSC, JPSC, Railway, Bank, and SSC - free of cost.')}</p>
        </div>
        <div style={{ position: 'relative', width: 340 }}>
           <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)' }} />
           <input className="hindi" placeholder={t('Search exams, subjects, or videos...')} style={{ width: '100%', padding: '14px 16px 14px 48px', borderRadius: 12, border: '1px solid #e2e8f0', fontSize: '0.9rem', outline: 'none', background: 'white', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }} />
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 32, marginBottom: 32, borderBottom: '1px solid #f1f5f9' }}>
        {[
          { id: 'courses', label: t('Exam Courses'), icon: <BookOpen size={18} /> },
          { id: 'videos', label: t('Video Lectures'), icon: <Video size={18} /> },
          { id: 'practice', label: t('Practice Tests'), icon: <FileText size={18} /> },
          { id: 'pyq', label: t('Previous Year Qs'), icon: <Library size={18} /> }
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '16px 4px', border: 'none', background: 'none', color: activeTab === tab.id ? '#1d4ed8' : '#94a3b8', fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer', position: 'relative', transition: 'all 0.2s' }}>
            {tab.icon} {tab.label}
            {activeTab === tab.id && <div style={{ position: 'absolute', bottom: -1, left: 0, right: 0, height: 3, background: '#1d4ed8', borderRadius: '3px 3px 0 0' }}></div>}
          </button>
        ))}
      </div>

      {activeTab === 'courses' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
           {data.courses.length > 0 ? data.courses.map(course => (
             <div key={course.id} style={{ background: 'white', borderRadius: 20, border: '1px solid #e2e8f0', padding: 24, transition: 'all 0.3s', cursor: 'pointer', position: 'relative' }} onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.06)'; }} onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                <div style={{ width: 56, height: 56, background: '#eff6ff', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1d4ed8', marginBottom: 20 }}>{course.icon}</div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1e293b', marginBottom: 8 }}>{course.title}</h3>
                <div className="hindi" style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>{course.category}</div>
                <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: 16 }}>
                   <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{course.students} {t('enrolled')}</div>
                   <ChevronRight size={18} color="#1d4ed8" />
                </div>
             </div>
           )) : <div className="hindi">{t('No courses found at the moment.')}</div>}
        </div>
      )}

      {activeTab === 'videos' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
           {data.videos.length > 0 ? data.videos.map(video => (
             <div key={video.id} style={{ background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', padding: 20, display: 'flex', gap: 20, alignItems: 'center' }}>
                <div style={{ width: 140, height: 80, background: '#f8fafc', borderRadius: 12, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                   <Video size={32} color="#cbd5e1" />
                   <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.1)', cursor: 'pointer' }}><Play size={24} color="white" fill="white" /></div>
                   <div style={{ position: 'absolute', bottom: 6, right: 6, background: 'rgba(0,0,0,0.7)', color: 'white', fontSize: '0.65rem', padding: '2px 4px', borderRadius: 4 }}>{video.duration}</div>
                </div>
                <div style={{ flex: 1 }}>
                   <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#111' }}>{video.title}</h4>
                   <div className="hindi" style={{ fontSize: '0.8rem', color: '#64748b', marginTop: 4 }}>{t('Instructor')}: {video.teacher} • {video.views} {t('views')}</div>
                </div>
                <button style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #e2e8f0', background: 'white', fontSize: '0.8rem', fontWeight: 700, color: '#4b5563', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}><ExternalLink size={14} /> {t('Watch Now')}</button>
             </div>
           )) : <div className="hindi">{t('No video lectures available.')}</div>}
        </div>
      )}

      {activeTab === 'practice' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 24 }}>
           {data.practice.map(test => (
             <div key={test.id} style={{ background: 'white', borderRadius: 20, padding: 28, border: '1px solid #e2e8f0' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                  <div style={{ padding: 10, background: '#f8fafc', borderRadius: 12, color: '#1d4ed8' }}><FileText size={24} /></div>
                  <span style={{ padding: '4px 10px', background: test.status === 'Live' ? '#f0fdf4' : '#f8fafc', color: test.status === 'Live' ? '#16a34a' : '#64748b', fontSize: '0.7rem', fontWeight: 800, borderRadius: 20 }}>{t(test.status)}</span>
               </div>
               <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: 8 }}>{test.name}</h3>
               <p className="hindi" style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: 24 }}>{t(test.subject)}</p>
               <div style={{ display: 'flex', gap: 20, marginBottom: 24 }}>
                  <div>
                    <div style={{ fontSize: '0.65rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>{t('Duration')}</div>
                    <div style={{ fontWeight: 700 }}>{test.duration}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.65rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>{t('Questions')}</div>
                    <div style={{ fontWeight: 700 }}>{test.questions} Qs</div>
                  </div>
               </div>
               <button className="hindi" style={{ width: '100%', padding: '12px', borderRadius: 10, background: '#1d4ed8', color: 'white', border: 'none', fontWeight: 700, cursor: 'pointer' }}>{t('Start Test')}</button>
             </div>
           ))}
        </div>
      )}

      {activeTab === 'pyq' && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
           <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                 <tr style={{ background: '#f8fafc' }}>
                    <th className="hindi" style={{ padding: '16px 24px', fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>{t('Year')}</th>
                    <th className="hindi" style={{ padding: '16px 24px', fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>{t('Exam Name')}</th>
                    <th className="hindi" style={{ padding: '16px 24px', fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>{t('Subject')}</th>
                    <th className="hindi" style={{ padding: '16px 24px', fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>{t('Action')}</th>
                 </tr>
              </thead>
              <tbody>
                 {data.pyqs.length > 0 ? data.pyqs.map((q, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                       <td style={{ padding: '16px 24px', fontWeight: 700 }}>{q.year}</td>
                       <td style={{ padding: '16px 24px', fontWeight: 700 }}>{q.exam}</td>
                       <td style={{ padding: '16px 24px', color: '#64748b' }}>{q.subject}</td>
                       <td style={{ padding: '16px 24px' }}>
                          <button onClick={() => window.open(q.link, '_blank')} style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #e2e8f0', background: 'white', display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}><Download size={14} /> {t('PDF')}</button>
                       </td>
                    </tr>
                 )) : <tr><td colSpan="4" className="hindi" style={{ padding: 40, textAlign: 'center' }}>{t('No PYQs available.')}</td></tr>}
              </tbody>
           </table>
        </div>
      )}

    </div>
  )
}
