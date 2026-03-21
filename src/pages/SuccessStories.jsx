import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Star, Award, MapPin, Quote, ChevronLeft, ChevronRight } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

export default function SuccessStories() {
  const { t, language } = useLanguage()
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase.from('success_stories').select('*').eq('is_approved', true).order('created_at', { ascending: false })
      setStories(data || [])
      setLoading(false)
    }
    fetch()
  }, [])

  // Auto-play timer
  useEffect(() => {
    if (stories.length > 0) {
      const timer = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % stories.length)
      }, 5000)
      return () => clearInterval(timer)
    }
  }, [stories])

  const next = () => setCurrentIndex(prev => (prev + 1) % stories.length)
  const prev = () => setCurrentIndex(prev => (prev - 1 + stories.length) % stories.length)

  return (
    <div style={{ background: '#0f172a', minHeight: '100vh', paddingBottom: 100, color: 'white' }}>
      <div className="page-header" style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', padding: '100px 0 160px', textAlign: 'center' }}>
        <div className="container">
          <Award size={48} color="#FF6B35" style={{ marginBottom: 24 }} />
          <h1 className="hindi" style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: 16 }}>{t('Success Stories')}</h1>
          <p className="hindi" style={{ fontSize: '1.25rem', opacity: 0.7, maxWidth: 600, margin: '0 auto' }}>{t('Inspiring journeys of DVS students who transformed their lives through education.')}</p>
        </div>
      </div>

      <section className="section" style={{ marginTop: -100 }}>
        <div className="container">
          {loading ? (
            <div className="skeleton" style={{ height: 500, borderRadius: 32, background: 'rgba(255,255,255,0.05)' }} />
          ) : stories.length > 0 ? (
            <div style={{ position: 'relative', maxWidth: 1000, margin: '0 auto' }}>
              
              {/* Carousel Content */}
              <div style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 32, padding: '60px', position: 'relative', overflow: 'hidden' }}>
                <Quote size={80} style={{ position: 'absolute', top: 40, right: 40, opacity: 0.05, color: '#FF6B35' }} />
                
                <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 60, alignItems: 'center' }}>
                  <div style={{ position: 'relative' }}>
                    <div style={{ width: 300, height: 380, borderRadius: 24, overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
                      <img src={stories[currentIndex].photo_url || 'https://images.unsplash.com/photo-1544717297-fa154daaf762?auto=format&fit=crop&q=80&w=400'} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ position: 'absolute', bottom: -20, right: -20, background: '#FF6B35', color: 'white', padding: '12px 24px', borderRadius: 16, fontWeight: 800, fontSize: '0.9rem', boxShadow: '0 10px 20px rgba(0,0,0,0.2)' }}>{stories[currentIndex].achievement}</div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', gap: 4, marginBottom: 24 }}>
                      {[1,2,3,4,5].map(i => <Star key={i} size={20} fill="#FF6B35" color="#FF6B35" />)}
                    </div>
                    <p style={{ fontSize: '1.5rem', lineHeight: 1.6, fontStyle: 'italic', marginBottom: 32, opacity: 0.9 }}>"{language === 'hi' ? (stories[currentIndex].content_hi || stories[currentIndex].content) : stories[currentIndex].content}"</p>
                    <div>
                      <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: 8 }}>{stories[currentIndex].title}</h3>
                      <div style={{ display: 'flex', gap: 20, color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><MapPin size={16} /> {stories[currentIndex].village || 'Jharkhand'}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Award size={16} /> {t('Scholarship Recipient')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Controls */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 40 }}>
                <button onClick={prev} style={{ width: 56, height: 56, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#FF6B35'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}>
                  <ChevronLeft size={24} />
                </button>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {stories.map((_, i) => (
                    <div key={i} onClick={() => setCurrentIndex(i)} style={{ width: i === currentIndex ? 40 : 10, height: 10, borderRadius: 5, background: i === currentIndex ? '#FF6B35' : 'rgba(255,255,255,0.2)', cursor: 'pointer', transition: 'all 0.3s' }} />
                  ))}
                </div>
                <button onClick={next} style={{ width: 56, height: 56, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#FF6B35'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}>
                  <ChevronRight size={24} />
                </button>
              </div>

            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '100px 0', color: 'rgba(255,255,255,0.3)' }}>
              <Award size={80} style={{ margin: '0 auto 24px', opacity: 0.2 }} />
              <p className="hindi" style={{ fontSize: '1.25rem' }}>{t('More success stories are being curated...')}</p>
            </div>
          )}
        </div>
      </section>

      {/* Grid of Other Stories */}
      {stories.length > 1 && (
        <section className="section">
          <div className="container">
            <h2 className="hindi" style={{ textAlign: 'center', marginBottom: 60, fontSize: '2.5rem' }}>{t('More Inspiring Journeys')}</h2>
            <div className="grid grid-3">
               {stories.map((story, idx) => (
                 <div key={story.id} className="card" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: 32, borderRadius: 24, cursor: 'pointer' }} onClick={() => setCurrentIndex(idx)}>
                    <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
                       <div style={{ width: 48, height: 48, borderRadius: '50%', overflow: 'hidden' }}>
                          <img src={story.photo_url || 'https://images.unsplash.com/photo-1544717297-fa154daaf762?auto=format&fit=crop&q=80&w=100'} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                       </div>
                       <div>
                          <h4 style={{ fontSize: '1rem', fontWeight: 800 }}>{story.title}</h4>
                          <p style={{ fontSize: '0.75rem', opacity: 0.5 }}>{story.village}</p>
                       </div>
                    </div>
                    <p style={{ fontSize: '0.9rem', opacity: 0.7, lineHeight: 1.5 }}>{language === 'hi' ? story.content_hi?.substring(0, 100) : story.content?.substring(0, 100)}...</p>
                 </div>
               ))}
            </div>
          </div>
        </section>
      )}

      {/* Submit Your Story Section */}
      <section className="section" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 100 }}>
         <div className="container" style={{ maxWidth: 700 }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 32, padding: 60, textAlign: 'center' }}>
               <h2 className="hindi" style={{ fontSize: '2rem', fontWeight: 900, marginBottom: 16 }}>{t('Submit Your Story')}</h2>
               <p className="hindi" style={{ opacity: 0.7, marginBottom: 40 }}>{t('Has DVS helped you achieve your dreams? Share your journey with thousands of other students.')}</p>
               
               <form style={{ display: 'grid', gap: 20, textAlign: 'left' }} onSubmit={async (e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  const newStory = {
                    title: formData.get('name'),
                    achievement: formData.get('achievement'),
                    content: formData.get('story'),
                    is_approved: false
                  };
                  
                  const { error } = await supabase.from('success_stories').insert([newStory]);
                  if (error) {
                    alert(t('Error submitting story. Please try again.'));
                  } else {
                    alert(t('Success Story Submitted for Review!'));
                    e.target.reset();
                  }
               }}>
                  <div>
                     <label className="hindi" style={{ display: 'block', fontSize: '0.9rem', marginBottom: 8, opacity: 0.6 }}>{t('Your Name')}</label>
                     <input name="name" type="text" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: 16, borderRadius: 12, color: 'white' }} required />
                  </div>
                  <div>
                     <label className="hindi" style={{ display: 'block', fontSize: '0.9rem', marginBottom: 8, opacity: 0.6 }}>{t('Major Achievement')}</label>
                     <input name="achievement" type="text" placeholder={t('e.g. Cleared JPSC, Got Job at...')} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: 16, borderRadius: 12, color: 'white' }} required />
                  </div>
                  <div>
                     <label className="hindi" style={{ display: 'block', fontSize: '0.9rem', marginBottom: 8, opacity: 0.6 }}>{t('Your Story')}</label>
                     <textarea name="story" style={{ width: '100%', minHeight: 150, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: 16, borderRadius: 12, color: 'white', resize: 'none' }} required />
                  </div>
                  <button type="submit" style={{ padding: '16px', background: '#FF6B35', border: 'none', borderRadius: 12, color: 'white', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', marginTop: 20 }}>
                     {t('Submit Story')}
                  </button>
               </form>
            </div>
         </div>
      </section>
    </div>
  )
}
