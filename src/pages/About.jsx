import { Link } from 'react-router-dom'
import { Users, Target, Eye, Award, BookOpen, Heart, MapPin, Calendar } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

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
  
  return (
    <>
      <div className="page-header">
        <h1 className="hindi">{t('About Us')}</h1>
        <p className="hindi">{t('Discover who we are and what we do')}</p>
        <div className="breadcrumb">
          <Link to="/">{t('Home')}</Link> <span>/</span> <span>{t('About Us')}</span>
        </div>
      </div>

      {/* Founder Message */}
      <section className="section">
        <div className="container" style={{ maxWidth: 900 }}>
          <div style={{ display: 'flex', gap: 40, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ flex: '0 0 200px', textAlign: 'center' }}>
              <img src="/images/founder.png" alt="Sumit Kumar Pandit" width="160" height="160" style={{ borderRadius: '50%', objectFit: 'cover', margin: '0 auto', border: '4px solid var(--dvs-orange-bg)' }} />
              <h4 style={{ marginTop: 16 }} className="hindi">{language === 'hi' ? 'सुमित कुमार पंडित' : 'Sumit Kumar Pandit'}</h4>
              <p style={{ color: 'var(--gray-500)', fontSize: '0.85rem' }}>{t('Founder & President')}</p>
            </div>
            <div style={{ flex: 1, minWidth: 300 }}>
              <h2 className="hindi" style={{ marginBottom: 16 }}>{t('Founder\'s Message')}</h2>
              <p style={{ color: 'var(--gray-600)', lineHeight: 1.8, marginBottom: 16 }} className="hindi">
                {t('"Education is the most powerful weapon which you can use to change the world. DVS was founded with the belief that every child, regardless of village or circumstance, deserves access to quality education."')}
              </p>
              <p style={{ color: 'var(--gray-600)', lineHeight: 1.8 }} className="hindi">
                {t('"We do not just impart bookish knowledge but foster holistic development through life skills, digital literacy, and sports. Join us in bringing the change."')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="section" style={{ background: 'var(--gray-50)' }}>
        <div className="container">
          <div className="grid grid-2" style={{ maxWidth: 900, margin: '0 auto' }}>
            <div className="card" style={{ borderLeft: '4px solid var(--dvs-orange)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <Eye size={28} color="var(--dvs-orange)" />
                <h3 className="hindi">{t('Vision')}</h3>
              </div>
              <p className="hindi" style={{ color: 'var(--gray-600)', lineHeight: 1.7 }}>
                {t('To create an educational ecosystem in rural India that provides every child with quality education and equal opportunities.')}
              </p>
            </div>
            <div className="card" style={{ borderLeft: '4px solid var(--dvs-green)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <Target size={28} color="var(--dvs-green)" />
                <h3 className="hindi">{t('Mission')}</h3>
              </div>
              <p className="hindi" style={{ color: 'var(--gray-600)', lineHeight: 1.7 }}>
                {t('Empowering rural and tribal youths of Jharkhand through education, scholarships, digital literacy, sports, and mentorship.')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section">
        <div className="container" style={{ maxWidth: 700 }}>
          <div className="section-title">
            <h2 className="hindi">{t('Our Journey')}</h2>
          </div>
          <div style={{ position: 'relative', paddingLeft: 40 }}>
            <div style={{ position: 'absolute', left: 15, top: 0, bottom: 0, width: 2, background: 'var(--gray-200)' }} />
            {milestones.map((m, i) => (
              <div key={i} style={{ position: 'relative', marginBottom: 32, paddingLeft: 24 }}>
                <div style={{ position: 'absolute', left: -30, top: 4, width: 12, height: 12, borderRadius: '50%', background: 'var(--dvs-orange)', border: '3px solid white', boxShadow: '0 0 0 2px var(--dvs-orange)' }} />
                <span className="badge badge-orange" style={{ marginBottom: 8 }}>{m.year}</span>
                <p className="hindi" style={{ color: 'var(--gray-600)' }}>{t(m.event)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section" style={{ background: 'var(--gray-50)' }}>
        <div className="container">
          <div className="section-title">
            <h2 className="hindi">{t('Our Team')}</h2>
            <p>{t('The dedicated management committee of DVS')}</p>
          </div>
          <div className="grid grid-4" style={{ maxWidth: 1000, margin: '0 auto' }}>
            {team.map((member, i) => (
              <div className="card" key={i} style={{ textAlign: 'center' }}>
                <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--dvs-orange-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: '2rem', color: 'var(--dvs-orange)', fontWeight: 700 }}>
                  {language === 'hi' && i === 0 ? 'सु' : member.name.charAt(0)}
                </div>
                <h4 className="hindi" style={{ fontSize: '1rem', marginBottom: 4 }}>
                  {language === 'hi' && i === 0 ? 'सुमित कुमार पंडित' : 
                   language === 'hi' && i === 1 ? 'प्रशांत' : 
                   language === 'hi' && i === 2 ? 'मधु' : 
                   language === 'hi' && i === 3 ? 'रीता' : 
                   language === 'hi' && i === 4 ? 'रिया' : 
                   language === 'hi' && i === 5 ? 'पिया' : 
                   language === 'hi' && i === 6 ? 'विजय' : 
                   member.name}
                </h4>
                <p style={{ color: 'var(--gray-500)', fontSize: '0.8rem' }} className="hindi">{t(member.role)}</p>
                <span className="badge badge-info" style={{ marginTop: 8 }}>{member.id}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="section">
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="section-title">
            <h2 className="hindi">{t('Our Location')}</h2>
          </div>
          <div className="card-flat" style={{ maxWidth: 600, margin: '0 auto', padding: 32, textAlign: 'center' }}>
            <MapPin size={40} color="var(--dvs-orange)" style={{ marginBottom: 16 }} />
            <h4 className="hindi">{t('Dronacharya Vidyarthi Sangh')}</h4>
            <p className="hindi" style={{ color: 'var(--gray-500)', marginTop: 8, lineHeight: 1.7 }}>
              {t('Jairuva Khilkanali, Masalia')}<br />
              {t('Dumka, Jharkhand - 814166')}
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
