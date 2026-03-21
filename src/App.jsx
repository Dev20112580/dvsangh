import { lazy, Suspense } from 'react'
import { Routes, Route, Outlet, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { AdminProvider } from './context/AdminContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/react"
import AdminLayout from './components/admin/AdminLayout'
import './styles/admin.css'

// Public Pages
const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))
const Programs = lazy(() => import('./pages/Programs'))
const Gallery = lazy(() => import('./pages/Gallery'))
const News = lazy(() => import('./pages/News'))
const Events = lazy(() => import('./pages/Events'))
const AchievementWall = lazy(() => import('./pages/Public/AchievementWall'))
const Contact = lazy(() => import('./pages/Contact'))
const Donate = lazy(() => import('./pages/Donate'))
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'))
const Terms = lazy(() => import('./pages/Terms'))
const SearchPage = lazy(() => import('./pages/Search'))
const SocialFeed = lazy(() => import('./pages/Community/SocialFeed'))
const ParentPortal = lazy(() => import('./pages/Community/ParentPortal'))
const Leaderboard = lazy(() => import('./pages/Community/Leaderboard'))

// Auth Pages
const Login = lazy(() => import('./pages/auth/Login'))
const Register = lazy(() => import('./pages/auth/Register'))
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'))

// Dashboards (Lazy Loaded)
const StudentDashboard = lazy(() => import('./pages/student/Dashboard'))
const ScholarshipApply = lazy(() => import('./pages/student/ScholarshipApply'))
const StudentApplications = lazy(() => import('./pages/student/Applications'))
const StudentMaterials = lazy(() => import('./pages/student/Materials'))
const StudentProfile = lazy(() => import('./pages/student/Profile'))
const ApplicationDetail = lazy(() => import('./pages/student/ApplicationDetail'))
const Forum = lazy(() => import('./pages/Community/Forum'))
const Announcements = lazy(() => import('./pages/Community/Announcements'))
const StudyGroups = lazy(() => import('./pages/Community/StudyGroups'))
const Mentorship = lazy(() => import('./pages/Community/Mentorship'))
const StudyBuddy = lazy(() => import('./pages/Community/StudyBuddy'))
const LiveSessions = lazy(() => import('./pages/Community/LiveSessions'))
const CollaborativeNotes = lazy(() => import('./pages/Community/CollaborativeNotes'))
const Contests = lazy(() => import('./pages/Community/Contests'))
const ExamPrep = lazy(() => import('./pages/student/ExamPrep'))

const VolunteerDashboard = lazy(() => import('./pages/volunteer/Dashboard'))
const VolunteerTasks = lazy(() => import('./pages/volunteer/Tasks'))
const VolunteerHours = lazy(() => import('./pages/volunteer/Hours'))
const VolunteerProfile = lazy(() => import('./pages/volunteer/Profile'))
const VolunteerOpportunities = lazy(() => import('./pages/volunteer/Opportunities'))

const DonorDashboard = lazy(() => import('./pages/donor/Dashboard'))
const DonorDonations = lazy(() => import('./pages/donor/Donations'))
const DonorImpact = lazy(() => import('./pages/donor/Impact'))
const DonorProfile = lazy(() => import('./pages/donor/Profile'))

