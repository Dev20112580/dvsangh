import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import { Shield, BookOpen, Clock, CheckCircle, Bell, User } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'

export default function ParentPortal() {
  const { t, language } = useLanguage()
  const [loading, setLoading] = useState(true)
  const { user, profile } = useAuth()

  async function fetchChildData() {
    try {
      // Find latest application (assuming POC logic for child associations)
      const { data } = await supabase.from('scholarship_applications').select('*').limit(1)
      if (data && data[0]) {
        setChildData({
          name: data[0].student_name,
          id: data[0].id.substring(0, 10).toUpperCase(),
          class: data[0].current_class || 'N/A',
          scholarship: {
            status: data[0].status,
            amount: `₹${data[0].scholarship_amount?.toLocaleString() || '0'}`,
            nextInstallment: 'TBD'
          },
          attendance: 'N/A',
          materials: 0,
          recentNews: t('Dashboard initialized for your child.')
        })
      }
    } catch (err) {
      console.error('Error fetching child data:', err)
    }
    setLoading(false)
  }

  useEffect(() => {
    if (user) fetchChildData()
  }, [user])

  if (loading) return <div style={{ padding: 100, textAlign: 'center' }}>{t('Loading Parent Dashboard...')}</div>

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '100px 24px 40px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
           <div>
              <h1 className="hindi" style={{ fontSize: '2rem', fontWeight: 900, color: '#1e293b', marginBottom: 4 }}>
                {language === 'hi' ? `नमस्ते, ${profile?.full_name || 'अभिभावक'}` : `Welcome, ${profile?.full_name || 'Parent'}`}
              </h1>
              <p className="hindi" style={{ color: '#64748b' }}>{t('Your Child\'s Progress at DVS')}</p>
           </div>
           {childData && (
             <div style={{ background: 'white', padding: '8px 20px', borderRadius: 20, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#FF6B35', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.8rem', fontWeight: 900 }}>{childData.name[0]}</div>
                <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>{childData.name}</span>
             </div>
           )}
        </div>

        {!childData ? (
          <div style={{ textAlign: 'center', padding: 64, background: 'white', borderRadius: 32 }}>
            <User size={48} color="#94a3b8" style={{ marginBottom: 16 }} />
            <h3 className="hindi">{t('No child student profile linked yet')}</h3>
            <p className="hindi">{t('Please contact DVS office with your child\'s Student ID.')}</p>
          </div>
        ) : (
          <>
            {/* 3 Main Tabs Section */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 32 }}>
               <div style={{ background: 'white', borderRadius: 24, padding: 32, textAlign: 'center', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px rgba(0,0,0,0.03)' }}>
                  <Shield size={40} color="#10B981" style={{ marginBottom: 16 }} />
                  <h4 className="hindi" style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1e293b', marginBottom: 8 }}>{t('Scholarship')}</h4>
                  <div style={{ padding: '6px 12px', background: '#DCFCE7', color: '#15803d', borderRadius: 12, fontSize: '0.75rem', fontWeight: 800, display: 'inline-block' }}>{t(childData.scholarship.status)}</div>
                  <p style={{ marginTop: 12, fontWeight: 900, fontSize: '1.1rem' }}>{childData.scholarship.amount}</p>
               </div>

               <div style={{ background: 'white', borderRadius: 24, padding: 32, textAlign: 'center', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px rgba(0,0,0,0.03)' }}>
                  <BookOpen size={40} color="#FF6B35" style={{ marginBottom: 16 }} />
                  <h4 className="hindi" style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1e293b', marginBottom: 8 }}>{t('Academic Progress')}</h4>
                  <p style={{ marginTop: 12, fontWeight: 900, fontSize: '1.5rem', color: '#FF6B35' }}>{childData.attendance}</p>
                  <p style={{ color: '#64748b', fontSize: '0.8rem' }}>{t('Attendance')}</p>
               </div>

               <div style={{ background: 'white', borderRadius: 24, padding: 32, textAlign: 'center', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px rgba(0,0,0,0.03)' }}>
                  <Clock size={40} color="#1D4ED8" style={{ marginBottom: 16 }} />
                  <h4 className="hindi" style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1e293b', marginBottom: 8 }}>{t('Resources')}</h4>
                  <p style={{ marginTop: 12, fontWeight: 900, fontSize: '1.5rem', color: '#1D4ED8' }}>{childData.materials}</p>
                  <p style={{ color: '#64748b', fontSize: '0.8rem' }}>{t('Study Materials')}</p>
               </div>
            </div>

            {/* Detailed Feed */}
            <div style={{ background: 'white', borderRadius: 32, padding: 40, border: '1px solid #e2e8f0', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
               <h3 className="hindi" style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: 24, borderBottom: '2px solid #f1f5f9', paddingBottom: 16 }}>{t('Latest Feed')}</h3>
               
               <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div style={{ display: 'flex', gap: 20, padding: 20, background: '#f8fafc', borderRadius: 20 }}>
                     <Bell size={24} color="#FF6B35" />
                     <div>
                        <h5 className="hindi" style={{ fontSize: '1rem', fontWeight: 800, marginBottom: 4 }}>{t('Status Update')}</h5>
                        <p className="hindi" style={{ fontSize: '0.9rem', color: '#64748b' }}>{childData.recentNews}</p>
                     </div>
                  </div>
               </div>

               <button style={{ width: '100%', marginTop: 32, padding: '16px', borderRadius: 16, background: '#111827', color: 'white', border: 'none', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                  <User size={18} /> {t('Message Coordinator')}
               </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
