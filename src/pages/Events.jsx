import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { 
  Calendar, MapPin, Users, Clock, 
  Share2, Phone, Mail, ExternalLink, 
  ArrowRight, Info, CheckCircle2,
  Footprints, BookOpen, Dumbbell, Hammer,
  Monitor, GraduationCap, Heart, Activity, Trophy, Leaf
} from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

// --- Internal Components ---

const CountdownTimer = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime()
      const distance = new Date(targetDate).getTime() - now

      if (distance < 0) {
        clearInterval(timer)
        return
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  return (
    <div className="countdown-container">
      <div className="countdown-item">
        <span className="count">{timeLeft.days}</span>
        <span className="label">Days</span>
      </div>
      <div className="countdown-item">
        <span className="count">{timeLeft.hours}</span>
        <span className="label">Hrs</span>
      </div>
      <div className="countdown-item">
        <span className="count">{timeLeft.minutes}</span>
        <span className="label">Min</span>
      </div>
      <div className="countdown-item">
        <span className="count">{timeLeft.seconds}</span>
        <span className="label">Sec</span>
      </div>
    </div>
  )
}

const Badge = ({ children, color = 'orange', variant = 'solid' }) => (
  <span className={`event-badge badge-${color} badge-${variant}`}>
    {children}
  </span>
)

// --- Main Page Component ---

