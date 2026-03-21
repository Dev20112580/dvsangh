import { Link } from 'react-router-dom'
import { BookOpen, GraduationCap, Heart, Laptop, Bike, Trophy, Users } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

const programs = [
  {
    icon: <BookOpen size={32} />,
    title: 'Quality Education',
    desc: 'Free coaching, homework help, and personalized learning support for all subjects from Class 1 to 12.',
    features: ['Free tuition classes', 'Subject-wise expert teachers', 'Exam preparation', 'Study material distribution'],
    color: '#3B82F6',
    bg: '#EFF6FF',
  },
  {
    icon: <GraduationCap size={32} />,
    title: 'Scholarship Program',
    desc: 'Monthly/yearly financial aid for meritorious and economically weak students — 100% transparent process.',
    features: ['Merit-based scholarships', 'Need-based support', 'Direct bank transfer', '80G tax certificates'],
    color: '#FF6B35',
    bg: '#FFF5F0',
  },
  {
    icon: <Heart size={32} />,
    title: 'Girl Education',
    desc: 'Encouraging rural girls for education — special scholarship + mentorship + safety awareness.',
    features: ['Girls-only scholarships', 'Mentorship by women', 'Self-defense training', 'Career counseling'],
    color: '#EC4899',
    bg: '#FDF2F8',
  },
  {
    icon: <Laptop size={32} />,
    title: 'Digital Literacy',
    desc: 'Computer fundamentals, MS Office, internet safety, and basic coding — future-ready skills for rural youth.',
    features: ['Computer basics', 'Internet & email', 'Online safety', 'Basic coding (Scratch)'],
    color: '#8B5CF6',
    bg: '#F5F3FF',
  },
  {
    icon: <Bike size={32} />,
    title: 'Sports & Yoga',
    desc: 'Cricket, football, athletics, kabaddi, badminton + daily yoga sessions — both physical and mental fitness.',
    features: ['Cricket & Football', 'Athletics & Kabaddi', 'Yoga & meditation', 'Annual sports meet'],
    color: '#10B981',
    bg: '#ECFDF5',
  },
  {
    icon: <Trophy size={32} />,
    title: 'Competitive Coaching',
    desc: 'UPSC, JPSC, Railway, Bank, SSC — free coaching with study material + mock tests + expert mentors.',
    features: ['UPSC & JPSC guidance', 'Railway & Bank prep', 'Weekly mock tests', 'Interview practice'],
    color: '#F59E0B',
    bg: '#FFFBEB',
  },
  {
    icon: <Users size={32} />,
    title: 'Community Development',
    desc: 'Village-level education awareness, parent meetings, health camps, and environmental awareness drives.',
    features: ['Parent awareness', 'Health checkups', 'Tree planting', 'Village meetings'],
    color: '#06B6D4',
    bg: '#ECFEFF',
  },
]

export default function Programs() {
  const { t, language } = useLanguage()

  return (
    <>
      <div className="page-header">
        <h1 className="hindi">{t('Our Programs')}</h1>
        <p className="hindi">{t('DVS initiatives for education and holistic development')}</p>
        <div className="breadcrumb">
          <Link to="/">{t('Home')}</Link> <span>/</span> <span>{t('Programs')}</span>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            {programs.map((prog, i) => (
              <div className="card" key={i} style={{ display: 'flex', gap: 32, alignItems: 'flex-start', flexWrap: 'wrap', borderLeft: `4px solid ${prog.color}` }}>
                <div style={{ flex: '0 0 80px' }}>
                  <div style={{ width: 72, height: 72, borderRadius: 'var(--radius-md)', background: prog.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: prog.color }}>
                    {prog.icon}
                  </div>
                </div>
                <div style={{ flex: 1, minWidth: 280 }}>
                  <h3 className="hindi" style={{ marginBottom: 4 }}>{t(prog.title)}</h3>
                  <p style={{ color: 'var(--gray-400)', fontSize: '0.8rem', marginBottom: 12 }}>{prog.title}</p>
                  <p className="hindi" style={{ color: 'var(--gray-600)', lineHeight: 1.7, marginBottom: 16 }}>{t(prog.desc)}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {prog.features.map((f, j) => (
                      <span key={j} className="badge" style={{ background: prog.bg, color: prog.color }}>{t(f)}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'var(--dvs-orange-bg)', padding: '60px 24px', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: 600 }}>
          <h2 className="hindi" style={{ marginBottom: 12 }}>{t('Participate in these Programs')}</h2>
          <p className="hindi" style={{ color: 'var(--gray-600)', marginBottom: 24 }}>
            {t('Contribute as a student, volunteer, or donor')}
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-primary">📚 {t('Become a Student')}</Link>
            <Link to="/donate" className="btn btn-secondary">💝 {t('Donate Now')}</Link>
          </div>
        </div>
      </section>
    </>
  )
}
