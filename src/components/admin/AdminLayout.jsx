import { Link, useLocation, Navigate, Outlet } from 'react-router-dom';
import { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import AdminNotificationBell from './AdminNotificationBell';

const AdminLayout = () => {
  const { admin, logout, can, loading } = useAdmin();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#f8fafc' }}>
    <div className="hindi" style={{ fontSize: '1.2rem', color: '#64748b' }}>प्रशासक लोड हो रहा है...</div>
  </div>;
  if (!admin) return <Navigate to="/admin/login" />;

  // Build sidebar based on permissions
  const sidebarItems = [
    { 
      icon: '📊', label: 'Dashboard', 
      path: '/admin/dashboard', 
      show: true 
    },
    { 
      icon: '👥', label: 'Users', 
      path: '/admin/users', 
      show: can.manageUsers 
    },
    { 
      icon: '🎓', label: 'Scholarships', 
      path: '/admin/scholarships', 
      show: can.reviewApplications 
    },
    { 
      icon: '💰', label: 'Donations', 
      path: '/admin/donations', 
      show: can.manageDonations 
    },
    { 
      icon: '💸', label: 'Disbursements', 
      path: '/admin/disbursements', 
      show: can.manageDisbursements 
    },
    { 
      icon: '📄', label: '80G Certificates', 
      path: '/admin/certificates', 
      show: can.generate80G 
    },
    { 
      icon: '🧾', label: 'Expenses', 
      path: '/admin/expenses', 
      show: can.manageExpenses 
    },
    { 
      icon: '📊', label: 'Financial Reports', 
      path: '/admin/reports', 
      show: can.manageDonations 
    },
    { 
      icon: '🏦', label: 'Bank Recon', 
      path: '/admin/bank', 
      show: can.bankReconciliation 
    },
    { 
      icon: '📅', label: 'Events', 
      path: '/admin/events', 
      show: can.manageEvents 
    },
    { 
      icon: '📝', label: 'Content', 
      path: '/admin/content', 
      show: can.uploadMaterials 
    },
    { 
      icon: '📸', label: 'Gallery', 
      path: '/admin/gallery', 
      show: can.manageGallery 
    },
    { 
      icon: '🔔', label: 'Notifications', 
      path: '/admin/notifications', 
      show: can.sendNotifications 
    },
    { 
      icon: '💬', label: 'Admin Chat', 
      path: '/admin/chat', 
      show: true 
    },
    { 
      icon: '✅', label: 'Tasks', 
      path: '/admin/tasks', 
      show: true 
    },
    { 
      icon: '📋', label: 'Audit Trail', 
      path: '/admin/audit', 
      show: can.viewAuditLog 
    },
    { 
      icon: '👑', label: 'Admin Accounts', 
      path: '/admin/management', 
      show: can.manageAdmins 
    },
    { 
      icon: '⚙️', label: 'System Settings', 
      path: '/admin/settings', 
      show: can.systemSettings 
    },
  ].filter(item => item.show);

  return (
    <div className="admin-layout">
      
      {/* Top Bar */}
      <header className="admin-topbar">
        <button 
          className="sidebar-toggle"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{ display: 'block' }}
        >
          ☰
        </button>
        
        <div className="admin-topbar-logo">
          <img src="/logo_dvs.jpg" 
               alt="DVS" width="36" height="36" style={{ borderRadius: '50%' }} />
          <span>DVS Admin</span>
        </div>

        <div className="admin-topbar-right">
          <AdminNotificationBell />
          
          <div className="admin-info">
            <div className="admin-avatar">
              {admin.name?.charAt(0)}
            </div>
            <div className="admin-meta">
              <span className="admin-name">
                {admin.name}
              </span>
              <span className="admin-designation">
                {admin.designation}
              </span>
            </div>
          </div>

          <button 
            onClick={logout}
            className="logout-btn"
            style={{ background: '#374151', color: 'white', border: 'none', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}
          >
            Logout
          </button>
        </div>
      </header>

      <div className="admin-body">
        {/* Sidebar */}
        <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
          
          <div className="sidebar-profile">
            <div className="sidebar-avatar">
              {admin.name?.charAt(0)}
            </div>
            <div>
              <p className="sidebar-name">
                {admin.name}
              </p>
              <span className={`admin-level-badge level-${admin.level}`}>
                {admin.level === 1 && '⭐ Super Admin'}
                {admin.level === 2 && '🔵 VP / Secretary'}
                {admin.level === 3 && '🟢 Level 3'}
              </span>
              <p className="sidebar-id">
                {admin.adminId}
              </p>
            </div>
          </div>

          <nav className="sidebar-nav">
            {sidebarItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`sidebar-item ${location.pathname === item.path ? 'active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <span className="sidebar-icon">
                  {item.icon}
                </span>
                <span className="sidebar-label">
                  {item.label}
                </span>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div 
            className="sidebar-overlay"
            onClick={() => setSidebarOpen(false)}
            style={{ display: 'block' }}
          />
        )}

        {/* Main Content */}
        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
