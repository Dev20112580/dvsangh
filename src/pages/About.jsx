import { Link } from 'react-router-dom'
import { Users, Target, Eye, Award, BookOpen, Heart, MapPin, Calendar, Quote } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import useDocumentTitle from '../hooks/useDocumentTitle'

const team = [
  { name: 'Sumit Kumar Pandit', role: 'Founder & President', id: 'DVS-F001' },
  { name: 'Prashant', role: 'Vice President & Secretary', id: 'DVS-VP001' },
  { name: 'Madhu', role: 'Vice President', id: 'DVS-VP002' },
  { name: 'Rita', role: 'Vice President', id: 'DVS-VP003' },
  { name: 'Riya', role: 'Assistant Secretary', id: 'DVS-AS001' },
  { name: 'Piya', role: 'Assistant Secretary', id: 'DVS-AS002' },
  { name: 'Vijay', role: 'Treasurer', id: 'DVS-TR001' },
]

const milestones = [
  { year: '2020', event: 'DVS Founded - Dumka, Jharkhand' },
  { year: '2021', event: 'First Scholarship Drive - 50 Students' },
  { year: '2022', event: 'Digital Literacy Program Initiated' },
  { year: '2023', event: 'Provided Coaching to 1000+ Students' },
  { year: '2024', event: 'Girl Education Campaign - 500+ Girls' },
  { year: '2025', event: 'Digital Platform Launch' },
]