export default function Events() {
  const { language, t } = useLanguage()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  // Fallback data as requested
  const fallbackEvents = [
    {
      id: 'featured-1',
      title: 'संस्थापक सदस्य चयन बैठक',
      title_en: 'Founder Members Selection Meeting',
      date: '2026-03-22T09:00:00',
      location: 'सामुदायिक पुस्तकालय, जेरुवा (Community Library, Jeruwa)',
      mode: 'offline',
      status: 'upcoming',
      is_featured: true,
      category: 'Organizational Meeting',
      description_hi: `द्रोणाचार्य विद्यार्थी संघ (DVS) की स्थापना हेतु संस्थापक सदस्यों के चयन की बैठक। 
      इस बैठक में निम्नलिखित विषयों पर निर्णय लिया जाएगा:
      - संस्था की रूपरेखा एवं उद्देश्य
      - नियम एवं सदस्यता प्रक्रिया
      - शिक्षा, डिजिटल साक्षरता, महिला सशक्तिकरण, योग एवं सामाजिक जागरूकता कार्यक्रम
      - ग्रामीण क्षेत्रों में DVS की भूमिका`,
      description_en: `Meeting for selection of Founder Members of Dronacharya Vidyarthi Sangh (DVS). 
      Agenda:
      - Organization structure and objectives
      - Rules and membership process
      - Programs for education, digital literacy, women empowerment, yoga & social awareness
      - DVS role in rural development`,
      invitation_quote: "यदि आप समाज के उत्थान, शिक्षा के विकास, महिला सशक्तिकरण, योग के प्रसार एवं युवाओं के भविष्य निर्माण में अपना योगदान देना चाहते हैं, तो आप हमारे साथ जुड़कर इस नेक पहल का हिस्सा बन सकते हैं।"
    }
  ]

  const comingSoonPrograms = [
    { icon: <Monitor size={24} />, title: "डिजिटल साक्षरता शिविर", title_en: "Digital Literacy Camp", color: "#3B82F6", desc: "ग्रामीण युवाओं को कंप्यूटर, इंटरनेट और डिजिटल भुगतान की निःशुल्क ट्रेनिंग" },
    { icon: <GraduationCap size={24} />, title: "निःशुल्क कोचिंग कार्यक्रम", title_en: "Free Coaching Program", color: "#10B981", desc: "UPSC, JPSC, Railway, Bank परीक्षाओं के लिए निःशुल्क मार्गदर्शन" },
    { icon: <Heart size={24} />, title: "बालिका शिक्षा अभियान", title_en: "Girl Education Drive", color: "#EC4899", desc: "लड़कियों की शिक्षा और सशक्तिकरण के लिए विशेष कार्यक्रम" },
    { icon: <Activity size={24} />, title: "योग एवं स्वास्थ्य शिविर", title_en: "Activity & Health Camp", color: "#F59E0B", desc: "ग्रामीण क्षेत्रों में निःशुल्क योग प्रशिक्षण और स्वास्थ्य जागरूकता" },
    { icon: <Trophy size={24} />, title: "खेल प्रतियोगिता", title_en: "Sports Tournament", color: "#8B5CF6", desc: "युवाओं में आत्मविश्वास और नेतृत्व क्षमता विकसित करने के लिए खेल प्रतियोगिता" },
    { icon: <Leaf size={24} />, title: "ग्रामीण विकास अभियान", title_en: "Rural Development Drive", color: "#06B6D4", desc: "स्वच्छता, जल संरक्षण और पर्यावरण जागरूकता कार्यक्रम" }
  ]

  useEffect(() => {
    async function fetchEvents() {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .order('event_date', { ascending: true })
        
        if (error) throw error
        if (data && data.length > 0) setEvents(data)
        else setEvents(fallbackEvents)
      } catch (err) {
        console.error('Error fetching events:', err)
        setEvents(fallbackEvents)
      } finally {
        setLoading(false)
      }
    }
    fetchEvents()
  }, [])

  const handleWhatsAppShare = (title) => {
    const url = window.location.href
    const text = `DVS NGO Event: ${title}\nCheck it out here: ${url}`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
  }

  const featuredEvent = events.find(e => e.is_featured || e.id === 'featured-1')
  const upcomingEvents = events.filter(e => e.status === 'upcoming' && !e.is_featured && e.id !== 'featured-1')
  const completedEvents = events.filter(e => e.status === 'completed')

  return (
    <div className="events-page">
      {/* Dynamic Styles for the beautiful NGO feel */}
      <style>{`
        .events-hero {
          background: linear-gradient(135deg, #FF6B35 0%, #FF9F1C 100%);
          color: white;
          padding: 100px 20px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .events-hero::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -10%;
          width: 60%;
          height: 200%;
          background: rgba(255,255,255,0.05);
          transform: rotate(30deg);
          pointer-events: none;
        }
        .hero-honest-msg {
          background: rgba(0,0,0,0.1);
          padding: 8px 16px;
          border-radius: 99px;
          font-size: 0.9rem;
          display: inline-block;
          margin-bottom: 24px;
        }
        .hero-title {
          font-size: 3.5rem;
          margin-bottom: 16px;
          line-height: 1.1;
        }
        .hero-subtitle {
          font-size: 1.2rem;
          max-width: 600px;
          margin: 0 auto;
          opacity: 0.9;
        }
        
        .featured-card {
          max-width: 1000px;
          margin: -60px auto 60px;
          background: white;
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          border: 2px solid #FF6B35;
          overflow: hidden;
          position: relative;
          display: flex;
          flex-direction: column;
        }
        @media (min-width: 992px) {
          .featured-card { flex-direction: row; }
        }
        .featured-img-area {
          flex: 0 0 40%;
          background: #FFF5F0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px;
          text-align: center;
        }
        .featured-content {
          flex: 1;
          padding: 40px;
        }
        .event-badge {
          padding: 6px 14px;
          border-radius: 99px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          display: inline-block;
          margin-bottom: 16px;
        }
        .badge-orange { background: #FFF5F0; color: #FF6B35; }
        .badge-green { background: #F0FDF4; color: #2D5016; }
        
        .countdown-container {
          display: flex;
          gap: 12px;
          margin-top: 24px;
          justify-content: center;
        }
        .countdown-item {
          background: white;
          padding: 10px;
          min-width: 70px;
          border-radius: 12px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.05);
          border: 1px solid #E5E7EB;
        }
        .countdown-item .count {
          display: block;
          font-size: 1.5rem;
          font-weight: 800;
          color: #FF6B35;
          line-height: 1;
        }
        .countdown-item .label {
          font-size: 0.65rem;
          color: #6B7280;
          text-transform: uppercase;
        }

        .quote-card {
          background: #F9FAFB;
          border-left: 5px solid #FF6B35;
          padding: 24px;
          margin: 32px 0;
          font-style: italic;
          color: #4B5563;
          position: relative;
        }
        .event-details-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin: 24px 0;
        }
        .detail-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }
        .detail-item svg { color: #FF6B35; margin-top: 3px; }
        .detail-item .val { font-weight: 600; color: #111827; display: block; }
        .detail-item .lab { font-size: 0.8rem; color: #6B7280; }

        .featured-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 32px;
        }

        /* Ground Work Section */
        .ground-work {
          padding: 100px 0;
          background: #FAFAF9;
        }
        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 30px;
          margin-top: 50px;
        }
        .info-card {
          background: white;
          padding: 40px;
          border-radius: 20px;
          transition: 0.3s;
          text-align: center;
        }
        .info-card:hover { transform: translateY(-10px); box-shadow: 0 15px 30px rgba(0,0,0,0.05); }
        .info-icon {
          width: 60px;
          height: 60px;
          background: #FFF5F0;
          color: #FF6B35;
          border-radius: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px;
          font-size: 1.5rem;
        }

        /* Coming Soon Section */
        .coming-section {
          padding: 100px 0;
        }
        .coming-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
          margin-top: 50px;
        }
        .coming-card {
          background: white;
          border: 1px solid #E5E7EB;
          border-radius: 16px;
          padding: 30px;
          position: relative;
        }
        .status-pill {
          position: absolute;
          top: 20px;
          right: 20px;
          font-size: 0.7rem;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 99px;
        }

        /* Join CTA */
        .join-cta {
          background: #111827;
          color: white;
          padding: 100px 0;
          text-align: center;
        }
        .roles-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
          margin: 50px 0;
        }
        .role-box {
          background: rgba(255,255,255,0.05);
          padding: 30px;
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.1);
        }
        .contact-big {
          font-size: 1.5rem;
          font-weight: 700;
          color: #FF6B35;
          margin: 40px 0;
        }
      `}</style>

      {/* Hero Section */}
      <section className="events-hero">
        <div className="container">
          <div className="hero-honest-msg hindi">
            DVS अभी अपनी शुरुआत में है — हम छोटे से शुरू करके बड़ा बदलाव लाने का सपना रखते हैं। आपका साथ हमें आगे बढ़ने की ताकत देता है। 🙏
          </div>
          <h1 className="hero-title">
            {language === 'hi' ? 'हमारे कार्यक्रम एवं आयोजन' : 'Our Events & Programs'}
          </h1>
          <p className="hero-subtitle hindi">
            DVS ग्रामीण जीवन को समझने और बदलने के लिए गाँव-गाँव जाकर काम कर रहा है
          </p>
        </div>
      </section>

      {/* Featured Event Card */}
      <section className="section bg-white">
        <div className="container">
          {featuredEvent && (
            <div className="featured-card">
              <div className="featured-img-area">
                <Badge color="orange">UPCOMING</Badge>
                <h3 className="hindi" style={{ marginBottom: 12 }}>आमंत्रण पत्र</h3>
                <p className="hindi" style={{ fontSize: '0.9rem', color: '#6B7280' }}>
                  संस्थापक सदस्य चयन बैठक
                </p>
                
                {/* Countdown */}
                <CountdownTimer targetDate={featuredEvent.date} />
                
                <div style={{ marginTop: 32, fontSize: '0.85rem' }}>
                  <span className="hindi">स्थान: सामुदायिक पुस्तकालय, जेरुवा</span><br/>
                  <span className="hindi">समय: प्रातः 9:00 बजे</span>
                </div>
              </div>

              <div className="featured-content">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h2 className={language === 'hi' ? 'hindi' : ''}>
                    {language === 'hi' ? featuredEvent.title : (featuredEvent.title_en || featuredEvent.title)}
                  </h2>
                </div>

                <div className="event-details-grid">
                  <div className="detail-item">
                    <Calendar size={18} />
                    <div>
                      <span className="val">
                        {new Date(featuredEvent.date).toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                      <span className="lab">{language === 'hi' ? 'दिनांक' : 'Date'}</span>
                    </div>
                  </div>
                  <div className="detail-item">
                    <Clock size={18} />
                    <div>
                      <span className="val">{new Date(featuredEvent.date).toLocaleTimeString(language === 'hi' ? 'hi-IN' : 'en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                      <span className="lab">{language === 'hi' ? 'समय' : 'Time'}</span>
                    </div>
                  </div>
                  <div className="detail-item">
                    <MapPin size={18} />
                    <div>
                      <span className="val">{featuredEvent.location}</span>
                      <span className="lab">{language === 'hi' ? 'स्थान' : 'Location'}</span>
                    </div>
                  </div>
                  <div className="detail-item">
                    <CheckCircle2 size={18} />
                    <div>
                      <span className="val">{(featuredEvent.mode || 'offline').toUpperCase()}</span>
                      <span className="lab">{language === 'hi' ? 'प्रकार' : 'Mode'}</span>
                    </div>
                  </div>
                </div>

                <div className={language === 'hi' ? 'hindi' : ''} style={{ fontSize: '1rem', color: '#4B5563', whiteSpace: 'pre-line' }}>
                  {language === 'hi' 
                    ? (featuredEvent.description_hi || featuredEvent.description) 
                    : (featuredEvent.description_en || featuredEvent.description || '')}
                </div>

                <div className="quote-card hindi">
                  "{featuredEvent.invitation_quote}"
                </div>

                <div className="featured-actions">
                  <a href="tel:09241859951" className="btn btn-primary" style={{ background: '#FF6B35' }}>
                    <Phone size={18} /> 📞 संपर्क करें: 09241859951
                  </a>
                  <a href="mailto:dvs.ngo.official@gmail.com" className="btn btn-secondary" style={{ borderColor: '#FF6B35', color: '#FF6B35' }}>
                    <Mail size={18} /> ईमेल करें
                  </a>
                  <button onClick={() => handleWhatsAppShare(featuredEvent.title)} className="btn btn-icon" style={{ background: '#25D366', color: 'white', border: 'none' }}>
                    <Share2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Info Section - What We Are Doing */}
      <section className="ground-work">
        <div className="container">
          <div className="section-title">
            <h2 className="hindi">हम क्या कर रहे हैं?</h2>
            <p className="hindi">DVS की असली ज़मीनी कहानी</p>
          </div>

          <div className="info-grid">
            <div className="info-card">
              <div className="info-icon">🚶</div>
              <h3 className="hindi">गाँव-गाँव जाकर समझ रहे हैं</h3>
              <p className="hindi">हम ग्रामीण क्षेत्रों में घर-घर जाकर बच्चों और परिवारों की शैक्षिक स्थिति समझने की कोशिश कर रहे हैं।</p>
            </div>
            <div className="info-card">
              <div className="info-icon">📚</div>
              <h3 className="hindi">शिक्षा की लड़ाई</h3>
              <p className="hindi">हम शिक्षा, डिजिटल साक्षरता और प्रोग्रामिंग के लिए लोगों को जागरूक करने में लगे हुए हैं।</p>
            </div>
            <div className="info-card">
              <div className="info-icon">🏃</div>
              <h3 className="hindi">खेल एवं स्वास्थ्य</h3>
              <p className="hindi">ग्रामीण युवाओं के सर्वांगीण विकास के लिए खेल-कूद और योग को बढ़ावा दे रहे हैं।</p>
            </div>
            <div className="info-card">
              <div className="info-icon">🔨</div>
              <h3 className="hindi">हम तैयार हो रहे हैं</h3>
              <p className="hindi">DVS अभी अपनी नींव रख रहा है। जल्द ही बड़े कार्यक्रमों का आयोजन किया जाएगा।</p>
            </div>
          </div>
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="coming-section">
        <div className="container">
          <div className="section-title">
            <h2 className="hindi">जल्द आने वाले कार्यक्रम</h2>
            <p className="hindi">Future Programs & Initiatives</p>
          </div>

          <div className="coming-grid">
            {comingSoonPrograms.map((prog, idx) => (
              <div key={idx} className="coming-card">
                <span className="status-pill hindi" style={{ background: prog.color + '15', color: prog.color }}>
                  जल्द आ रहा है
                </span>
                <div style={{ color: prog.color, marginBottom: 16 }}>{prog.icon}</div>
                <h3 className="hindi" style={{ fontSize: '1.25rem', marginBottom: 8 }}>{prog.title}</h3>
                <p style={{ fontSize: '0.85rem', color: '#6B7280', marginBottom: 16, fontWeight: 600 }}>{prog.title_en}</p>
                <p className="hindi" style={{ fontSize: '0.95rem', color: '#4B5563' }}>{prog.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Us Section */}
      <section className="join-cta">
        <div className="container">
          <h2 className="hindi" style={{ color: 'white' }}>इस पहल का हिस्सा बनें</h2>
          <p style={{ opacity: 0.8, maxWidth: 600, margin: '16px auto' }}>
            {language === 'hi' 
              ? 'DVS अभी अपनी शुरुआत कर रहा है। हमें आपके जैसे समर्पित लोगों की ज़रूरत है जो ग्रामीण भारत के लिए कुछ करना चाहते हैं।' 
              : 'DVS is just starting its journey. We need dedicated people like you who want to make a difference in rural India.'}
          </p>

          <div className="roles-grid">
            <div className="role-box">
              <h3 className="hindi" style={{ color: '#FF6B35' }}>छात्र बनें</h3>
              <p className="hindi">छात्रवृत्ति और शिक्षा सहायता के लिए जुड़ें</p>
              <Link to="/register?role=student" className="btn btn-sm btn-secondary" style={{ marginTop: 16, color: 'white', borderColor: 'white' }}>Register</Link>
            </div>
            <div className="role-box">
              <h3 className="hindi" style={{ color: '#FF6B35' }}>स्वयंसेवक बनें</h3>
              <p className="hindi">अपना समय और कौशल दान करें</p>
              <Link to="/register?role=volunteer" className="btn btn-sm btn-secondary" style={{ marginTop: 16, color: 'white', borderColor: 'white' }}>Register</Link>
            </div>
            <div className="role-box">
              <h3 className="hindi" style={{ color: '#FF6B35' }}>सहयोग दें</h3>
              <p className="hindi">ग्रामीण विकास में आर्थिक योगदान दें</p>
              <Link to="/donate" className="btn btn-sm btn-secondary" style={{ marginTop: 16, color: 'white', borderColor: 'white' }}>Donate</Link>
            </div>
          </div>

          <div className="contact-big">
            📞 09241859951 <br/>
            📧 dvs.ngo.official@gmail.com <br/>
            <span className="hindi" style={{ fontSize: '1rem', color: 'white', fontWeight: 400 }}>📍 जेरुवा, मसलिया, दुमका, झारखंड</span>
          </div>

          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="https://wa.me/919241859951" className="btn" style={{ background: '#25D366', color: 'white' }}>WhatsApp पर संपर्क करें</a>
            <Link to="/register?role=volunteer" className="btn btn-primary">Register as Volunteer</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
