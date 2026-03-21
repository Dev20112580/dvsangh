import { Routes, Route, Outlet, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

// Public Pages
import Home from './pages/Home'
import About from './pages/About'
import Programs from './pages/Programs'
import Gallery from './pages/Gallery'
import News from './pages/News'
import Events from './pages/Events'
import SuccessStories from './pages/SuccessStories'
import Contact from './pages/Contact'
import Donate from './pages/Donate'
import PrivacyPolicy from './pages/PrivacyPolicy'
import Terms from './pages/Terms'

// Auth Pages
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'

// Dashboards
import StudentDashboard from './pages/student/Dashboard'
import ScholarshipApply from './pages/student/ScholarshipApply'
import StudentApplications from './pages/student/Applications'
import StudentMaterials from './pages/student/Materials'
import StudentProfile from './pages/student/Profile'
import ApplicationDetail from './pages/student/ApplicationDetail'
import Forum from './pages/Community/Forum'
import Announcements from './pages/Community/Announcements'
import StudyGroups from './pages/Community/StudyGroups'
import Mentorship from './pages/Community/Mentorship'
import StudyBuddy from './pages/Community/StudyBuddy'
import LiveSessions from './pages/Community/LiveSessions'
import CollaborativeNotes from './pages/Community/CollaborativeNotes'
import Contests from './pages/Community/Contests'

import VolunteerDashboard from './pages/volunteer/Dashboard'
import VolunteerTasks from './pages/volunteer/Tasks'
import VolunteerHours from './pages/volunteer/Hours'
import VolunteerProfile from './pages/volunteer/Profile'

import DonorDashboard from './pages/donor/Dashboard'
import DonorDonations from './pages/donor/Donations'
import DonorImpact from './pages/donor/Impact'
import DonorProfile from './pages/donor/Profile'

// Admin
import AdminLogin from './pages/admin/Login'
import AdminDashboard from './pages/admin/Dashboard'
import AdminUsers from './pages/admin/Users'
import AdminScholarships from './pages/admin/Scholarships'
import AdminDonations from './pages/admin/Donations'
import AdminEvents from './pages/admin/Events'
import AdminContent from './pages/admin/Content'
import AdminChat from './pages/admin/Chat'
import AdminManagement from './pages/admin/AdminManagement'
import AdminSettings from './pages/admin/Settings'
import AdminAuditLogs from './pages/admin/AuditLogs'
import AdminWorkflows from './pages/admin/Workflows'
import AdminCommunication from './pages/admin/Communication'
import AdminReports from './pages/admin/ReportGenerator'
import AdminPerformance from './pages/admin/Performance'
import SearchPage from './pages/Search'
import NotFound from './pages/NotFound'
import { useLockdown } from './context/LockdownContext'
import { ShieldAlert } from 'lucide-react'

import AchievementWall from './pages/Public/AchievementWall'
import SocialFeed from './pages/Community/SocialFeed'
import ParentPortal from './pages/Community/ParentPortal'
import Leaderboard from './pages/Community/Leaderboard'

// Layouts
import GuruBot from './components/GuruBot'
import PWAInstallPrompt from './components/PWAInstallPrompt'

function MainLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
      <GuruBot />
    </>
  )
}

function DashboardLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <GuruBot />
    </>
  )
}

function ProtectedRoute({ allowedRoles, children }) {
  const { user, profile, loading } = useAuth()
  if (loading) return <div style={{ marginTop: 120, textAlign: 'center', padding: 40 }}>Loading...</div>
  if (!user) {
    const isAdminPath = window.location.pathname.startsWith('/admin')
    return <Navigate to={isAdminPath ? "/admin/login" : "/login"} replace />
  }
  if (allowedRoles && profile && !allowedRoles.includes(profile.role)) return <Navigate to="/" replace />
  return children || <Outlet />
}

