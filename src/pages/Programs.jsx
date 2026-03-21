import { Link } from 'react-router-dom'
import { BookOpen, GraduationCap, Heart, Laptop, Bike, Trophy, Users, CheckCircle2, ChevronRight } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import useDocumentTitle from '../hooks/useDocumentTitle'

const programs = [
  {
    icon: <BookOpen size={32} />,
    title: 'Quality Education',
    label: 'Primary & Secondary',
    desc: 'Free coaching, homework help, and personalized learning support for all subjects from Class 1 to 12.',
    features: ['Free tuition classes', 'Subject-wise expert teachers', 'Exam preparation', 'Study material distribution'],
    color: '#3B82F6',
    bg: '#EFF6FF',
  },
  {
    icon: <GraduationCap size={32} />,
    title: 'Scholarship Program',
    label: 'Pragati Initiative',
    desc: 'Monthly/yearly financial aid for meritorious and economically weak students — 100% transparent process.',
    features: ['Merit-based scholarships', 'Need-based support', 'Direct bank transfer', '80G tax certificates'],
    color: '#FF6B35',
    bg: '#FFF5F0',
  },
  {
    icon: <Heart size={32} />,
    title: 'Girl Education',
    label: 'Empower Girls',
    desc: 'Encouraging rural girls for education — special scholarship + mentorship + safety awareness.',
    features: ['Girls-only scholarships', 'Mentorship by women', 'Self-defense training', 'Career counseling'],
    color: '#EC4899',
    bg: '#FDF2F8',
  },
  {
    icon: <Laptop size={32} />,
    title: 'Digital Literacy',
    label: 'Future Skills',
    desc: 'Computer fundamentals, MS Office, internet safety, and basic coding — future-ready skills for rural youth.',
    features: ['Computer basics', 'Internet & email', 'Online safety', 'Basic coding (Scratch)'],
    color: '#8B5CF6',
    bg: '#F5F3FF',
  },
  {
    icon: <Bike size={32} />,
    title: 'Sports & Yoga',
    label: 'Health & Wellness',
    desc: 'Cricket, football, athletics, kabaddi, badminton + daily yoga sessions — both physical and mental fitness.',
    features: ['Cricket & Football', 'Athletics & Kabaddi', 'Yoga & meditation', 'Annual sports meet'],
    color: '#10B981',
    bg: '#ECFDF5',
  },
  {
    icon: <Trophy size={32} />,
    title: 'Competitive Coaching',
    label: 'Career Fast-track',
    desc: 'UPSC, JPSC, Railway, Bank, SSC — free coaching with study material + mock tests + expert mentors.',
    features: ['UPSC & JPSC guidance', 'Railway & Bank prep', 'Weekly mock tests', 'Interview practice'],
    color: '#F59E0B',
    bg: '#FFFBEB',
  },
  {
    icon: <Users size={32} />,
    title: 'Community Development',
    label: 'Village Outreach',
    desc: 'Village-level education awareness, parent meetings, health camps, and environmental awareness drives.',
    features: ['Parent awareness', 'Health checkups', 'Tree planting', 'Village meetings'],
    color: '#06B6D4',
    bg: '#ECFEFF',
  },
]

