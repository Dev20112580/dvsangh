import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AdminContext = createContext(null);

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load admin from localStorage
    const stored = localStorage.getItem('dvs_admin');
    if (stored) {
      try {
        setAdmin(JSON.parse(stored));
      } catch(e) {
        localStorage.removeItem('dvs_admin');
      }
    }
    setLoading(false);
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('dvs_admin');
    setAdmin(null);
    window.location.href = '/admin/login';
  };

  // Permission checks
  const can = {
    // Level 1 only
    manageAdmins: admin?.level === 1,
    systemSettings: admin?.level === 1,
    viewAllChats: admin?.level === 1,
    emergencyLockdown: admin?.level === 1,
    overrideDecisions: admin?.level === 1,
    viewAuditLog: admin?.level === 1,
    
    // Level 1-2
    approveScholarships: admin?.level <= 2,
    manageUsers: admin?.level <= 2,
    publishContent: admin?.level <= 2,
    viewFinancialReports: admin?.level <= 2,
    sendNotifications: admin?.level <= 2,
    manageEvents: admin?.level <= 2,
    
    // Level 1-2-3a
    reviewApplications: admin?.level <= 3 && 
      admin?.type !== 'treasurer',
    uploadMaterials: admin?.level <= 3 && 
      admin?.type !== 'treasurer',
    manageGallery: admin?.level <= 3 && 
      admin?.type !== 'treasurer',
    
    // Treasurer only (Level 3b)
    manageDonations: admin?.level === 1 || 
      admin?.type === 'treasurer',
    generate80G: admin?.level === 1 || 
      admin?.type === 'treasurer',
    manageDisbursements: admin?.level === 1 || 
      admin?.type === 'treasurer',
    manageExpenses: admin?.level === 1 || 
      admin?.type === 'treasurer',
    bankReconciliation: admin?.level === 1 || 
      admin?.type === 'treasurer',
  };

  return (
    <AdminContext.Provider value={{ 
      admin, setAdmin, loading, logout, can 
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);
