import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { GraduationCap, Trophy, BookOpen, Laptop, Bike, Star, ArrowRight } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import { useHomepageData } from '../hooks/useHomepageData'
import useDocumentTitle from '../hooks/useDocumentTitle'

const PartnerPlaceholder = ({ name }) => (
  <div style={{ padding: '12px 24px', background: '#f8fafc', border: '2px solid #e2e8f0', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 10, minWidth: 160 }}>
    <Star size={16} color="#C94E1A" fill="#C94E1A" />
    <span style={{ fontWeight: 800, color: '#1E293B', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>{name}</span>
  </div>
)

const focusAreas = [
  { icon: <GraduationCap size={24} color="var(--danger)" />, title: 'Quality Education', desc: 'Bridging the academic gap with modern teaching methodologies and resource-rich environments for primary and secondary students.', bg: 'bg-soft-red' },
  { icon: <BookOpen size={24} color="var(--dark)" />, title: 'Girl Education', desc: 'Dedicated mentorship and financial support to ensure every girl completes her schooling and pursues higher dreams.', bg: 'bg-soft-blue' },
  { icon: <Trophy size={24} color="var(--danger)" />, title: 'Competitive Coaching', desc: 'Providing resources and training for entrance exams, opening doors to professional careers for rural youth.', bg: 'bg-white border' },
  { icon: <Laptop size={24} color="var(--dark)" />, title: 'Digital Literacy', desc: 'Equipping students with essential computer skills and internet navigation to thrive in a digital economy.', bg: 'bg-soft-purple' },
  { icon: <Bike size={24} color="var(--success)" />, title: 'Sports & Library', desc: 'Fostering physical health through sports and intellectual curiosity via community-managed library hubs.', bg: 'bg-soft-green' },
]

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const { t, language } = useLanguage()
  useDocumentTitle(t('Empowering Rural Literacy & Education'))
  const { stats, news, story, loading } = useHomepageData()

  const heroSlides = [
    {
      image: '/images/hero_main.webp',
      title: 'Lighting the Lamp of Education in Rural India',
      subtitle: 'DVS is dedicated to bridging the educational gap in Jharkhand, empowering rural students.',
    },
    {
      image: '/images/hero1.webp',
      title: 'Right to Education for Every Child',
      subtitle: 'Over 5,000+ students have been empowered so far with scholarships and mentorship.',
    },
    {
      image: '/images/hero2.webp',
      title: 'Digital Literacy for Rural Youth',
      subtitle: 'Equipping students with essential computer skills to thrive in a digital economy.',
    },
    {
      image: '/images/hero3.webp',
      title: 'Empowering Girls through Education',
      subtitle: 'Special scholarships and counseling to ensure every girl achieves her dreams.',
    },
    {
      image: '/images/hero.webp',
      title: 'Join Our Mission Today',
      subtitle: 'Donate, volunteer, or enroll to be part of India\'s largest rural education network.',
    },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % heroSlides.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [heroSlides.length])

  const defaultStats = [
    { stat_value: '5,000+', label: 'Students Helped' },
    { stat_value: '1,200+', label: 'Scholarships Given' },
    { stat_value: '50+', label: 'Events Organized' },
    { stat_value: '₹25 L+', label: 'Donations' },
  ]

  const displayStats = stats && stats.length > 0 ? stats : defaultStats

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero">
        {heroSlides.map((slide, i) => (
          <img 
            key={i} 
            src={slide.image}
            alt={slide.title}
            width="1400"
            height="600"
            className={`hero-slide ${i === currentSlide ? 'active' : ''}`}
            style={{ 
              backgroundColor: '#1c4a5a',
              objectFit: 'cover',
              width: '100%',
              height: '100%',
              position: 'absolute',
              inset: 0
            }} 
            {...(i === 0 ? { fetchpriority: 'high', loading: 'eager' } : { loading: 'lazy' })}
          />
        ))}
        <div className="hero-overlay"></div>
        <div className="hero-content-left container">
          <h1 className="responsive-title" style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, color: 'white', marginBottom: '24px', lineHeight: 1.1 }}>
            {t(heroSlides[currentSlide].title)}
          </h1>
          <p className="hero-subtitle" style={{ fontSize: 'clamp(1rem, 4vw, 1.25rem)', maxWidth: '700px', marginBottom: '40px', color: 'rgba(255,255,255,0.95)', lineHeight: 1.6 }}>
            {t(heroSlides[currentSlide].subtitle)}
          </p>
          <div className="hero-cta" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', width: '100%' }}>
            <Link to="/scholarship/apply" className="btn btn-primary btn-mobile-full" style={{ minWidth: '200px', flex: '1 1 auto' }}>
              {t('Apply For Scholarship')}
            </Link>
            <Link to="/register" className="btn btn-secondary btn-mobile-full" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', borderColor: 'white', minWidth: '200px', flex: '1 1 auto' }}>
              {t('Become a Volunteer')}
            </Link>
          </div>
        </div>
        <div className="hero-dots">
          {heroSlides.map((_, i) => (
            <button key={i} className={`hero-dot ${i === currentSlide ? 'active' : ''}`} onClick={() => setCurrentSlide(i)} aria-label={`${t('Go to slide')} ${i + 1}`} />
          ))}
        </div>
      </section>

      {/* Stats Overlapping Section */}
      <section className="stats-overlap container">
        <div className="grid grid-4">
          {displayStats.map((stat, idx) => (
            <div className="stat-card hover-up" key={idx}>
              <div className="stat-value">{stat.stat_value}</div>
              <div className="stat-label">{t(stat.label)}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Focus Areas - Mission */}
      <section className="section bg-gray">
        <div className="container">
          <div className="grid grid-2" style={{ gap: '48px', alignItems: 'flex-start', marginBottom: '64px' }}>
            <div className="mobile-center-text">
              <p className="pill-red">{t('Our Mission')}</p>
              <h2 className="responsive-h2" style={{ margin: 0 }}>{t('Empowering Communities Through Focused Initiatives')}</h2>
            </div>
            <div className="mobile-hide" style={{ display: 'flex', alignItems: 'flex-start', gap: '24px', paddingTop: '24px' }}>
              <p style={{ color: 'var(--gray-600)', fontSize: '1.15rem', flex: 1, lineHeight: 1.6 }}>
                {t('We provide holistic support systems designed specifically for the rural landscape of Jharkhand.')}
              </p>
              <Link to="/about" className="btn-icon" style={{ background: 'var(--danger)', color: 'white', width: 56, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center' }} aria-label={t('Read more about us')}>
                <BookOpen size={24} />
              </Link>
            </div>
          </div>
          
          <div className="grid grid-3" style={{ gap: '24px' }}>
            {focusAreas.map((area, i) => (
              <div className={`${area.bg} card-soft`} key={i}>
                <div className="focus-icon-circle" style={{ width: 48, height: 48, borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24, boxShadow: 'var(--shadow-sm)' }}>
                  {area.icon}
                </div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: 12 }}>{t(area.title)}</h3>
                <p style={{ color: 'var(--gray-600)', lineHeight: 1.6 }}>{t(area.desc)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Updates */}
      <section className="section bg-white">
        <div className="container">
          <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
            <h2 className="responsive-h2" style={{ margin: 0 }}>{t('Latest Updates')}</h2>
            <Link to="/news" className="text-red flex items-center gap-1" style={{ fontWeight: 600 }}>
              {t('View All News')} <ArrowRight size={16}/>
            </Link>
          </div>
          
          <div className="grid grid-3">
            {(news && news.length > 0 ? news : [1,2,3]).slice(0, 3).map((item, i) => (
              <div className="card-flat" style={{ padding: 0, overflow: 'hidden', border: 'none', boxShadow: 'var(--shadow-md)' }} key={item.id || i}>
                <div style={{ height: 220, background: '#E5E7EB', position: 'relative' }}>
                  <img 
                    src={item.cover_image_url || (i === 0 ? '/images/news-scholarship.webp' : i === 1 ? '/images/news-digital.webp' : '/images/news-community.webp')} 
                    width="400" 
                    height="220" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    alt={item.title || "News cover"} 
                    loading="lazy"
                  />
                </div>
                <div style={{ padding: 24 }}>
                  <span className="pill-red">{t(item.category || (i === 0 ? 'ANNOUNCEMENT' : i === 1 ? 'EVENT' : 'COMMUNITY'))}</span>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: 12, lineHeight: 1.4, color: 'var(--dark)' }}>
                    {item.title ? (language === 'hi' ? (item.title_hindi || item.title) : item.title) : (i===0 ? (language === 'hi' ? '2024 प्रगति छात्रवृत्ति आवेदन अब खुले हैं' : '2024 Pragati Scholarship Applications Now Open') : i===1 ? (language==='hi' ? 'खूंटी में डिजिटल साक्षरता केंद्र शुरू' : 'Digital Literacy Hub Launched in Khunti') : (language === 'hi' ? 'DVS स्वयंसेवक दूरस्थ गुमला गांवों तक पहुंचे' : 'DVS Volunteers Reach Remote Gumla Villages'))}
                  </h3>
                  <p style={{ color: 'var(--gray-500)', fontSize: '0.95rem', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {item.excerpt ? (language === 'hi' ? (item.excerpt_hindi || item.excerpt) : item.excerpt) : (i===0 ? (language === 'hi' ? 'पूरे झारखंड से मेधावी छात्रों से आवेदन आमंत्रित हैं...' : 'Applications are invited from meritorious students across Jharkhand...') : i===1 ? (language==='hi'?'हमारी 5वीं समर्पित कंप्यूटर लैब अब चालू है...':'Our 5th dedicated computer lab is now operational...') : (language==='hi'?'उन तक पहुँचना जो अभी भी दूर हैं...':'Reaching the unreached, distribution of learning kits...'))}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Story Block */}
      <section className="section bg-gray" style={{ padding: '60px 0' }}>
        <div className="container">
          <div className="success-story-card responsive-card-padding" style={{ background: '#A1401D', borderRadius: 'var(--radius-xl)', position: 'relative', overflow: 'hidden', display: 'flex', flexWrap: 'wrap', gap: 48 }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(135deg, rgba(200,60,20,0.9) 0%, rgba(160,50,15,1) 100%)', zIndex: 0 }}></div>
            
            <div style={{ flex: '1 1 350px', zIndex: 1, position: 'relative', color: 'white' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, letterSpacing: '1.5px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px', textTransform: 'uppercase' }}>
                <Star size={14} fill="white"/> {t('SUCCESS STORY')}
              </div>
              <h3 className="responsive-h3" style={{ lineHeight: 1.2, marginBottom: '32px', fontFamily: 'var(--font-heading)', fontWeight: 700 }}>
                {story 
                  ? `"${language === 'hi' ? (story.content_hindi || story.content) : story.content}"`
                  : t('"DVS empowered me to look beyond the boundaries of my village and reach for my dreams."')}
              </h3>
              <p style={{ fontWeight: 700, fontSize: '1.2rem', marginBottom: 4 }}>
                {story ? story.title : t('A DVS Scholar')}
              </p>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.95rem' }}>
                {story ? story.achievement : t('DVS Scholar, Now pursuing higher studies.')}
              </p>
            </div>
            
            <div style={{ flex: '1 1 300px', zIndex: 1, position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
               <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: '380px', padding: '32px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-xl)', border: '2px solid rgba(255,255,255,0.1)' }}>
                  <img 
                    src={story ? (story.photo_url || "/images/success_story.webp") : "/images/success_story.webp"} 
                    width="140" 
                    height="140" 
                    style={{ width: 140, height: 140, borderRadius: '50%', objectFit: 'cover', marginBottom: 24, border: '4px solid #fff' }} 
                    alt={story ? story.title : "Student Portrait"}
                    loading="lazy"
                  />
                  <div style={{ fontSize: '1rem', letterSpacing: '2px', fontWeight: 300, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase' }}>{t('Impact Candidate')}</div>
                  <div style={{ fontSize: '1.25rem', fontStyle: 'italic', fontFamily: 'serif', color: 'white', marginTop: 8 }}>{story ? t(story.category || 'student') : t('Student')}</div>
               </div>
            </div>

            <div className="mobile-hide" style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translate(-50%, 50%)', width: 72, height: 72, background: 'white', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-lg)', zIndex: 2 }}>
              <div style={{ fontSize: '3rem', color: '#A1401D', lineHeight: 0, transform: 'translateY(10px)' }}>”</div>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Marquee Section */}
      <section className="section bg-white" style={{ padding: '60px 0', overflow: 'hidden' }}>
        <div className="container">
          <div className="text-center mb-10">
            <h2 style={{ fontSize: '2rem', marginBottom: '12px', color: 'var(--dark)' }}>{t('Partner Organizations')}</h2>
            <p style={{ color: 'var(--gray-500)', maxWidth: '600px', margin: '0 auto' }}>
              {t('We are proud to collaborate with leading organizations committed to rural development.')}
            </p>
          </div>
          
          <div className="marquee-wrapper" style={{ display: 'flex', width: '200%', overflow: 'hidden', position: 'relative', marginTop: 32 }}>
            <div className="marquee-content" style={{ display: 'flex', gap: '40px', animation: 'marquee 30s linear infinite', alignItems: 'center' }}>
              {['NGO Jharkhand', 'CSR India', 'Digital Mission', 'Rural Education', 'Tribal Welfare', 'Masalia Trust'].map((name, i) => (
                <PartnerPlaceholder key={i} name={name} />
              ))}
              {['NGO Jharkhand', 'CSR India', 'Digital Mission', 'Rural Education', 'Tribal Welfare', 'Masalia Trust'].map((name, i) => (
                <PartnerPlaceholder key={`dup-${i}`} name={name} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @media (max-width: 768px) {
          .hero-dots { bottom: 20px; }
          .stat-card { padding: 20px !important; }
          .stat-value { font-size: 1.8rem !important; }
          .mobile-center-text { text-align: center; }
          .mobile-hide { display: none !important; }
          .focus-icon-circle { margin: 0 auto 20px !important; }
          .card-soft { text-align: center; }
          .home-container .section { padding: 48px 0; }
          .responsive-card-padding { padding: 32px 24px !important; }
          .btn-mobile-full { width: 100% !important; }
        }
      `}</style>

    </div>
  )
}