export default function Programs() {
  const { t } = useLanguage()
  useDocumentTitle(t('Our Educational Programs'))

  return (
    <div className="programs-page">
      <div className="page-header">
        <div className="container">
          <h1 className="hindi">{t('Our Programs')}</h1>
          <p className="hindi" style={{ maxWidth: 650, margin: '16px auto 0' }}>{t('Transforming the educational landscape of rural India through targeted initiatives.')}</p>
          <div className="breadcrumb">
            <Link to="/">{t('Home')}</Link> <span>/</span> <span>{t('Programs')}</span>
          </div>
        </div>
      </div>

      <section className="section bg-gray">
        <div className="container">
          <div className="programs-grid" style={{ display: 'grid', gap: 40 }}>
            {programs.map((prog, i) => (
              <div 
                className="program-card hover-up" 
                key={i} 
                style={{ 
                  display: 'flex', 
                  background: 'white', 
                  borderRadius: 32, 
                  overflow: 'hidden', 
                  boxShadow: 'var(--shadow-md)',
                  flexDirection: i % 2 !== 0 ? 'row-reverse' : 'row'
                }}
              >
                <div className="program-visual responsive-section-padding" style={{ 
                  flex: '1 1 400px', 
                  background: prog.bg, 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{ position: 'absolute', top: -20, right: -20, opacity: 0.1, transform: 'rotate(-15deg)' }}>
                    {prog.icon}
                  </div>
                  <div style={{ 
                    width: 120, 
                    height: 120, 
                    borderRadius: 32, 
                    background: 'white', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    color: prog.color,
                    boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
                    marginBottom: 24,
                    zIndex: 2
                  }}>
                    {prog.icon}
                  </div>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: prog.color, background: 'rgba(255,255,255,0.7)', padding: '6px 16px', borderRadius: 20, zIndex: 2 }}>{t(prog.label)}</span>
                </div>
                
                <div className="program-details responsive-section-padding" style={{ flex: '1.5 1 450px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <h2 className="hindi" style={{ fontSize: '2.25rem', marginBottom: 12, color: 'var(--dark)' }}>{t(prog.title)}</h2>
                  <p className="hindi" style={{ color: 'var(--gray-600)', fontSize: '1.1rem', lineHeight: 1.8, marginBottom: 32 }}>{t(prog.desc)}</p>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    {prog.features.map((f, j) => (
                      <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <CheckCircle2 size={18} color={prog.color} />
                        <span style={{ fontSize: '0.9rem', color: 'var(--dark)', fontWeight: 600 }}>{t(f)}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div style={{ marginTop: 40 }}>
                     <Link to="/register" className="btn" style={{ background: prog.bg, color: prog.color, border: 'none', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                       {t('Enroll Now')} <ChevronRight size={18} />
                     </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hero-like CTA */}
      <section className="section" style={{ background: 'var(--dark)', color: 'white', overflow: 'hidden', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.1, backgroundImage: 'url("/images/hero_pattern.png")', backgroundSize: '200px' }} />
        <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
          <h2 className="responsive-h2" style={{ marginBottom: 16 }}>{t('Ready to Make an Impact?')}</h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', maxWidth: 600, margin: '0 auto 40px', fontSize: '1.15rem' }}>
            {t('Whether you want to learn, teach, or support, there is a place for you in our mission.')}
          </p>
          <div className="flex justify-center gap-3 flex-wrap">
            <Link to="/register" className="btn btn-primary" style={{ minWidth: 200 }}>{t('Join a Program')}</Link>
            <Link to="/donate" className="btn btn-secondary" style={{ minWidth: 200, borderColor: 'white', color: 'white' }}>{t('Support DVS')}</Link>
          </div>
        </div>
      </section>

      <style>{`
        .responsive-section-padding { padding: 60px; }
        @media (max-width: 1023px) {
          .program-card { flexDirection: column !important; }
          .program-visual { padding: 40px !important; flex: 0 0 auto !important; height: 300px; }
          .program-details { padding: 40px !important; flex: 1 1 auto !important; }
          .program-details h2 { font-size: 1.75rem !important; }
          .responsive-section-padding { padding: 40px !important; }
        }
        @media (max-width: 640px) {
          .program-details div[style*="grid-template-columns"] { grid-template-columns: 1fr !important; }
          .program-details { padding: 32px 24px !important; }
          .program-visual { height: 250px; padding: 32px !important; }
          .program-visual div[style*="width: 120"] { width: 80px !important; height: 80px !important; }
          .responsive-section-padding { padding: 32px 20px !important; }
        }
      `}</style>
    </div>
  )
}