export default function App() {
  const { isLockdown } = useLockdown()

  return (
    <div style={{ position: 'relative' }}>
      {isLockdown && (
        <div style={{ background: '#dc2626', color: 'white', padding: '12px', textAlign: 'center', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, position: 'sticky', top: 0, zIndex: 10000 }}>
           <ShieldAlert size={18} /> 
           <span className="hindi">EMERGENCY LOCKDOWN ACTIVE: SITE IS READ-ONLY / आपातकालीन लॉकडाउन: साइट रीड-ओनली है</span>
        </div>
      )}
      <Routes>
      {/* Public Pages */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/programs" element={<Programs />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/news" element={<News />} />
        <Route path="/events" element={<Events />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/success-stories" element={<AchievementWall />} />
        <Route path="/achievements" element={<AchievementWall />} />
        <Route path="/parent" element={<ParentPortal />} />
        <Route path="/social" element={<SocialFeed />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/donate" element={<Donate />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />
      </Route>

      {/* Auth Pages */}
      <Route element={<MainLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>

      {/* Student Portal */}
      <Route element={<DashboardLayout />}>
        <Route element={<ProtectedRoute allowedRoles={['student']} />}>
          <Route path="/dashboard/student" element={<StudentDashboard />} />
          <Route path="/student/dashboard" element={<Navigate to="/dashboard/student" replace />} />
          <Route path="/scholarship/apply" element={<ScholarshipApply />} />
          <Route path="/student/applications" element={<StudentApplications />} />
          <Route path="/student/applications/:id" element={<ApplicationDetail />} />
          <Route path="/student/materials" element={<StudentMaterials />} />
          <Route path="/student/profile" element={<StudentProfile />} />
          <Route path="/community/study-buddy" element={<StudyBuddy />} />
          <Route path="/community/live-sessions" element={<LiveSessions />} />
          <Route path="/community/notes" element={<CollaborativeNotes />} />
          <Route path="/community/contests" element={<Contests />} />
        </Route>
      </Route>

      {/* Volunteer Portal */}
      <Route element={<DashboardLayout />}>
        <Route element={<ProtectedRoute allowedRoles={['volunteer']} />}>
          <Route path="/dashboard/volunteer" element={<VolunteerDashboard />} />
          <Route path="/volunteer/dashboard" element={<Navigate to="/dashboard/volunteer" replace />} />
          <Route path="/volunteer/tasks" element={<VolunteerTasks />} />
          <Route path="/volunteer/hours" element={<VolunteerHours />} />
          <Route path="/volunteer/profile" element={<VolunteerProfile />} />
        </Route>
      </Route>

      {/* Donor Portal */}
      <Route element={<DashboardLayout />}>
        <Route element={<ProtectedRoute allowedRoles={['donor']} />}>
          <Route path="/dashboard/donor" element={<DonorDashboard />} />
          <Route path="/donor/dashboard" element={<Navigate to="/dashboard/donor" replace />} />
          <Route path="/donor/donations" element={<DonorDonations />} />
          <Route path="/donor/impact" element={<DonorImpact />} />
          <Route path="/donor/profile" element={<DonorProfile />} />
        </Route>
      </Route>

      {/* Admin Panel */}
      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/dash" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/scholarships" element={<AdminScholarships />} />
        <Route path="/admin/performance" element={<AdminPerformance />} />
        <Route path="/admin/donations" element={<AdminDonations />} />
        <Route path="/admin/events" element={<AdminEvents />} />
        <Route path="/admin/content" element={<AdminContent />} />
        <Route path="/admin/chat" element={<AdminChat />} />
        <Route path="/admin/management" element={<AdminManagement />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
        <Route path="/admin/audit" element={<AdminAuditLogs />} />
        <Route path="/admin/workflows" element={<AdminWorkflows />} />
        <Route path="/admin/communication" element={<AdminCommunication />} />
        <Route path="/admin/reports" element={<AdminReports />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
    <PWAInstallPrompt />
    </div>
  )
}
