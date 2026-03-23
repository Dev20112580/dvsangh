import { Navigate, Outlet } from 'react-router-dom'
import { useAdminAuth } from '../../context/AdminAuthProvider'
import AdminLayout from './AdminLayout'

export default function AdminProtectedRoute({ allowedLevels }) {
  const { adminProfile, refinedLevel, loading } = useAdminAuth()

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#f8fafc' }}>
    <div className="hindi" style={{ fontSize: '1rem', color: '#64748b' }}>Authorizing Admin...</div>
  </div>

  if (!adminProfile) {
    return <Navigate to="/admin/login" replace />
  }

  if (allowedLevels && !allowedLevels.includes(refinedLevel)) {
    return <Navigate to="/admin/dashboard" replace />
  }

  return <Outlet />
}
