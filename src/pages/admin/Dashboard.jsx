import { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import {
  LayoutDashboard, Users, GraduationCap, Heart, Calendar, FileText,
  MessageCircle, LogOut, IndianRupee, Globe, Bell, Search, AlertTriangle,
  TrendingUp, Activity, Download, Plus, Shield, Cpu, Database, HardDrive,
  UserCheck, Lock, History, Settings, Zap, Menu
} from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'
import { useLockdown } from '../../context/LockdownContext'

// --- Shared Admin Layout ---
export function AdminLayout({ children, title, adminInfo: propAdminInfo }) {
  const { signOut, user } = useAuth()
  const [adminInfo, setAdminInfo] = useState(propAdminInfo || null)
  const [loading, setLoading] = useState(!propAdminInfo)
  const { t, language } = useLanguage()
  const { isLockdown, toggleLockdown } = useLockdown()
  const navigate = useNavigate()
  const [showNotifications, setShowNotifications] = useState(false)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  // Standard responsive hooks
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (!adminInfo && user) {
      fetchAdminInfo()
    }
  }, [user])

  async function fetchAdminInfo() {
    const { data } = await supabase.from('admin_accounts').select('*').eq('user_id', user.id).single()
    setAdminInfo(data)
    setLoading(false)
  }

  const notifications = adminInfo?.level === 'L1' ? [
    { title: 'Security Alert', desc: 'Login from unknown device in Dumka', time: '2m ago', urgent: true },
    { title: 'Major Donation', desc: '₹1,25,000 received from Sanjay K.', time: '1h ago', urgent: false },
    { title: 'System Health', desc: 'Backup completed successfully', time: '4h ago', urgent: false },
  ] : adminInfo?.level === 'L3b' ? [
    { title: 'New Donation', desc: '₹500 received (General)', time: '10m ago', urgent: false },
    { title: 'Large Donation', desc: '₹55,000 received (Hostel Fund)', time: '2h ago', urgent: true },
    { title: 'Disbursement Alert', desc: 'Batch #12 pending for 8 days', time: '1d ago', urgent: true },
  ] : [
    { title: 'New Task', desc: 'Review Rahul M. Scholarship App', time: '30m ago', urgent: false },
    { title: 'Event Update', desc: 'Annual Meetup venue confirmed', time: '3h ago', urgent: false },
  ]

  // RBAC Roles:
  // L1: Founder (Full)
  // L2: VP (Ops focus - No Finance/Settings)
  // L3a: Asst Sec (Support focus - No Approvals/Finance/Settings)
  // L3b: Treasurer (Finance focus - No Content/Users)
  
  const navLinks = [
    { to: '/admin/dashboard', icon: <LayoutDashboard size={16} />, label: 'Dashboard', access: ['L1', 'L2', 'L3a', 'L3b', 'super_admin'] },
    { to: '/admin/users', icon: <Users size={16} />, label: 'Users', access: ['L1', 'L2'] },
    { to: '/admin/management', icon: <Shield size={16} />, label: 'Admin Hierarchy', access: ['L1'] },
    { to: '/admin/performance', icon: <Activity size={16} />, label: 'Admin Performance', access: ['L1'] },
    { to: '/admin/scholarships', icon: <GraduationCap size={16} />, label: 'Scholarships', access: ['L1', 'L2', 'L3a'] },
    { to: '/admin/donations', icon: <IndianRupee size={16} />, label: 'Finance', access: ['L1', 'L3b'] }, 
    { to: '/admin/events', icon: <Calendar size={16} />, label: 'Events', access: ['L1', 'L2', 'L3a'] },
    { to: '/admin/content', icon: <FileText size={16} />, label: 'Content', access: ['L1', 'L2', 'L3a'] },
    { to: '/admin/workflows', icon: <Zap size={16} />, label: 'Workflows', access: ['L1'] },
    {to: '/admin/communication', icon: <MessageCircle size={16} />, label: 'Broadcast', access: ['L1', 'L2']},
    { to: '/admin/reports', icon: <Activity size={16} />, label: 'Reports', access: ['L1', 'L2', 'L3b'] },
    { to: '/admin/audit', icon: <History size={16} />, label: 'Audit Trail', access: ['L1'] },
    { to: '/admin/chat', icon: <MessageCircle size={16} />, label: 'Messages', access: ['L1', 'L2', 'L3a', 'L3b', 'super_admin'] },
    { to: '/admin/settings', icon: <Settings size={16} />, label: 'Settings', access: ['L1', 'super_admin'] },
  ]

  const filteredLinks = navLinks.filter(link => {
    const level = adminInfo?.level || 'L1'
    if (level === 'super_admin') return true // Super admin sees all
    return link.access.includes(level)
  })

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#f8fafc' }}>
    <div className="hindi" style={{ fontSize: '1rem', color: '#64748b' }}>{t('Authorizing access...')}</div>
  </div>

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', position: 'relative' }}>
      {/* Sidebar Overlay for Mobile */}
      {isMobile && isMobileSidebarOpen && (
        <div 
          onClick={() => setIsMobileSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIindex: 45, backdropFilter: 'blur(2px)' }} 
        />
      )}

      {/* Sidebar */}
      <aside style={{ 
        width: 240, 
        background: 'white', 
        borderRight: '1px solid #e2e8f0', 
        display: 'flex', 
        flexDirection: 'column', 
        position: 'fixed', 
        top: 0, 
        bottom: 0, 
        zIndex: 50, 
        overflow: 'hidden',
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: isMobile ? (isMobileSidebarOpen ? 'translateX(0)' : 'translateX(-100%)') : 'none'
      }}>
        {/* Brand */}
        <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid #f1f5f9' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <img src="/logo_dvs.jpg" alt="DVS Logo" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} />
            <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#111' }}>{t('DVS Admin')}</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
            {adminInfo?.full_name || 'Admin'} <span style={{ color: '#A1401D', fontWeight: 600 }}>· {t(adminInfo?.level?.toUpperCase() || 'FOUNDER')}</span>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ padding: '16px 0', flex: 1, overflowY: 'auto' }}>
          {filteredLinks.map(link => (
            <NavLink key={link.to} to={link.to}
              onClick={() => isMobile && setIsMobileSidebarOpen(false)}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '9px 20px', fontSize: '0.85rem', fontWeight: isActive ? 600 : 400,
                color: isActive ? '#A1401D' : '#4b5563', background: isActive ? '#fff7ed' : 'transparent',
                borderLeft: isActive ? '3px solid #A1401D' : '3px solid transparent',
                textDecoration: 'none', transition: 'all 0.15s'
              })}>
              {link.icon} {t(link.label)}
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid #f1f5f9' }}>
          <button
            onClick={() => {
              const newState = !isLockdown
              toggleLockdown(newState)
              // Simulated Audit Log
              console.log(`Audit: ${adminInfo?.admin_id} triggered Lockdown: ${newState}`)
            }}
            className="hindi"
            style={{ width: '100%', padding: '10px 12px', background: isLockdown ? '#dc2626' : '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, fontSize: '0.78rem', fontWeight: 700, color: '#dc2626', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 8 }}
          >
            <Lock size={14} /> {isLockdown ? `• ${t('LOCKDOWN ACTIVE')}` : t('Emergency Lockdown')}
          </button>
          <div style={{ display: 'flex', gap: 12, padding: '4px 0' }}>
            <button className="hindi" style={{ fontSize: '0.75rem', color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Shield size={14} /> {t('System Health')}
            </button>
            <button className="hindi" style={{ fontSize: '0.75rem', color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer' }}>
              {t('Support')}
            </button>
          </div>
        </div>

        {/* Status bar */}
        <div style={{ padding: '8px 20px', background: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', gap: 16, fontSize: '0.7rem', color: '#6b7280' }}>
          <span className="hindi" style={{ color: '#22c55e', fontWeight: 600 }}>● {t('HEALTH')}: {t('OPTIMAL')}</span>
          <span className="hindi">✉ {t('CHATS')} (12)</span>
          <span className="hindi">⚡ {t('SYNC')}: {t('LIVE')}</span>
        </div>
      </aside>

      {/* Main */}
      <div style={{ 
        marginLeft: isMobile ? 0 : 240, 
        width: isMobile ? '100%' : 'calc(100% - 240px)', 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh',
        transition: 'margin-left 0.3s'
      }}>
        {/* Topbar */}
        <div style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: isMobile ? '0 16px' : '0 32px', height: 60, display: 'flex', alignItems: 'center', gap: isMobile ? 12 : 24, position: 'sticky', top: 0, zIndex: 40 }}>
          {isMobile && (
            <button 
              onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
              style={{ background: 'none', border: 'none', padding: 8, display: 'flex', alignItems: 'center', color: '#4b5563' }}
            >
              <Menu size={24} />
            </button>
          )}
          
          <div style={{ flex: isMobile ? 0 : 1, display: isMobile ? 'none' : 'flex', alignItems: 'center', gap: 10, background: '#f8fafc', borderRadius: 8, padding: '8px 14px', maxWidth: 360 }}>
            <Search size={15} color="#9ca3af" />
            <input className="hindi" placeholder={t('Global Archive Search...')} style={{ border: 'none', background: 'none', outline: 'none', fontSize: '0.85rem', color: '#374151', width: '100%' }} />
          </div>
          <div style={{ flex: 1 }} />
          {!isMobile && adminInfo?.admin_id && (
            <span style={{ fontSize: '0.78rem', color: '#6b7280', fontWeight: 500 }}>ID: {adminInfo.admin_id}</span>
          )}
          {adminInfo?.level === 'super_admin' && (
            <span className="hindi" style={{ fontSize: '0.7rem', fontWeight: 700, padding: '3px 8px', background: '#A1401D', color: 'white', borderRadius: 4, letterSpacing: 0.5 }}>{t('SUPER ADMIN')}</span>
          )}
          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              style={{ width: 36, height: 36, borderRadius: '50%', background: '#f3f4f6', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bell size={16} color="#6b7280" />
              <span style={{ position: 'absolute', top: 6, right: 6, width: 8, height: 8, background: '#ef4444', borderRadius: '50%' }}></span>
            </button>
            
            {showNotifications && (
              <div style={{ position: 'absolute', top: 48, right: 0, width: 320, background: 'white', borderRadius: 12, boxShadow: '0 10px 25px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0', zIndex: 1000, overflow: 'hidden' }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', fontWeight: 800, fontSize: '0.9rem' }}>{t('Notifications')}</div>
                <div style={{ maxHeight: 400, overflowY: 'auto' }}>
                  {notifications.map((n, i) => (
                    <div key={i} style={{ padding: '14px 20px', borderBottom: '1px solid #f8fafc', background: n.urgent ? '#fff7ed' : 'white' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                         <span style={{ fontWeight: 700, fontSize: '0.8rem', color: n.urgent ? '#ea580c' : '#111' }}>{t(n.title)}</span>
                         <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{n.time}</span>
                      </div>
                      <div className="hindi" style={{ fontSize: '0.8rem', color: '#64748b' }}>{t(n.desc)}</div>
                    </div>
                  ))}
                </div>
                <button onClick={() => setShowNotifications(false)} style={{ width: '100%', padding: '12px', background: '#f8fafc', border: 'none', fontSize: '0.8rem', fontWeight: 700, color: '#6366f1', cursor: 'pointer' }}>{t('Mark all as read')}</button>
              </div>
            )}
          </div>
          <button
            onClick={async () => { await signOut(); navigate('/admin/login') }}
            style={{ width: 36, height: 36, borderRadius: '50%', background: '#f3f4f6', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <LogOut size={16} color="#6b7280" />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: 32, flex: 1 }}>
          {children}
        </div>
      </div>
    </div>
  )
}

// --- Founder Dashboard ---
export default function AdminDashboard() {
  const [stats, setStats] = useState({})
  const [adminInfo, setAdminInfo] = useState(null)
  const { user } = useAuth()
  const { t, language } = useLanguage()
  const navigate = useNavigate()
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    if (user) {
      const { data } = await supabase.from('admin_accounts').select('*').eq('user_id', user.id).single()
      setAdminInfo(data)
    }

    try {
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
    }
  }

  const kpiCards = [
    { label: 'Total Users', value: stats.users?.toLocaleString(language === 'hi' ? 'hi-IN' : 'en-IN') || '0', sub: t('Platform-wide'), icon: <Users size={20} color="#A1401D" />, color: '#fff7ed', urgent: false },
    { label: 'Pending Scholarships', value: stats.pendingApplications || '0', sub: `${stats.applications || 0} ${t('Total Applications')}`, icon: <GraduationCap size={20} color="#dc2626" />, color: '#fef2f2', urgent: (stats.pendingApplications > 5) },
    { label: 'Total Admins', value: stats.admins || '0', sub: t('Active Hierarchy'), icon: <Shield size={20} color="#0369a1" />, color: '#f0f9ff', urgent: false },
    { label: 'Active Volunteers', value: stats.volunteers || '0', sub: t('Verified Personnel'), icon: <UserCheck size={20} color="#065f46" />, color: '#f0fdf4', urgent: false },
    { label: 'Total Donations', value: `₹${(stats.totalDonations || 0).toLocaleString(language === 'hi' ? 'hi-IN' : 'en-IN')}`, sub: t('Funds received'), icon: <Heart size={20} color="#db2777" />, color: '#fdf2f7', urgent: false },
    { label: 'Total Disbursed', value: `₹${(stats.totalDisbursed || 0).toLocaleString(language === 'hi' ? 'hi-IN' : 'en-IN')}`, sub: t('Net Impact'), icon: <TrendingUp size={20} color="#d97706" />, color: '#fffbeb', urgent: false },
    { label: 'Platform Events', value: stats.events || '0', sub: t('Upcoming sessions'), icon: <Calendar size={20} color="#7c3aed" />, color: '#faf5ff', urgent: false },
    { label: 'System Health', value: 'OPTIMAL', sub: `● ${t('LIVE')}`, icon: <Cpu size={20} color="#059669" />, color: '#f0fdf4', urgent: false },
  ]

  const activityFeed = [
    { icon: <AlertTriangle size={14} color="#dc2626" />, bg: '#fef2f2', text: 'Neha K. flagged a suspicious donation', time: '3 hours ago', sub: 'ID: TXN-4421' },
  ]

  const escalated = [
    { label: '₹1,50,000 Disbursement', sub: 'Legacy Grant · St. Jude\'s Academy', icon: <IndianRupee size={14} />, action: t('APPROVE'), danger: false },
    { label: 'New Partner Onboarding', sub: 'Global Ed Alliance · NGO-402', icon: <Users size={14} />, action: t('REVIEW'), danger: false },
    { label: 'Bylaw Revision v2.4', sub: 'Legal Dept · Policy Change', icon: <FileText size={14} />, action: t('APPROVE'), danger: false },
  ]

  // Dynamic role-based filtering (Simulated)
  const isTreasurer = adminInfo?.role === 'Treasurer'
  const isVP = adminInfo?.role?.includes('VP')
  
  const filteredKpiCards = kpiCards.filter(card => {
    if (isTreasurer) return ['Monthly Donations', 'Total Disbursed'].includes(card.label)
    if (isVP) return ['Pending Scholarships', 'Active Volunteers', 'Upcoming Events'].includes(card.label)
    return true // Founder sees all
  })

  return (
    <AdminLayout title={t("Founder's Dashboard")} adminInfo={adminInfo}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: isMobile ? 'center' : 'flex-start', marginBottom: 28, flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 20 : 0 }}>
        <div style={{ textAlign: isMobile ? 'center' : 'left' }}>
          <h1 className="hindi" style={{ fontSize: isMobile ? '1.5rem' : '1.75rem', fontWeight: 800, color: '#111', marginBottom: 4 }}>{t('Founder\'s Control')}</h1>
          <p className="hindi" style={{ color: '#6b7280', fontSize: '0.9rem' }}>
            {t('Welcome back')}, {adminInfo?.full_name || 'Admin'}. {t('System integrity is')} <span style={{ color: '#22c55e', fontWeight: 600 }}>{t('OPTIMAL')}.</span>
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12, width: isMobile ? '100%' : 'auto' }}>
          <button className="hindi" style={{ flex: isMobile ? 1 : 'none', padding: '10px 20px', border: '1px solid #e2e8f0', background: 'white', borderRadius: 8, fontSize: '0.85rem', fontWeight: 600, color: '#374151', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <Download size={15} /> {!isMobile && t('Export Ledger')}
          </button>
          <button className="hindi" style={{ flex: isMobile ? 1 : 'none', padding: '10px 20px', background: '#A1401D', border: 'none', borderRadius: 8, fontSize: '0.85rem', fontWeight: 600, color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <Plus size={15} /> {!isMobile && t('New Grant')}
          </button>
        </div>
      </div>

      {/* Admin Performance Scorecards (Founder Only) */}
      <div style={{ marginBottom: 28, background: '#f8fafc', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0' }}>
         <h4 className="hindi" style={{ fontSize: '0.85rem', fontWeight: 800, color: '#64748b', marginBottom: 16, textTransform: 'uppercase' }}>{t('Admin Performance Control')}</h4>
         <div style={{ display: 'flex', gap: 20, overflowX: 'auto', paddingBottom: 10 }}>
            <p style={{ color: 'var(--gray-500)', fontSize: '0.85rem' }}>{t('No recent performance data available for this cycle.')}</p>
         </div>
      </div>

      {/* High-Value Financial Alerts */}
      {stats.alerts?.length > 0 && (
        <div style={{ marginBottom: 28 }}>
           {stats.alerts.map(alert => (
             <div key={alert.id} style={{ 
               background: 'linear-gradient(90deg, #ef4444 0%, #dc2626 100%)', 
               color: 'white', 
               padding: '14px 24px', 
               borderRadius: 12, 
               display: 'flex', 
               alignItems: 'center', 
               justifyContent: 'space-between',
               marginBottom: 10,
               boxShadow: '0 4px 6px -1px rgba(220, 38, 38, 0.2)'
             }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ background: 'rgba(255,255,255,0.2)', padding: 10, borderRadius: '50%' }}><TrendingUp size={20} /></div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{t('Major Donation Alert')}</div>
                    <div className="hindi" style={{ fontSize: '0.8rem', opacity: 0.9 }}>
                      ₹{alert.amount.toLocaleString()} received from {alert.profiles?.full_name || 'Anonymous'}. {t('Flagged for personal acknowledgment.')}
                    </div>
                  </div>
               </div>
               <button 
                 onClick={() => navigate('/admin/donations')}
                 style={{ background: 'white', color: '#dc2626', border: 'none', padding: '8px 16px', borderRadius: 8, fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
               >
                 {t('ACKNOWLEDGE')}
               </button>
             </div>
           ))}
        </div>
      )}

      {/* 8 KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
        {filteredKpiCards.map((card, i) => (
          <div key={i} style={{ background: 'white', borderRadius: 12, padding: '20px 20px', border: '1px solid #e2e8f0', position: 'relative', overflow: 'hidden' }}>
            {card.urgent && (
              <span className="hindi" style={{ position: 'absolute', top: 12, right: 12, background: '#dc2626', color: 'white', fontSize: '0.6rem', fontWeight: 700, padding: '2px 8px', borderRadius: 4, letterSpacing: 1 }}>{t('URGENT')}</span>
            )}
            <div style={{ width: 40, height: 40, background: card.color, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
              {card.icon}
            </div>
            <div className="hindi" style={{ fontSize: '0.7rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>{t(card.label)}</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#111', lineHeight: 1 }}>{card.value}</div>
            <div className="hindi" style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: 4 }}>{card.sub}</div>
          </div>
        ))}
      </div>

      {/* Program Performance */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 20, marginBottom: 20 }}>
         <div style={{ background: 'white', borderRadius: 12, padding: 24, border: '1px solid #e2e8f0' }}>
            <h3 className="hindi" style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 20 }}>{t('Platform Status')}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', color: '#64748b' }}>{t('Database Status')}</span>
                  <span style={{ color: '#10b981', fontWeight: 600, fontSize: '0.85rem' }}>{t('Connected')}</span>
               </div>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', color: '#64748b' }}>{t('Edge Functions')}</span>
                  <span style={{ color: '#10b981', fontWeight: 600, fontSize: '0.85rem' }}>{t('Active')}</span>
               </div>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', color: '#64748b' }}>{t('Storage Utilization')}</span>
                  <span style={{ color: '#111', fontWeight: 600, fontSize: '0.85rem' }}>64%</span>
               </div>
            </div>
         </div>
         <div style={{ background: 'white', borderRadius: 12, padding: 24, border: '1px solid #e2e8f0' }}>
            <h3 className="hindi" style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 20 }}>{t('Program Success %')}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
               {[
                 { name: 'Higher Ed Support', val: 92, color: '#10B981' },
                 { name: '10th Board Reward', val: 78, color: '#3b82f6' }
               ].map(p => (
                 <div key={p.name}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: 4 }}>
                       <span>{t(p.name)}</span>
                       <span style={{ fontWeight: 700 }}>{p.val}%</span>
                    </div>
                    <div style={{ height: 6, background: '#f1f5f9', borderRadius: 3 }}>
                       <div style={{ height: '100%', width: `${p.val}%`, background: p.color, borderRadius: 3 }}></div>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </div>

      {/* Bottom Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* Financial Overview */}
        <div style={{ background: 'white', borderRadius: 12, padding: 24, border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 className="hindi" style={{ fontSize: '1rem', fontWeight: 700, color: '#111' }}>{t('Financial Overview')}</h3>
            <span style={{ fontSize: '0.75rem', color: '#6b7280', padding: '4px 10px', background: '#f3f4f6', borderRadius: 6 }}>{t('FY 2024-25')}</span>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', height: 100, marginBottom: 16 }}>
            {[40, 55, 48, 70, 62, 80].map((h, i) => (
              <div key={i} style={{ flex: 1, background: i === 5 ? '#1d4ed8' : '#bfdbfe', borderRadius: '4px 4px 0 0', height: `${h}%`, transition: 'all 0.3s' }}></div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 6, fontSize: '0.65rem', color: '#9ca3af', justifyContent: 'space-between' }}>
            {['OCT', 'NOV', 'DEC', 'JAN', 'FEB', 'MAR'].map(m => <span key={m}>{m}</span>)}
          </div>
          <div style={{ display: 'flex', gap: 16, marginTop: 16, paddingTop: 16, borderTop: '1px solid #f1f5f9' }}>
            {[
              ['Corporate', '54%', '#1d4ed8'], 
              ['Individual', '26%', '#60a5fa'], 
              ['Govt', '12%', '#93c5fd'], 
              ['Other', '8%', '#dbeafe']
            ].map(([l,v,c]) => (
              <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: c }}></div>
                <span className="hindi" style={{ fontSize: '0.7rem', color: '#6b7280' }}>{t(l)} {v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* System Health */}
        <div style={{ background: '#1e293b', borderRadius: 12, padding: 24, color: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 className="hindi" style={{ fontSize: '1rem', fontWeight: 700 }}>{t('System Health')}</h3>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#22c55e' }}></div>
          </div>
          {[
            { label: 'Server Uptime', value: '99.98%', width: '99%' },
          ].map(item => (
            <div key={item.label} style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span className="hindi" style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{t(item.label)}</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{item.value}</span>
              </div>
              <div style={{ height: 4, background: '#334155', borderRadius: 4 }}>
                <div style={{ height: '100%', width: item.width, background: '#22c55e', borderRadius: 4 }}></div>
              </div>
            </div>
          ))}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 16 }}>
            {[
              { icon: <Database size={14} />, label: 'DB SIZE', value: '12.4 GB' },
              { icon: <HardDrive size={14} />, label: 'STORAGE USED', value: '64%' },
            ].map(item => (
              <div key={item.label} style={{ background: '#334155', borderRadius: 8, padding: 12 }}>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center', color: '#94a3b8', marginBottom: 4 }}>
                  {item.icon}
                  <span className="hindi" style={{ fontSize: '0.65rem', letterSpacing: 0.5 }}>{t(item.label)}</span>
                </div>
                <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{item.value}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16, padding: '12px 14px', background: '#334155', borderRadius: 8 }}>
            <div className="hindi" style={{ fontSize: '0.65rem', color: '#94a3b8', marginBottom: 2 }}>{t('LAST BACKUP TIMESTAMP')}</div>
            <div className="hindi" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem' }}>
              <Activity size={13} color="#22c55e" />Today, 04:00 AM ({t('Daily Auto')})
            </div>
          </div>
        </div>
      </div>

      {/* Activity & Escalated */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Live Activity */}
        <div style={{ background: 'white', borderRadius: 12, padding: 24, border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 className="hindi" style={{ fontSize: '1rem', fontWeight: 700, color: '#111' }}>{t('Live Admin Activity')}</h3>
            <button className="hindi" style={{ fontSize: '0.75rem', color: '#1d4ed8', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>{t('VIEW HISTORY')}</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {activityFeed.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 12 }}>
                <div style={{ width: 34, height: 34, borderRadius: '50%', background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {item.icon}
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', color: '#111', fontWeight: 500 }}>{item.text}</div>
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{item.time} · {item.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Escalated */}
        <div style={{ background: 'white', borderRadius: 12, padding: 24, border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 className="hindi" style={{ fontSize: '1rem', fontWeight: 700, color: '#111' }}>{t('Escalated Approvals')}</h3>
            <span className="hindi" style={{ fontSize: '0.65rem', fontWeight: 700, padding: '3px 8px', background: '#fef2f2', color: '#dc2626', borderRadius: 4, letterSpacing: 0.5 }}>{t('ACTION REQUIRED')}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {escalated.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: '#f8fafc', borderRadius: 10, border: '1px solid #f1f5f9' }}>
                <div style={{ width: 32, height: 32, background: '#eff6ff', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1d4ed8', flexShrink: 0 }}>
                  {item.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#111' }}>{item.label}</div>
                  <div style={{ fontSize: '0.72rem', color: '#9ca3af' }}>{item.sub}</div>
                </div>
                <button className="hindi" style={{ padding: '6px 12px', background: '#1d4ed8', color: 'white', border: 'none', borderRadius: 6, fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>{item.action}</button>
              </div>
            ))}
          </div>
          <button className="hindi" style={{ marginTop: 16, width: '100%', padding: 10, background: 'none', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: '0.8rem', color: '#6b7280', cursor: 'pointer', fontWeight: 500 }}>
            {t('VIEW ALL')} 14 {t('PENDING')}
          </button>
        </div>
      </div>
    </AdminLayout>
  )
}

export { AdminLayout as default_layout }
