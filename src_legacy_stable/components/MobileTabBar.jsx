import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const MobileTabBar = () => {
  const { user } = useAuth();
  if (!user) return null;

  const tabs = {
    student: [
      { icon: '🏠', label: 'Home', path: '/dashboard/student' },
      { icon: '🎓', label: 'Apply', path: '/scholarship/apply' },
      { icon: '📚', label: 'Study', path: '/student/materials' },
      { icon: '📋', label: 'Apps', path: '/student/applications' },
      { icon: '👤', label: 'Profile', path: '/student/profile' },
    ],
    volunteer: [
      { icon: '🏠', label: 'Home', path: '/dashboard/volunteer' },
      { icon: '✅', label: 'Tasks', path: '/volunteer/tasks' },
      { icon: '⏱️', label: 'Hours', path: '/volunteer/hours' },
      { icon: '🔍', label: 'Find', path: '/volunteer/opportunities' },
      { icon: '👤', label: 'Profile', path: '/volunteer/profile' },
    ],
    donor: [
      { icon: '🏠', label: 'Home', path: '/dashboard/donor' },
      { icon: '💝', label: 'Donate', path: '/donate' },
      { icon: '📊', label: 'Impact', path: '/donor/impact' },
      { icon: '📄', label: 'History', path: '/donor/donations' },
      { icon: '👤', label: 'Profile', path: '/donor/profile' },
    ],
  };

  const currentTabs = tabs[user.role];
  if (!currentTabs) return null;

  return (
    <nav className="mobile-tab-bar">
      {currentTabs.map(tab => (
        <NavLink
          key={tab.path}
          to={tab.path}
          className={({ isActive }) =>
            `tab-item ${isActive ? 'active' : ''}`
          }
        >
          <span className="tab-icon">{tab.icon}</span>
          <span>{tab.label}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default MobileTabBar;