export default function About() {
  const { t, language } = useLanguage()
  useDocumentTitle(t('About Our Mission & Vision'))
  
  return (
    <div className="about-page">
      <div className="page-header">
        <div className="container">
          <h1 className="hindi">{t('About Us')}</h1>
          <p className="hindi">{t('Discover who we are and what we do')}</p>
          <div className="breadcrumb">
            <Link to="/">{t('Home')}</Link> <span>/</span> <span>{t('About Us')}</span>
          </div>
        </div>
      </div>

      {/* Founder Message */}
      <section className="section">
        <div className="container" style={{ padding: '0 16px' }}>
          <div className="founder-message-card responsive-flex-gap" style={{ maxWidth: 900, margin: '0 auto', display: 'flex', gap: 48, alignItems: 'center', flexWrap: 'wrap' }}>
            <div className="founder-photo-side" style={{ flex: '1 1 200px', textAlign: 'center' }}>
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <img 
                  src="/logo_dvs.jpg" 
                  alt="Sumit Kumar Pandit" 
                  width="200" 
                  height="200" 
                  style={{ borderRadius: '24px', objectFit: 'cover', border: '8px solid var(--gray-50)', boxShadow: 'var(--shadow-lg)' }} 
                  loading="lazy"
                  fetchpriority="high"
                />
                <div style={{ position: 'absolute', bottom: -10, right: -10, background: 'var(--dvs-orange)', color: 'white', padding: '8px 16px', borderRadius: 12, fontWeight: 800, fontSize: '0.7rem', textTransform: 'uppercase' }}>
                  Founder
                </div>
              </div>
              <h3 style={{ marginTop: 24, fontSize: '1.25rem' }} className="hindi">
                {language === 'hi' ? 'सुमित कुमार पंडित' : 'Sumit Kumar Pandit'}
              </h3>
              <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem', fontWeight: 600 }}>{t('President, DVS')}</p>
            </div>
            <div className="founder-text-side" style={{ flex: '1 1 400px' }}>
              <span className="pill-red">{t('Founding Vision')}</span>
              <h2 className="responsive-h2" style={{ marginBottom: 24 }}>{t('Leading the Change from Grassroots')}</h2>
              <div style={{ position: 'relative', paddingLeft: 24, borderLeft: '3px solid var(--dvs-orange-bg)' }}>
                <p style={{ color: 'var(--gray-600)', lineHeight: 1.8, marginBottom: 20, fontSize: '1.1rem', fontStyle: 'italic' }} className="hindi">
                  {t('"Education is the most powerful weapon which you can use to change the world. DVS was founded with the belief that every child, regardless of village or circumstance, deserves access to quality education."')}
                </p>
                <p style={{ color: 'var(--gray-600)', lineHeight: 1.8 }} className="hindi">
                  {t('"We do not just impart bookish knowledge but foster holistic development through life skills, digital literacy, and sports. Join us in bringing the change."')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="section bg-gray">
        <div className="container">
          <div className="grid grid-2" style={{ maxWidth: 1000, margin: '0 auto', gap: 32 }}>
            <div className="card hover-up" style={{ padding: 40, border: 'none', background: 'white', borderRadius: 24, boxShadow: 'var(--shadow-md)' }}>
              <div style={{ width: 60, height: 60, borderRadius: 16, background: 'var(--dvs-orange-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
                <Eye size={32} color="var(--dvs-orange)" />
              </div>
              <h3 className="hindi" style={{ fontSize: '1.5rem', marginBottom: 16 }}>{t('Vision')}</h3>
              <p className="hindi" style={{ color: 'var(--gray-600)', lineHeight: 1.7, fontSize: '1.05rem' }}>
                {t('To create an educational ecosystem in rural India that provides every child with quality education and equal opportunities.')}
              </p>
            </div>
            <div className="card hover-up" style={{ padding: 40, border: 'none', background: 'white', borderRadius: 24, boxShadow: 'var(--shadow-md)' }}>
              <div style={{ width: 60, height: 60, borderRadius: 16, background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
                <Target size={32} color="var(--success)" />
              </div>
              <h3 className="hindi" style={{ fontSize: '1.5rem', marginBottom: 16 }}>{t('Mission')}</h3>
              <p className="hindi" style={{ color: 'var(--gray-600)', lineHeight: 1.7, fontSize: '1.05rem' }}>
                {t('Empowering rural and tribal youths of Jharkhand through education, scholarships, digital literacy, sports, and mentorship.')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Community Impact Section */}
      <section className="section" style={{ background: 'var(--dvs-orange-bg)', padding: '100px 0' }}>
        <div className="container">
          <div className="text-center mb-16" style={{ maxWidth: 800, margin: '0 auto 60px' }}>
            <span className="pill-red">{t('Our Impact')}</span>
            <h2 className="responsive-h2" style={{ color: 'var(--dvs-orange-dark)', marginTop: 12 }}>{t('Transforming Lives in Jharkhand')}</h2>
            <p style={{ color: 'var(--gray-600)', fontSize: '1.1rem', marginTop: 16 }}>
              {t('Our impact goes beyond just education — it is about building a future where every rural child can dream big.')}
            </p>
          </div>

          <div className="grid grid-3" style={{ gap: 32, marginBottom: 80 }}>
            {[
              { label: 'Students Reached', value: '5000+', icon: <Users size={32} />, color: '#FF6B35' },
              { label: 'Scholarships Granted', value: '1200+', icon: <Award size={32} />, color: '#10B981' },
              { label: 'Villages Served', value: '250+', icon: <MapPin size={32} />, color: '#3B82F6' }
            ].map((stat, i) => (
              <div key={i} className="card-soft text-center" style={{ background: 'white', border: '1px solid #FFEDD5', padding: '48px 32px', borderRadius: 24 }}>
                <div style={{ color: stat.color, marginBottom: 20, display: 'flex', justifyContent: 'center' }}>{stat.icon}</div>
                <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--dark)', marginBottom: 8 }}>{stat.value}</div>
                <div className="hindi" style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: 1 }}>{t(stat.label)}</div>
              </div>
            ))}
          </div>

          {/* Community Voices */}
          <div className="community-testimony">
            <h3 className="hindi text-center mb-12" style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: 48 }}>{t('Voices from the Community')}</h3>
            <div className="grid grid-2" style={{ gap: 32 }}>
              <div className="card" style={{ padding: 40, border: 'none', background: 'white', borderRadius: 24, boxShadow: 'var(--shadow-sm)' }}>
                <Quote size={40} style={{ opacity: 0.1, color: 'var(--dvs-orange)', marginBottom: 20 }} />
                <p style={{ fontSize: '1.1rem', lineHeight: 1.7, fontStyle: 'italic', color: 'var(--gray-600)' }} className="hindi">
                  {t('"Before DVS, our children had no guidance after 10th grade. Now, they are learning computers and dreaming of becoming engineers and doctors right from our village."')}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 32 }}>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--dvs-orange-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: 'var(--dvs-orange)' }}>R</div>
                  <div>
                    <div style={{ fontWeight: 800 }}>Ramesh Mahto</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>{t('Parent, Jerwa Village')}</div>
                  </div>
                </div>
              </div>
              <div className="card" style={{ padding: 40, border: 'none', background: 'white', borderRadius: 24, boxShadow: 'var(--shadow-sm)' }}>
                <Quote size={40} style={{ opacity: 0.1, color: 'var(--dvs-orange)', marginBottom: 20 }} />
                <p style={{ fontSize: '1.1rem', lineHeight: 1.7, fontStyle: 'italic', color: 'var(--gray-600)' }} className="hindi">
                  {t('"The DVS scholarship changed my life. It took off the financial burden from my father, allowing me to focus entirely on my JPSC preparation."')}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 32 }}>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--dvs-orange-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: 'var(--dvs-orange)' }}>P</div>
                  <div>
                    <div style={{ fontWeight: 800 }}>Priya Kumari</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>{t('Student & Scholarship Recipient')}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section bg-white">
        <div className="container">
          <div className="section-header text-center mb-12" style={{ maxWidth: 700, margin: '0 auto 60px' }}>
            <span className="pill-red">{t('History')}</span>
            <h2 className="responsive-h2">{t('The DVS Journey')}</h2>
            <p style={{ color: 'var(--gray-500)', marginTop: 12 }}>{t('From a small initiative to a statewide impact movement.')}</p>
          </div>
          
          <div className="timeline-container mobile-timeline-fix" style={{ maxWidth: 800, margin: '0 auto', position: 'relative', paddingLeft: 30 }}>
            <div style={{ position: 'absolute', left: 4, top: 0, bottom: 0, width: 2, background: 'linear-gradient(to bottom, var(--dvs-orange), transparent)' }} />
            {milestones.map((m, i) => (
              <div key={i} className="timeline-item" style={{ position: 'relative', marginBottom: 48, paddingLeft: 40 }}>
                <div style={{ position: 'absolute', left: -34, top: 6, width: 14, height: 14, borderRadius: '50%', background: 'white', border: '4px solid var(--dvs-orange)', zIndex: 2 }} />
                <div className="milestone-card responsive-card-padding" style={{ background: 'var(--gray-50)', borderRadius: 16, border: '1px solid var(--gray-100)' }}>
                  <span className="badge badge-orange" style={{ marginBottom: 12, fontSize: '0.9rem', padding: '6px 16px' }}>{m.year}</span>
                  <h4 className="hindi" style={{ fontSize: '1.2rem', color: 'var(--dark)', fontWeight: 700 }}>{t(m.event)}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section bg-gray">
        <div className="container">
          <div className="section-header text-center mb-12">
            <span className="pill-red">{t('Management')}</span>
            <h2 className="responsive-h2">{t('Our Core Committee')}</h2>
            <p style={{ color: 'var(--gray-500)', marginTop: 12 }}>{t('The dedicated leaders driving our educational initiatives.')}</p>
          </div>
          
          <div className="grid grid-4" style={{ gap: 24, maxWidth: 1100, margin: '0 auto' }}>
            {team.map((member, i) => (
              <div className="card team-card" key={i} style={{ textAlign: 'center', padding: 32, background: 'white', borderRadius: 20, boxShadow: 'var(--shadow-sm)', border: 'none' }}>
                <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, var(--dvs-orange-bg) 0%, #fff7ed 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '1.8rem', color: 'var(--dvs-orange)', fontWeight: 800, border: '2px solid white', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                  {language === 'hi' && i === 0 ? 'सु' : member.name.charAt(0)}
                </div>
                <h4 className="hindi" style={{ fontSize: '1.05rem', marginBottom: 6, fontWeight: 700 }}>
                  {language === 'hi' && i === 0 ? 'सुमित कुमार पंडित' : 
                   language === 'hi' && i === 1 ? 'प्रशांत' : 
                   language === 'hi' && i === 2 ? 'मधु' : 
                   language === 'hi' && i === 3 ? 'रीता' : 
                   language === 'hi' && i === 4 ? 'रिया' : 
                   language === 'hi' && i === 5 ? 'पिया' : 
                   language === 'hi' && i === 6 ? 'विजय' : 
                   member.name}
                </h4>
                <p style={{ color: 'var(--gray-500)', fontSize: '0.85rem', marginBottom: 12 }} className="hindi">{t(member.role)}</p>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--dvs-orange)', background: 'var(--dvs-orange-bg)', padding: '4px 8px', borderRadius: 6, display: 'inline-block' }}>{member.id}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="section bg-white">
        <div className="container">
          <div className="grid grid-2" style={{ gap: 48, alignItems: 'center' }}>
            <div className="mobile-center-text">
              <span className="pill-red">{t('Headquarters')}</span>
              <h2 className="responsive-h2">{t('Visit Our Office')}</h2>
              <p style={{ color: 'var(--gray-600)', lineHeight: 1.8, marginTop: 16 }}>
                {t('Dronacharya Vidyarthi Sangh is based in the heart of rural Dumka, ensuring we stay close to the communities we serve.')}
              </p>
              <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ background: 'var(--dvs-orange-bg)', padding: 12, borderRadius: 12 }}><MapPin size={24} color="var(--dvs-orange)" /></div>
                  <div>
                    <h5 style={{ margin: 0, fontWeight: 700 }}>{t('Main Office')}</h5>
                    <p style={{ margin: 0, color: 'var(--gray-500)', fontSize: '0.9rem' }}><span className="hindi">{t('Jaroakhilkanali, Masalia, Dumka, JH - 814166')}</span></p>
                  </div>
                </div>
                 <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ background: '#ecfdf5', padding: 12, borderRadius: 12 }}><Calendar size={24} color="var(--success)" /></div>
                  <div>
                    <h5 style={{ margin: 0, fontWeight: 700 }}>{t('Working Hours')}</h5>
                    <p style={{ margin: 0, color: 'var(--gray-500)', fontSize: '0.9rem' }}>{t('Mon - Sat: 9:00 AM - 6:00 PM')}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="location-card" style={{ background: 'var(--dark)', borderRadius: 24, padding: 32, color: 'white', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -20, right: -20, width: 150, height: 150, background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />
              <h4 className="hindi" style={{ fontSize: '1.5rem', marginBottom: 12 }}>{t('Our Presence')}</h4>
              <p style={{ opacity: 0.8, fontSize: '0.95rem', lineHeight: 1.6 }}>{t('Actively operating across Masalia, Shikaripara, and Dumka Sadar blocks, with outreach to over 200+ villages.')}</p>
              <button className="btn btn-primary" style={{ marginTop: 24, width: '100%' }}>{t('Get Directions')}</button>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .founder-message-card { gap: 24px !important; text-align: center !important; }
          .founder-photo-side { flex: 1 1 100% !important; margin-bottom: 32px; }
          .founder-text-side { flex: 1 1 100% !important; padding: 0 !important; }
          .founder-text-side h2 { text-align: center; }
          .founder-text-side div { padding-left: 0 !important; border-left: none !important; }
          .grid-4 { grid-template-columns: 1fr 1fr !important; gap: 16px !important; }
          .team-card { padding: 20px !important; }
          .about-page .section { padding: 48px 0; }
          .responsive-card-padding { padding: 20px 24px !important; }
          .mobile-timeline-fix { padding-left: 20px !important; }
          .timeline-item { padding-left: 30px !important; }
        }
        @media (max-width: 480px) {
          .grid-4 { grid-template-columns: 1fr !important; }
          .responsive-h2 { font-size: 1.75rem !important; }
        }
      `}</style>
    </div>
  )
}
