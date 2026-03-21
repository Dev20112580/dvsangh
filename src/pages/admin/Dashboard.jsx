import { useEffect, useState } from 'react'
import { 
  Users, GraduationCap, Heart, IndianRupee, Shield, 
  Activity, Zap, Bell, Search, TrendingUp, AlertTriangle, 
  FileText, Database, HardDrive, Cpu, Plus, Download, UserCheck
} from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useLanguage } from '../../context/LanguageContext'
import { useAdminAuth } from '../../context/AdminAuthProvider'
import AdminLayout from '../../components/admin/AdminLayout'
import StatCard from '../../components/admin/StatCard'

export default function AdminDashboard() {
  const { adminProfile, refinedLevel } = useAdminAuth()
  const { t } = useLanguage()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    users: 0,
    applications: 0,
    pendingApplications: 0,
    totalDonations: 0,
    totalDisbursed: 0,
    events: 0,
    volunteers: 0,
    admins: 0,
    alerts: []
  })

  useEffect(() => {
    fetchDashboardData()
  }, [])

  async function fetchDashboardData() {
    try {
      setLoading(true)
      const [users, apps, pendingApps, donations, events, volunteers, disbursed, adm, highDonations] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('scholarship_applications').select('id', { count: 'exact', head: true }),
        supabase.from('scholarship_applications').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('donations').select('amount').eq('payment_status', 'completed'),
        supabase.from('events').select('id', { count: 'exact', head: true }),
        supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'volunteer'),
        supabase.from('disbursements').select('amount'),
        supabase.from('admin_accounts').select('id', { count: 'exact', head: true }),
        supabase.from('donations').select('*, profiles(full_name)').gt('amount', 50000).eq('payment_status', 'completed').limit(5)
      ])
      
      const totalDonations = (donations.data || []).reduce((s, d) => s + (d.amount || 0), 0)
      const totalDisbursed = (disbursed.data || []).reduce((s, d) => s + (d.amount || 0), 0)
      
      setStats({ 
        users: users.count || 0, 
        applications: apps.count || 0, 
        pendingApplications: pendingApps.count || 0,
        totalDonations, 
        events: events.count || 0,
        volunteers: volunteers.count || 0,
        totalDisbursed,
        admins: adm.count || 0,
        alerts: highDonations.data || []
      })
    } catch (err) {
      console.error('Error fetching dashboard stats:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
        <div className="hindi" style={{ color: '#64748b', fontSize: '1rem' }}>{t('Optimizing dashboard for your access level...')}</div>
      </div>
    )
  }

  const kpiCards = [
    { label: 'Total Users', value: stats.users.toLocaleString(), trend: '+12%', trendUp: true, icon: <Users size={20} color="#3b82f6" />, bgColor: '#eff6ff', access: ['L1', 'L2'] },
    { label: 'Pending Scholarships', value: stats.pendingApplications, trend: stats.pendingApplications > 5 ? 'High' : 'Normal', trendUp: stats.pendingApplications <= 5, icon: <GraduationCap size={20} color="#ef4444" />, bgColor: '#fef2f2', access: ['L1', 'L2', 'L3a'] },
    { label: 'Total Donations', value: `₹${(stats.totalDonations / 100000).toFixed(2)}L`, trend: '+₹45k', trendUp: true, icon: <Heart size={20} color="#ec4899" />, bgColor: '#fdf2f7', access: ['L1', 'L3b'] },
    { label: 'Impact (Disbursed)', value: `₹${(stats.totalDisbursed / 100000).toFixed(2)}L`, trend: 'Steady', trendUp: true, icon: <TrendingUp size={20} color="#d97706" />, bgColor: '#fffbeb', access: ['L1', 'L3b'] },
    { label: 'Active Volunteers', value: stats.volunteers, trend: 'Verified', trendUp: true, icon: <UserCheck size={20} color="#059669" />, bgColor: '#f0fdf4', access: ['L1', 'L2'] },
    { label: 'Admin Hierarchy', value: stats.admins, trend: 'Optimal', trendUp: true, icon: <Shield size={20} color="#6366f1" />, bgColor: '#f5f3ff', access: ['L1'] },
  ]

  const filteredKpis = kpiCards.filter(card => card.access.includes(refinedLevel))

  return (
    <AdminLayout title="System Overview">
      <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
        {/* Welcome & Quick Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32, gap: 24, flexWrap: 'wrap' }}>
          <div>
            <h1 className="hindi" style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1e293b', marginBottom: 4 }}>
              {t("Founder's Insight")}
            </h1>
            <p className="hindi" style={{ color: '#64748b', fontSize: '1rem' }}>
              {t('Welcome back')}, {adminProfile?.name}. {t('You have')} {stats.pendingApplications} {t('applications awaiting review.')}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button style={{ padding: '10px 20px', background: 'white', border: '1px solid #e2e8f0', borderRadius: 10, fontSize: '0.85rem', fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <Download size={16} /> {t('Export Financials')}
            </button>
            <button style={{ padding: '10px 20px', background: '#A1401D', color: 'white', border: 'none', borderRadius: 10, fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <Plus size={16} /> {t('New Scholarship')}
            </button>
          </div>
        </div>

        {/* KPI Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, marginBottom: 32 }}>
          {filteredKpis.map((card, idx) => (
            <StatCard key={idx} {...card} />
          ))}
        </div>

        {/* Main Insights Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 24 }}>
          {/* Financial Flow */}
          <div style={{ background: 'white', borderRadius: 20, padding: 24, border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h3 className="hindi" style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b' }}>{t('Donation Inflow (Last 6 Months)')}</h3>
              <span style={{ fontSize: '0.75rem', color: '#64748b', background: '#f1f5f9', padding: '4px 12px', borderRadius: 20 }}>FY 2024-25</span>
            </div>
            <div style={{ height: 180, display: 'flex', alignItems: 'flex-end', gap: 12, marginBottom: 16 }}>
              {[45, 60, 52, 75, 68, 85].map((h, i) => (
                <div key={i} style={{ flex: 1, position: 'relative' }}>
                  <div style={{ height: `${h}%`, background: i === 5 ? '#A1401D' : '#f1f5f9', borderRadius: '6px 6px 0 0', transition: 'all 0.3s' }} />
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600 }}>
              {['OCT', 'NOV', 'DEC', 'JAN', 'FEB', 'MAR'].map(m => <span key={m}>{m}</span>)}
            </div>
          </div>

          {/* System Health & Audit */}
          <div style={{ background: '#1e293b', borderRadius: 20, padding: 24, color: 'white' }}>
            <h3 className="hindi" style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 24 }}>{t('Platform Infrastructure')}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.85rem' }}>
                  <span style={{ color: '#94a3b8' }}>{t('Server Status')}</span>
                  <span style={{ color: '#10b981', fontWeight: 700 }}>{t('OPERATIONAL (99.98%)')}</span>
                </div>
                <div style={{ height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3 }}>
                  <div style={{ width: '99.98%', height: '100%', background: '#10b981', borderRadius: 3 }} />
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 16 }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', color: '#94a3b8', marginBottom: 8 }}>
                    <Database size={14} />
                    <span style={{ fontSize: '0.7rem', fontWeight: 700 }}>DB UPTIME</span>
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>422 {t('Days')}</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 16 }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', color: '#94a3b8', marginBottom: 8 }}>
                    <HardDrive size={14} />
                    <span style={{ fontSize: '0.7rem', fontWeight: 700 }}>STORAGE</span>
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>64.2%</div>
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{t('Supabase Realtime Sync Active')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Grid: Activity & Approvals */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 24, marginTop: 24 }}>
          {/* Escalated Tasks */}
          <div style={{ background: 'white', borderRadius: 20, padding: 24, border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 className="hindi" style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b' }}>{t('Critical Approvals')}</h3>
              <span style={{ background: '#fef2f2', color: '#ef4444', fontSize: '0.65rem', fontWeight: 800, padding: '4px 10px', borderRadius: 6 }}>{t('URGENT')}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { label: 'Foundational Grant #42', sub: '₹2.4L · Higher Education', date: 'Expiring in 2h' },
                { label: 'Event Authorization', sub: 'Annual Merit Meetup 2025', date: 'Due tomorrow' },
              ].map((task, i) => (
                <div key={i} style={{ padding: 16, background: '#f8fafc', borderRadius: 12, border: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{task.label}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{task.sub} · <span style={{ color: '#ef4444' }}>{task.date}</span></div>
                  </div>
                  <button style={{ padding: '6px 12px', background: '#A1401D', color: 'white', border: 'none', borderRadius: 6, fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>{t('REVIEW')}</button>
                </div>
              ))}
            </div>
          </div>

          {/* Audit Log Snippet */}
          <div style={{ background: 'white', borderRadius: 20, padding: 24, border: '1px solid #e2e8f0' }}>
            <h3 className="hindi" style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', marginBottom: 20 }}>{t('Recent Oversight Log')}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { user: 'S. Pandit', action: 'Modified Disbursement Policy', time: '12m ago' },
                { user: 'P. Kumar', action: 'Authenticated L3a Access', time: '1h ago' },
                { user: 'M. Sharma', action: 'Initiated Broadcast Broadcast', time: '3h ago' },
              ].map((log, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#F8F9FA', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.75rem', color: '#A1401D' }}>
                    {log.user.charAt(0)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{log.user} <span style={{ fontWeight: 400, color: '#64748b' }}>{t(log.action)}</span></div>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{log.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
