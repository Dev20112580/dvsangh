import React, { useEffect } from 'react';
import { useSupabase } from '../SupabaseContext';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '../types';

import AdminDashboard from './dashboard/AdminDashboard';
import StudentDashboard from './dashboard/StudentDashboard';
import VolunteerDashboard from './dashboard/VolunteerDashboard';
import DonorDashboard from './dashboard/DonorDashboard';

export default function Dashboard() {
  const { user, userProfile, loading, isAuthReady } = useSupabase();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthReady && !user) {
      navigate('/auth');
    }
  }, [user, isAuthReady, navigate]);

  if (loading || !isAuthReady || !userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dvs-orange"></div>
      </div>
    );
  }

  // Route to the appropriate dashboard based on user role
  switch (userProfile.role) {
    case UserRole.ADMIN:
      return <AdminDashboard />;
    case UserRole.STUDENT:
      return <StudentDashboard />;
    case UserRole.VOLUNTEER:
      return <VolunteerDashboard />;
    case UserRole.DONOR:
      return <DonorDashboard />;
    default:
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-20">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-dark-text mb-2">Role Not Assigned</h2>
            <p className="text-medium-gray">Please contact support to assign a role to your account.</p>
          </div>
        </div>
      );
  }
}
