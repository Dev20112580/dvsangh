import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAdmin } from '../../context/AdminContext';

const AdminDashboard = () => {
  const { admin, can } = useAdmin();
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingApps: 0,
    monthlyDonations: 0,
    activeVolunteers: 0,
    upcomingEvents: 0,
    unreadMessages: 0,
    pendingDisbursements: 0,
    pending80G: 0,
    totalBalance: 0,
    monthlyExpenses: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0,0,0,0);

      // Parallel queries for speed
      const queries = [
        // Total users
        supabase
          .from('users')
          .select('*', { count: 'exact', head: true }),
        
        // Pending scholarship apps
        supabase
          .from('scholarship_applications')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'submitted'),
        
        // Active volunteers
        supabase
          .from('users')
          .select('*', { count: 'exact', head: true })
          .eq('role', 'volunteer')
          .eq('status', 'active'),
        
        // Upcoming events
        supabase
          .from('events')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'upcoming')
          .gte('event_date', new Date().toISOString()),
        
        // Unread admin messages (broadcast or for specific admin)
        supabase
          .from('notifications')
          .select('*', { count: 'exact', head: true })
          .eq('is_read', false)
          .or(`admin_id.eq.${admin.id},type.eq.broadcast`),
      ];

      // Add financial queries for Level 1 + Treasurer
      if (can.manageDonations) {
        queries.push(
          // Monthly donations
          supabase
            .from('donations')
            .select('amount')
            .eq('status', 'completed')
            .gte('created_at', startOfMonth.toISOString()),
          
          // Pending disbursements
          supabase
            .from('scholarship_applications')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'approved'),
          
          // Pending 80G certs
          supabase
            .from('donations')
            .select('*', { count: 'exact', head: true })
            .is('certificate_80g_url', null)
            .eq('status', 'completed'),
        );
      }

      const results = await Promise.all(queries);

      const [
        usersRes,
        pendingAppsRes,
        volunteersRes,
        eventsRes,
        messagesRes,
        ...financialResults
      ] = results;

      let financialStats = {};
      if (can.manageDonations && financialResults.length >= 3) {
        const monthDonations = financialResults[0].data || [];
        const monthTotal = monthDonations.reduce((sum, d) => sum + (d.amount || 0), 0);
        
        financialStats = {
          monthlyDonations: monthTotal,
          pendingDisbursements: financialResults[1].count || 0,
          pending80G: financialResults[2].count || 0,
        };
      }

      setStats({
        totalUsers: usersRes.count || 0,
        pendingApps: pendingAppsRes.count || 0,
        activeVolunteers: volunteersRes.count || 0,
        upcomingEvents: eventsRes.count || 0,
        unreadMessages: messagesRes.count || 0,
        ...financialStats,
      });

      // Fetch recent activity for Level 1
      if (can.viewAuditLog) {
        const { data: activity } = await supabase
          .from('audit_logs')
          .select(`
            *,
            admin:admin_users(full_name, admin_id)
          `)
          .order('created_at', { ascending: false })
          .limit(10);
        setRecentActivity(activity || []);
      }

    } catch (err) {
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="admin-dashboard">
      <h1 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <span>Welcome, {admin.name}! 👋</span>
        <span style={{ fontSize: '0.9rem', color: '#6B7280', fontWeight: 400 }}>
          Last login: {new Date(admin.lastLogin).toLocaleDateString('en-IN')}
        </span>
      </h1>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <KPICard
          icon="👥"
          label="Total Users"
          value={stats.totalUsers.toLocaleString()}
          color="blue"
        />
        <KPICard
          icon="🎓"
          label="Pending Applications"
          value={stats.pendingApps}
          color={stats.pendingApps > 10 ? 'red' : 'orange'}
          urgent={stats.pendingApps > 10}
        />
        <KPICard
          icon="🤝"
          label="Active Volunteers"
          value={stats.activeVolunteers}
          color="green"
        />
        <KPICard
          icon="📅"
          label="Upcoming Events"
          value={stats.upcomingEvents}
          color="purple"
        />
        <KPICard
          icon="💬"
          label="Unread Messages"
          value={stats.unreadMessages}
          color="teal"
        />

        {/* Financial cards — Treasurer + Founder */}
        {can.manageDonations && (
          <>
            <KPICard
              icon="💰"
              label="Donations (Month)"
              value={`₹${(stats.monthlyDonations || 0).toLocaleString('en-IN')}`}
              color="green"
            />
            <KPICard
              icon="⏳"
              label="Pending Payouts"
              value={stats.pendingDisbursements}
              color={stats.pendingDisbursements > 5 ? 'red' : 'orange'}
            />
            <KPICard
              icon="📄"
              label="80G Pending"
              value={stats.pending80G}
              color="yellow"
            />
          </>
        )}
      </div>

      {/* Quick Actions */}
      <div className="quick-actions" style={{ marginTop: 40 }}>
        <h2>Quick Actions</h2>
        <div className="quick-actions-grid">
          {can.approveScholarships && (
            <QuickAction icon="✅" label="Scholarships" path="/admin/scholarships" badge={stats.pendingApps} />
          )}
          {can.manageEvents && (
            <QuickAction icon="📅" label="Events" path="/admin/events" />
          )}
          {can.manageDonations && (
            <QuickAction icon="📄" label="80G Certificates" path="/admin/certificates" badge={stats.pending80G} />
          )}
          {can.sendNotifications && (
            <QuickAction icon="🔔" label="Broadcast" path="/admin/notifications" />
          )}
          {can.manageDisbursements && (
            <QuickAction icon="💸" label="Disbursements" path="/admin/disbursements" badge={stats.pendingDisbursements} />
          )}
          {can.manageAdmins && (
            <QuickAction icon="👑" label="Admin Accounts" path="/admin/management" />
          )}
        </div>
      </div>

      {/* Activity Feed — Level 1 only */}
      {can.viewAuditLog && (
        <div className="activity-feed">
          <h2>Security Audit Feed (Live)</h2>
          <div className="activity-list">
            {recentActivity.map(log => (
              <div key={log.id} className="activity-item">
                <span className="activity-admin">{log.admin?.full_name} ({log.admin?.admin_id})</span>
                <span className="activity-action">{log.action.replace(/_/g, ' ')}</span>
                <span className="activity-time">{new Date(log.created_at).toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const KPICard = ({ icon, label, value, color, urgent }) => (
  <div className={`kpi-card kpi-${color} ${urgent ? 'kpi-urgent' : ''}`}>
    <div className="kpi-icon">{icon}</div>
    <div className="kpi-content">
      <p className="kpi-label">{label}</p>
      <h3 className="kpi-value">{value}</h3>
    </div>
    {urgent && <span className="urgent-badge">Urgent</span>}
  </div>
);

const QuickAction = ({ icon, label, path, badge }) => (
  <Link to={path} className="quick-action-btn">
    <span className="qa-icon">{icon}</span>
    <span className="qa-label">{label}</span>
    {badge > 0 && <span className="qa-badge">{badge}</span>}
  </Link>
);

const DashboardSkeleton = () => (
  <div className="admin-dashboard">
    <div className="skeleton" style={{ height: 40, width: 300, marginBottom: 32 }} />
    <div className="kpi-grid">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="kpi-card skeleton" style={{ height: 110 }} />
      ))}
    </div>
  </div>
);

export default AdminDashboard;
