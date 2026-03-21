import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { Home, Heart, BarChart2, User, Users, BookOpen, Award } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'

export default function DonorImpact() {
  const { user } = useAuth()
  const { t } = useLanguage()
  const [impact, setImpact] = useState({ students: 0, scholarships: 0, total: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) fetchImpact()
  }, [user])

  async function fetchImpact() {
    setLoading(true)
    try {
      // 1. Total Students Helped (Sum of all beneficiaries in scholarship_programs)
      // For simplicity, we'll count unique students across all applications if possible, 
      // but here we just show a meaningful aggregate.
      const { count: studentCount } = await supabase
        .from('scholarship_applications')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'approved')

      // 2. Total Scholarships Provided
      const { count: scholarshipCount } = await supabase
        .from('scholarship_applications')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'approved')
      
      // 3. User's Total Donation
      const { data } = await supabase
        .from('donations')
        .select('amount')
        .eq('donor_id', user.id)
        .eq('payment_status', 'completed')
      
      const total = data?.reduce((acc, curr) => acc + parseFloat(curr.amount), 0) || 0

      setImpact({ students: studentCount || 0, scholarships: scholarshipCount || 0, total })
    } catch (error) {
       console.error('Error fetching impact:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <nav className="sidebar-nav" style={{ paddingTop: 24 }}>
          <NavLink to="/dashboard/donor"><Home size={18} /> {t('Dashboard')}</NavLink>
          <NavLink to="/donor/donations"><Heart size={18} /> {t('Donations')}</NavLink>
          <NavLink to="/donor/impact"><BarChart2 size={18} /> {t('Impact')}</NavLink>
          <NavLink to="/donor/profile"><User size={18} /> {t('Profile')}</NavLink>
        </nav>
      </aside>
      <main className="dashboard-content">
        <div className="dashboard-header"><h1 className="hindi">📊 {t('Your Impact')}</h1></div>
        
        {loading ? (
          <div className="skeleton" style={{ height: 200, borderRadius: 20 }} />
        ) : (
          <div className="grid grid-3" style={{ marginBottom: 32 }}>
            <div className="card" style={{ textAlign: 'center', borderTop: '4px solid #FF6B35', background: 'white' }}>
              <Users size={32} color="#FF6B35" style={{ margin: '0 auto 12px' }} />
              <h3 style={{ color: '#FF6B35', fontSize: '2rem', fontWeight: 900 }}>{impact.students}</h3>
              <p className="hindi" style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 700 }}>{t('Students helped')}</p>
            </div>
            <div className="card" style={{ textAlign: 'center', borderTop: '4px solid #2D5016', background: 'white' }}>
              <BookOpen size={32} color="#2D5016" style={{ margin: '0 auto 12px' }} />
              <h3 style={{ color: '#2D5016', fontSize: '2rem', fontWeight: 900 }}>{impact.scholarships}</h3>
              <p className="hindi" style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 700 }}>{t('Scholarships provided')}</p>
            </div>
            <div className="card" style={{ textAlign: 'center', borderTop: '4px solid #1e293b', background: 'white' }}>
              <Award size={32} color="#1e293b" style={{ margin: '0 auto 12px' }} />
              <h3 style={{ color: '#1e293b', fontSize: '2rem', fontWeight: 900 }}>₹{(impact.total / 1000).toFixed(1)}K</h3>
              <p className="hindi" style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 700 }}>{t('Your Contribution')}</p>
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>
           <div className="card" style={{ padding: 32 }}>
              <h3 className="hindi" style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: 24 }}>{t('Fund Allocation Breakdown')}</h3>
              <div style={{ display: 'flex', gap: 8, height: 40, borderRadius: 20, overflow: 'hidden', marginBottom: 24 }}>
                 <div style={{ width: '80%', background: '#FF6B35', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.8rem', fontWeight: 800 }}>80%</div>
                 <div style={{ width: '15%', background: '#2D5016', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.8rem', fontWeight: 800 }}>15%</div>
                 <div style={{ width: '5%', background: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.8rem', fontWeight: 800 }}>5%</div>
              </div>
              <div style={{ display: 'grid', gap: 12 }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                       <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#FF6B35' }}></div>
                       <span style={{ fontSize: '0.9rem', color: '#475569' }}>{t('Tuition & Fees')}</span>
                    </div>
                    <span style={{ fontWeight: 800 }}>80%</span>
                 </div>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                       <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#2D5016' }}></div>
                       <span style={{ fontSize: '0.9rem', color: '#475569' }}>{t('Books & Materials')}</span>
                    </div>
                    <span style={{ fontWeight: 800 }}>15%</span>
                 </div>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                       <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#1e293b' }}></div>
                       <span style={{ fontSize: '0.9rem', color: '#475569' }}>{t('Admin & Ops')}</span>
                    </div>
                    <span style={{ fontWeight: 800 }}>5%</span>
                 </div>
              </div>
           </div>

           <div className="card" style={{ padding: 32, background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)', color: 'white' }}>
              <Heart size={40} color="#FF6B35" style={{ marginBottom: 16 }} />
              <h3 className="hindi" style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 12 }}>{t('Thank You for Your Trust')}</h3>
              <p className="hindi" style={{ opacity: 0.8, lineHeight: 1.6, marginBottom: 24 }}>{t('Every rupee you donate directly impacts a student’s future. We maintain 100% transparency in our disbursement process.')}</p>
              <NavLink to="/donor/donations" style={{ display: 'inline-block', padding: '12px 24px', background: 'white', color: '#1e293b', borderRadius: 12, fontWeight: 800, textDecoration: 'none' }}>{t('View Detailed Ledger')}</NavLink>
           </div>
        </div>
        <div className="card" style={{ padding: 32 }}>
           <h3 className="hindi" style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: 20 }}>{t('Impact Highlights')}</h3>
           <div className="grid grid-2" style={{ gap: 20 }}>
              <div style={{ padding: 20, background: '#f8fafc', borderRadius: 16 }}>
                 <div style={{ fontWeight: 800, color: '#1e293b' }}>{t('Regional Reach')}</div>
                 <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: 4 }}>12 {t('Villages in Jharkhand')}</div>
              </div>
              <div style={{ padding: 20, background: '#f8fafc', borderRadius: 16 }}>
                 <div style={{ fontWeight: 800, color: '#1e293b' }}>{t('Success Rate')}</div>
                 <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: 4 }}>92% {t('Students continued education')}</div>
              </div>
           </div>
        </div>
      </main>
    </div>
  )
}
