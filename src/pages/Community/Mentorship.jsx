import { useState } from 'react'
import { 
  User, Star, MessageSquare, Calendar, ChevronRight, 
  Search, Filter, BookOpen, Award, ShieldCheck, Sparkles, X, CheckCircle 
} from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'

export default function Mentorship() {
  const { t } = useLanguage()
  const { user } = useAuth()

  const [showRequest, setShowRequest] = useState(false)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const [requestData, setRequestData] = useState({
    category: 'Career Guidance',
    goal: '',
    mentor_id: 'default_mentor', // Placeholder for now
    mentor_name: 'System Match'
  })

  const mentors = [
    { id: 1, name: 'Prashant Kumar', role: 'UPSC 2022 Topper', expertise: 'General Studies & Ethics', rating: '5.0', reviews: 124, available: 'Available Now', languages: ['Hindi', 'English'] },
    { id: 2, name: 'Anjali Mahto', role: 'Software Engineer @ Google', expertise: 'Coding & Career Path', rating: '4.9', reviews: 86, available: 'Tomorrow, 10 AM', languages: ['English', 'Hindi'] },
    { id: 3, name: 'Dr. Vivek Singh', role: 'Education Specialist', expertise: 'Psychology & Counseling', rating: '4.8', reviews: 45, available: 'Next Week', languages: ['Hindi', 'Santali'] }
  ]

  const handleOpenRequest = (mentor = null) => {
    if (mentor) {
      setRequestData({
        ...requestData,
        mentor_id: mentor.id.toString(),
        mentor_name: mentor.name
      })
    }
    setShowRequest(true)
  }

  const handleSubmitRequest = async (e) => {
    e.preventDefault()
    if (!user) return alert(t('Please log in to request mentorship'))
    
    setLoading(true)
    const { error } = await supabase.from('mentor_requests').insert([{
      user_id: user.id,
      mentor_id: requestData.mentor_id,
      mentor_name: requestData.mentor_name,
      goal: requestData.goal,
      subject: requestData.category
    }])

    setLoading(false)
    if (error) alert(error.message)
    else {
      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
        setShowRequest(false)
        setRequestData({ category: 'Career Guidance', goal: '', mentor_id: 'default_mentor', mentor_name: 'System Match' })
      }, 3000)
    }
  }

  return (
    <div style={{ padding: '32px' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 40, background: 'linear-gradient(135deg, #FF6B35 0%, #FF9F1C 100%)', padding: 40, borderRadius: 24, color: 'white' }}>
        <div style={{ maxWidth: 600 }}>
           <h1 className="hindi" style={{ fontSize: '2rem', fontWeight: 900 }}>{t('Empowering Rural Jharkhand')}</h1>
           <p className="hindi" style={{ opacity: 0.9, marginTop: 12, lineHeight: 1.6 }}>{t('Connect with industry leaders and toppers who understand your roots. Our mentors are here to guide you through UPSC, Coding, and Career transitions.')}</p>
        </div>
        <button onClick={() => handleOpenRequest()} className="hindi" style={{ padding: '16px 32px', background: 'white', color: '#FF6B35', border: 'none', borderRadius: 12, fontWeight: 900, cursor: 'pointer', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}>
           {t('Request Mentorship')}
        </button>
      </div>

      {showRequest && !success && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
           <div style={{ background: 'white', width: '100%', maxWidth: 500, borderRadius: 24, padding: 40, position: 'relative' }}>
              <button onClick={() => setShowRequest(false)} style={{ position: 'absolute', right: 24, top: 24, background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}><X size={24} /></button>
              <h2 className="hindi" style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: 12 }}>{t('Matching Opportunity')}</h2>
              <p className="hindi" style={{ color: '#64748b', marginBottom: 32 }}>{t('Tell us about your goals and we will match you with the best mentor.')}</p>
              
              <form onSubmit={handleSubmitRequest} style={{ display: 'grid', gap: 20 }}>
                 <div>
                    <label className="hindi" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', marginBottom: 8 }}>{t('Mentorship Category')}</label>
                    <select 
                      value={requestData.category}
                      onChange={e => setRequestData({...requestData, category: e.target.value})}
                      style={{ width: '100%', padding: '12px', borderRadius: 10, border: '1px solid #e2e8f0' }}
                    >
                       <option>{t('Career Guidance')}</option>
                       <option>{t('UPSC Strategy')}</option>
                       <option>{t('Technical Skills')}</option>
                       <option>{t('Soft Skills')}</option>
                    </select>
                 </div>
                 <div>
                    <label className="hindi" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', marginBottom: 8 }}>{t('Mentor Selection')}</label>
                    <input 
                      disabled
                      value={requestData.mentor_name}
                      style={{ width: '100%', padding: '12px', borderRadius: 10, border: '1px solid #e2e8f0', background: '#f8fafc' }}
                    />
                 </div>
                 <div>
                    <label className="hindi" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', marginBottom: 8 }}>{t('Why do you need a mentor?')}</label>
                    <textarea 
                      required
                      value={requestData.goal}
                      onChange={e => setRequestData({...requestData, goal: e.target.value})}
                      placeholder={t('Explain your motivation...')} 
                      style={{ width: '100%', minHeight: 120, padding: 16, borderRadius: 12, border: '1px solid #e2e8f0', resize: 'none' }} 
                    />
                 </div>
                 <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                    <button type="button" onClick={() => setShowRequest(false)} style={{ flex: 1, padding: '14px', borderRadius: 12, border: '1px solid #e2e8f0', background: 'white', fontWeight: 800, cursor: 'pointer' }}>{t('Cancel')}</button>
                    <button type="submit" disabled={loading} style={{ flex: 1, padding: '14px', borderRadius: 12, border: 'none', background: '#FF6B35', color: 'white', fontWeight: 800, cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
                      {loading ? t('Submitting...') : t('Submit Request')}
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}

      {success && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
           <div style={{ background: 'white', width: '100%', maxWidth: 400, borderRadius: 24, padding: 40, textAlign: 'center' }}>
              <div style={{ width: 64, height: 64, background: '#f0fdf4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981', margin: '0 auto 24px' }}><CheckCircle size={32} /></div>
              <h2 className="hindi" style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: 8 }}>{t('Request Sent!')}</h2>
              <p className="hindi" style={{ color: '#64748b' }}>{t('We will notify you once a mentor is assigned.')}</p>
           </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: 24 }}>
        {mentors.map(mentor => (
          <div key={mentor.id} style={{ background: 'white', borderRadius: 24, border: '1px solid #e2e8f0', padding: 32, display: 'flex', gap: 24, transition: 'all 0.3s' }} onMouseEnter={e => e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.04)'}>
             <div style={{ flexShrink: 0 }}>
                <div style={{ width: 100, height: 100, borderRadius: 20, background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', border: '1px solid #f1f5f9', position: 'relative' }}>
                   <User size={48} />
                   <div style={{ position: 'absolute', bottom: -8, right: -8, background: '#1d4ed8', color: 'white', padding: '4px 8px', borderRadius: 8, fontSize: '0.7rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Star size={10} fill="white" /> {mentor.rating}
                   </div>
                </div>
             </div>
             <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                   <div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e293b' }}>{mentor.name}</h3>
                      <div style={{ fontSize: '0.85rem', color: '#1d4ed8', fontWeight: 700, marginTop: 4 }}>{mentor.role}</div>
                   </div>
                </div>
                
                <div style={{ marginTop: 20 }}>
                   <div className="hindi" style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>{t('Expertise')}</div>
                   <div style={{ fontSize: '0.9rem', color: '#64748b', marginTop: 4 }}>{mentor.expertise}</div>
                </div>

                <div style={{ marginTop: 16, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                   {mentor.languages.map(lang => (
                      <span key={lang} style={{ fontSize: '0.7rem', padding: '2px 8px', background: '#f1f5f9', borderRadius: 4, color: '#475569', fontWeight: 600 }}>{t(lang)}</span>
                   ))}
                   <span style={{ fontSize: '0.7rem', padding: '2px 8px', background: mentor.available === 'Available Now' ? '#f0fdf4' : '#fff7ed', borderRadius: 4, color: mentor.available === 'Available Now' ? '#16a34a' : '#ea580c', fontWeight: 700 }}>
                      {t(mentor.available)}
                   </span>
                </div>

                <div style={{ marginTop: 32, display: 'flex', gap: 12 }}>
                   <button onClick={() => handleOpenRequest(mentor)} className="hindi" style={{ flex: 1, padding: '10px', borderRadius: 10, background: '#111', color: 'white', border: 'none', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}>{t('Book Session')}</button>
                   <button style={{ padding: '10px', borderRadius: 10, background: '#f8fafc', color: '#4b5563', border: '1px solid #e2e8f0', cursor: 'pointer' }}><MessageSquare size={18} /></button>
                </div>
             </div>
          </div>
        ))}
      </div>

    </div>
  )
}