// Admin Pages (Lazy Loaded)
const AdminLogin = lazy(() => import('./pages/admin/Login'))
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'))
const AdminUsers = lazy(() => import('./pages/admin/Users'))
const AdminScholarships = lazy(() => import('./pages/admin/Scholarships'))
const AdminDonations = lazy(() => import('./pages/admin/Donations'))
const AdminEvents = lazy(() => import('./pages/admin/Events'))
const AdminContent = lazy(() => import('./pages/admin/Content'))
const AdminChat = lazy(() => import('./pages/admin/Chat'))
const AdminManagement = lazy(() => import('./pages/admin/AdminManagement'))
const AdminSettings = lazy(() => import('./pages/admin/Settings'))
const AdminAuditLogs = lazy(() => import('./pages/admin/AuditLogs'))
const AdminTasks = lazy(() => import('./pages/admin/Workflows')) // Renamed from AdminWorkflows to AdminTasks
const AdminNotifications = lazy(() => import('./pages/admin/Communication')) // Renamed from AdminCommunication to AdminNotifications
const AdminReports = lazy(() => import('./pages/admin/ReportGenerator'))
const AdminPerformance = lazy(() => import('./pages/admin/Performance'))
const AdminDisbursements = lazy(() => import('./pages/admin/Disbursements'))
const AdminCertificates = lazy(() => import('./pages/admin/Certificates'))
const AdminExpenses = lazy(() => import('./pages/admin/Expenses'))
const AdminBank = lazy(() => import('./pages/admin/BankRecon'))
const AdminGallery = lazy(() => import('./pages/admin/Gallery'))

// AdminProtectedRoute is no longer directly used for individual routes, AdminLayout handles it.

// Other components
import NotFound from './pages/NotFound'
import { useLockdown } from './context/LockdownContext'
import { ShieldAlert } from 'lucide-react'

// Layouts
import GuruBot from './components/GuruBot'
import PWAInstallPrompt from './components/PWAInstallPrompt'
import MobileTabBar from './components/MobileTabBar'

const PageLoader = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '60vh'
  }}>
    <div style={{
      width: '44px',
      height: '44px',
      border: '4px solid #F3F4F6',
      borderTop: '4px solid #FF6B35',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }} />
  </div>
);

function MainLayout() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<PageLoader />}>
        <Outlet />
      </Suspense>
      <Footer />
      <GuruBot />
    </>
  )
}

function DashboardLayout() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<PageLoader />}>
        <Outlet />
      </Suspense>
      <GuruBot />
    </>
  )
}

function ProtectedRoute({ allowedRoles, children }) {
  const { user, profile, loading } = useAuth()
  if (loading) return <PageLoader />
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
      <main>
        <Suspense fallback={<PageLoader />}>
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
                <Route path="/community/forum" element={<Forum />} />
                <Route path="/community/forum/:id" element={<Forum />} />
                <Route path="/community/announcements" element={<Announcements />} />
                <Route path="/community/study-groups" element={<StudyGroups />} />
                <Route path="/community/mentorship" element={<Mentorship />} />
                <Route path="/community/exam-prep" element={<ExamPrep />} />
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
            <Route path="/admin/login" element={<AdminProvider><AdminLogin /></AdminProvider>} />
            
            <Route path="/admin" element={<AdminProvider><AdminLayout /></AdminProvider>}>
               <Route index element={<Navigate to="dashboard" replace />} /> {/* Redirect /admin to /admin/dashboard */}
               <Route path="dashboard" element={<AdminDashboard />} />
               <Route path="users" element={<AdminUsers />} />
               <Route path="scholarships" element={<AdminScholarships />} />
               <Route path="donations" element={<AdminDonations />} />
               <Route path="events" element={<AdminEvents />} />
               <Route path="content" element={<AdminContent />} />
               <Route path="chat" element={<AdminChat />} />
               <Route path="notifications" element={<AdminNotifications />} />
               <Route path="tasks" element={<AdminTasks />} />
               <Route path="audit" element={<AdminAuditLogs />} />
               <Route path="management" element={<AdminManagement />} />
              <Route path="accounts" element={<Navigate to="/admin/management" replace />} />
              <Route path="certificates" element={<AdminCertificates />} />
              <Route path="disbursements" element={<AdminDisbursements />} />
              <Route path="expenses" element={<AdminExpenses />} />
              <Route path="bank" element={<AdminBank />} />
              <Route path="gallery" element={<AdminGallery />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="reports" element={<AdminReports />} />
              <Route path="performance" element={<AdminPerformance />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
          <Analytics />
          <SpeedInsights />
        </Suspense>
      </main>
      <PWAInstallPrompt />
      <MobileTabBar />
    </div>
  )
}
