import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { GraduationCap, Heart, Trophy, BookOpen, Laptop, Bike, Star, ArrowRight } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

const focusAreas = [
  { icon: <GraduationCap size={24} color="var(--danger)" />, title: 'Quality Education', desc: 'Bridging the academic gap with modern teaching methodologies and resource-rich environments for primary and secondary students.', bg: 'bg-soft-red' },
  { icon: <BookOpen size={24} color="var(--dark)" />, title: 'Girl Education', desc: 'Dedicated mentorship and financial support to ensure every girl completes her schooling and pursues higher dreams.', bg: 'bg-soft-blue' },
  { icon: <Trophy size={24} color="var(--danger)" />, title: 'Competitive Coaching', desc: 'Providing resources and training for entrance exams, opening doors to professional careers for rural youth.', bg: 'bg-white border' },
  { icon: <Laptop size={24} color="var(--dark)" />, title: 'Digital Literacy', desc: 'Equipping students with essential computer skills and internet navigation to thrive in a digital economy.', bg: 'bg-soft-purple' },
  { icon: <Bike size={24} color="var(--success)" />, title: 'Sports & Library', desc: 'Fostering physical health through sports and intellectual curiosity via community-managed library hubs.', bg: 'bg-soft-green' },
]

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [stats, setStats] = useState([])
  const [news, setNews] = useState([])
  const [stories, setStories] = useState([])
  const { t, language } = useLanguage()

  const heroSlides = [
    {
      // Using local high-quality asset for primary hero
      image: '/images/hero_main.png',
      title: 'Lighting the Lamp of Education in Rural India',
      subtitle: 'DVS is dedicated to bridging the educational gap in Jharkhand, empowering rural students.',
    },
    {
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=1400',
      title: 'Right to Education for Every Child',
      subtitle: 'Over 5,000+ students have been empowered so far with scholarships and mentorship.',
    },
    {
      image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=1400',
      title: 'Digital Literacy for Rural Youth',
      subtitle: 'Equipping students with essential computer skills to thrive in a digital economy.',
    },
    {
      image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=1400',
      title: 'Empowering Girls through Education',
      subtitle: 'Special scholarships and counseling to ensure every girl achieves her dreams.',
    },
    {
      image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=1400',
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

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    const [statsRes, newsRes, storiesRes] = await Promise.all([
      supabase.from('homepage_stats').select('*').order('sort_order'),
      supabase.from('news_articles').select('*').eq('status', 'published').order('published_at', { ascending: false }).limit(3),
      supabase.from('success_stories').select('*').eq('is_approved', true).eq('is_featured', true).limit(1), 
    ])
    if (statsRes.data) setStats(statsRes.data)
    if (newsRes.data) setNews(newsRes.data)
    if (storiesRes.data) setStories(storiesRes.data)
  }

  const defaultStats = [
    { stat_value: '5,000+', label: 'Students Helped' },
    { stat_value: '1,200+', label: 'Scholarships Given' },
    { stat_value: '50+', label: 'Events Organized' },
    { stat_value: '₹25 L+', label: 'Donations' },
  ]

  const displayStats = stats.length > 0 ? stats.map(s => ({ stat_value: s.stat_value, label: language === 'en' ? s.label_en : s.label_hi })) : defaultStats

  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        {heroSlides.map((slide, i) => (
          <div key={i} className={`hero-slide ${i === currentSlide ? 'active' : ''}`}
            style={{ backgroundImage: `url(${slide.image})`, backgroundColor: '#1c4a5a' }} />
        ))}
        <div className="hero-overlay"></div>
        <div className="hero-content-left">
          <h2 className="responsive-title" style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, color: 'white', marginBottom: '24px', lineHeight: 1.1 }}>
            {t(heroSlides[currentSlide].title)}
          </h2>
          <p style={{ fontSize: '1.25rem', maxWidth: '700px', marginBottom: '40px', color: 'rgba(255,255,255,0.95)', lineHeight: 1.6 }}>
            {t(heroSlides[currentSlide].subtitle)}
          </p>
          <div className="hero-cta" style={{ justifyContent: 'flex-start' }}>
            <Link to="/student/apply" className="btn btn-secondary" style={{ border: 'none', color: 'var(--dvs-orange)', fontWeight: 700, paddingLeft: 0, fontSize: '1.1rem' }}>
              {t('Apply For Scholarship')}
            </Link>
            <Link to="/register" className="btn btn-primary" style={{ background: 'rgba(92, 64, 51, 0.9)', borderColor: 'rgba(92, 64, 51, 0.9)', color: 'white' }}>
              {t('Become a Volunteer')}
            </Link>
          </div>
        </div>
        <div className="hero-dots">
          {heroSlides.map((_, i) => (
            <button key={i} className={`hero-dot ${i === currentSlide ? 'active' : ''}`} onClick={() => setCurrentSlide(i)} />
          ))}
        </div>
      </section>

      {/* Stats Overlapping Section */}
      <section className="stats-overlap container">
        <div className="grid grid-4">
          {displayStats.map((stat, idx) => (
            <div className="stat-card hover-up" key={idx} style={{ background: 'white', borderRadius: 20, padding: 32, textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
              <div className="stat-value" style={{ color: '#FF6B35', fontSize: '2.5rem', fontWeight: 900, marginBottom: 8 }}>{stat.stat_value}</div>
              <div className="stat-label" style={{ color: '#64748b', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '1px' }}>{t(stat.label)}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Focus Areas - Mission */}
      <section className="section bg-gray" style={{ marginTop: 60, paddingBottom: 100 }}>
        <div className="container">
          <div className="grid grid-2" style={{ gap: '48px', alignItems: 'flex-start', marginBottom: '64px' }}>
            <div>
              <p className="pill-red">{t('Our Mission')}</p>
              <h2 className="responsive-h2" style={{ margin: 0, color: 'var(--dark)' }}>{t('Empowering Communities Through Focused Initiatives')}</h2>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '24px', paddingTop: '24px' }}>
              <p style={{ color: 'var(--gray-600)', fontSize: '1.15rem', flex: 1, lineHeight: 1.6 }}>
                {t('We provide holistic support systems designed specifically for the rural landscape of Jharkhand.')}
              </p>
              <Link to="/about" className="btn-icon" style={{ background: 'var(--danger)', color: 'white', width: 56, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BookOpen size={24} />
              </Link>
            </div>
          </div>
          
          <div className="grid grid-3" style={{ gap: '24px' }}>
            {focusAreas.map((area, i) => (
              <div className={`${area.bg} card-soft`} key={i} style={{ gridColumn: i === 0 ? 'span 1' : 'span 1', gridRow: i === 0 ? 'span 2' : 'span 1' }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24, boxShadow: 'var(--shadow-sm)' }}>
                  {area.icon}
                </div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: 12 }}>{t(area.title)}</h3>
                <p style={{ color: 'var(--gray-600)', lineHeight: 1.6 }}>{t(area.desc)}</p>
                {i === 0 && (
                  <div style={{ marginTop: 'auto', paddingTop: 24, display: 'flex', justifyContent: 'flex-end', opacity: 0.1 }}>
                    <BookOpen size={120} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Updates */}
      <section className="section bg-gray">
        <div className="container">
          <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
            <h2 className="responsive-h2" style={{ margin: 0 }}>{t('Latest Updates')}</h2>
            <Link to="/news" className="text-red flex items-center gap-1" style={{ fontWeight: 600 }}>
              {t('View All News')} <ArrowRight size={16}/>
            </Link>
          </div>
          
          <div className="grid grid-3">
            {news.length > 0 ? news.slice(0, 3).map((item, i) => (
              <div className="card-flat" style={{ padding: 0, overflow: 'hidden' }} key={item.id}>
                <div style={{ height: 200, background: 'var(--gray-200)', backgroundImage: `url(https://source.unsplash.com/random/800x600?education,india,${i})`, backgroundSize: 'cover' }}></div>
                <div style={{ padding: 24 }}>
                  <span className="pill-red">{t(item.category || 'ANNOUNCEMENT')}</span>
                  <h4 style={{ fontSize: '1.2rem', marginBottom: 12, lineHeight: 1.4 }}>{language === 'hi' ? (item.title_hi || item.title) : item.title}</h4>
                  <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {language === 'hi' ? (item.content_hi || item.content) : item.content}
                  </p>
                </div>
              </div>
            )) : (
              [1,2,3].map(i => (
                <div className="card-flat" style={{ padding: 0, overflow: 'hidden', border: 'none', boxShadow: 'var(--shadow-md)' }} key={i}>
                  <div style={{ height: 220, background: '#E5E7EB', position: 'relative' }}>
                    <img src={`https://images.unsplash.com/photo-1544256718-3baf237f3974?q=80&w=800&auto=format&fit=crop&sig=${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="News cover" />
                  </div>
                  <div style={{ padding: 24 }}>
                    <span className="pill-red">{t(i===1 ? 'ANNOUNCEMENT' : i===2 ? 'EVENT' : 'COMMUNITY')}</span>
                    <h4 style={{ fontSize: '1.25rem', marginBottom: 12, lineHeight: 1.4, color: 'var(--dark)' }}>
                      {i===1 ? (language === 'hi' ? '2024 प्रगति छात्रवृत्ति आवेदन अब खुले हैं' : '2024 Pragati Scholarship Applications Now Open') : i===2 ? (language==='hi' ? 'खूंटी में डिजिटल साक्षरता केंद्र शुरू' : 'Digital Literacy Hub Launched in Khunti') : (language === 'hi' ? 'DVS स्वयंसेवक दूरस्थ गुमला गांवों तक पहुंचे' : 'DVS Volunteers Reach Remote Gumla Villages')}
                    </h4>
                    <p style={{ color: 'var(--gray-500)', fontSize: '0.95rem', lineHeight: 1.5 }}>
                      {i===1 ? (language === 'hi' ? 'पूरे झारखंड से मेधावी छात्रों से आवेदन आमंत्रित हैं...' : 'Applications are invited from meritorious students across Jharkhand...') : i===2 ? (language==='hi'?'हमारी 5वीं समर्पित कंप्यूटर लैब अब चालू है...':'Our 5th dedicated computer lab is now operational...') : (language==='hi'?'उन तक पहुँचना जो अभी भी दूर हैं...':'Reaching the unreached, distribution of learning kits...')}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Success Story Block */}
      <section className="section bg-white">
        <div className="container" style={{ padding: '40px 0' }}>
          {stories.length > 0 ? (
            <div className="success-story-card" style={{ background: '#A1401D', borderRadius: 'var(--radius-xl)', padding: '64px', position: 'relative', overflow: 'hidden', display: 'flex', flexWrap: 'wrap', gap: 48 }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(135deg, rgba(200,60,20,0.9) 0%, rgba(160,50,15,1) 100%)', zIndex: 0 }}></div>
              
              <div style={{ flex: '1 1 300px', zIndex: 1, position: 'relative', color: 'white' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, letterSpacing: '1.5px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px', textTransform: 'uppercase' }}>
                  <Star size={14} fill="white"/> {t('SUCCESS STORY')}
                </div>
                <h3 className="responsive-h3" style={{ lineHeight: 1.2, marginBottom: '32px', fontFamily: 'var(--font-heading)', fontWeight: 700 }}>
                  "{language === 'hi' ? (stories[0].content_hi || stories[0].content) : stories[0].content}"
                </h3>
                <p style={{ fontWeight: 700, fontSize: '1.2rem', marginBottom: 4 }}>{stories[0].title}</p>
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.95rem' }}>{stories[0].achievement}</p>
              </div>
              
              <div style={{ flex: '1 1 300px', zIndex: 1, position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                 <div style={{ background: '#1c4a5a', borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: '400px', height: '100%', minHeight: '350px', padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-xl)', border: '4px solid rgba(255,255,255,0.1)' }}>
                    <img src={stories[0].photo_url || "/images/success_story.png"} style={{ width: 150, height: 150, borderRadius: '50%', objectFit: 'cover', marginBottom: 24, border: '4px solid #fff', filter: 'contrast(1.1)' }} alt="Student Portrait" />
                    <div style={{ fontSize: '1.1rem', letterSpacing: '3px', fontWeight: 300, color: 'rgba(255,255,255,0.7)' }}>{t('SUCCESS STORY')}</div>
                    <div style={{ fontSize: '1.4rem', fontStyle: 'italic', fontFamily: 'serif', color: '#6fbddb' }}>{t(stories[0].category || 'student')}</div>
                 </div>
              </div>

              <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translate(-50%, 50%)', width: 72, height: 72, background: 'white', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-lg)', zIndex: 2 }}>
                <div style={{ fontSize: '3rem', color: '#A1401D', lineHeight: 0, transform: 'translateY(10px)' }}>”</div>
              </div>
            </div>
          ) : (
            <div className="success-story-card" style={{ background: '#A1401D', borderRadius: 'var(--radius-xl)', padding: '64px', position: 'relative', overflow: 'hidden', display: 'flex', flexWrap: 'wrap', gap: 48 }}>
              {/* Fallback to hardcoded if no featured story exists in DB */}
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(135deg, rgba(200,60,20,0.9) 0%, rgba(160,50,15,1) 100%)', zIndex: 0 }}></div>
              <div style={{ flex: '1 1 300px', zIndex: 1, position: 'relative', color: 'white' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, letterSpacing: '1.5px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px', textTransform: 'uppercase' }}>
                  <Star size={14} fill="white"/> {t('SUCCESS STORY')}
                </div>
                <h3 className="responsive-h3" style={{ lineHeight: 1.2, marginBottom: '32px', fontFamily: 'var(--font-heading)', fontWeight: 700 }}>
                  {t('"DVS empowered me to look beyond the boundaries of my village and reach for my dreams."')}
                </h3>
                <p style={{ fontWeight: 700, fontSize: '1.2rem', marginBottom: 4 }}>{t('A DVS Scholar')}</p>
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.95rem' }}>{t('DVS Scholar, Now pursuing higher studies.')}</p>
              </div>
              <div style={{ flex: '1 1 300px', zIndex: 1, position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                 <div style={{ background: '#1c4a5a', borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: '400px', height: '100%', minHeight: '350px', padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-xl)', border: '4px solid rgba(255,255,255,0.1)' }}>
                    <img src="/images/success_story.png" style={{ width: 150, height: 150, borderRadius: '50%', objectFit: 'cover', marginBottom: 24, border: '4px solid #fff', filter: 'contrast(1.1)' }} alt="Student Portrait" />
                    <div style={{ fontSize: '1.1rem', letterSpacing: '3px', fontWeight: 300, color: 'rgba(255,255,255,0.7)' }}>{t('SUCCESS STORY')}</div>
                    <div style={{ fontSize: '1.4rem', fontStyle: 'italic', fontFamily: 'serif', color: '#6fbddb' }}>{t('student')}</div>
                 </div>
              </div>
              <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translate(-50%, 50%)', width: 72, height: 72, background: 'white', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-lg)', zIndex: 2 }}>
                <div style={{ fontSize: '3rem', color: '#A1401D', lineHeight: 0, transform: 'translateY(10px)' }}>”</div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Partner Marquee Section */}
      <section className="section bg-gray" style={{ padding: '60px 0', borderTop: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <div className="container">
          <div className="text-center mb-10">
            <h2 style={{ fontSize: '2rem', marginBottom: '12px', color: 'var(--dark)' }}>{t('Partner Organizations')}</h2>
            <p style={{ color: 'var(--gray-500)', maxWidth: '600px', margin: '0 auto' }}>
              {t('We are proud to collaborate with leading organizations committed to rural development.')}
            </p>
          </div>
          
          <div className="marquee-wrapper" style={{ display: 'flex', width: '200%', overflow: 'hidden', position: 'relative' }}>
            <div className="marquee-content" style={{ display: 'flex', gap: '80px', animation: 'marquee 30s linear infinite' }}>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="partner-logo" style={{ filter: 'grayscale(100%)', transition: 'filter 0.3s ease', cursor: 'pointer' }}>
                  <img 
                    src={`https://images.unsplash.com/photo-1599305445671-ac291c95aba9?w=200&h=100&fit=crop&q=80&sig=${i}`} 
                    alt={`Partner ${i}`} 
                    style={{ height: '50px', width: 'auto', objectFit: 'contain' }}
                    onMouseOver={(e) => e.currentTarget.parentElement.style.filter = 'grayscale(0%)'}
                    onMouseOut={(e) => e.currentTarget.parentElement.style.filter = 'grayscale(100%)'}
                  />
                </div>
              ))}
              {/* Duplicate for seamless loop */}
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={`dup-${i}`} className="partner-logo" style={{ filter: 'grayscale(100%)', transition: 'filter 0.3s ease', cursor: 'pointer' }}>
                  <img 
                    src={`https://images.unsplash.com/photo-1599305445671-ac291c95aba9?w=200&h=100&fit=crop&q=80&sig=${i}`} 
                    alt={`Partner ${i}`} 
                    style={{ height: '50px', width: 'auto', objectFit: 'contain' }}
                    onMouseOver={(e) => e.currentTarget.parentElement.style.filter = 'grayscale(0%)'}
                    onMouseOut={(e) => e.currentTarget.parentElement.style.filter = 'grayscale(100%)'}
                  />
                </div>
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
      `}</style>

    </>
  )
}
