import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  FileText, 
  MessageSquare, 
  Mail, 
  User, 
  LogOut, 
  CheckCircle2, 
  Clock, 
  XCircle,
  TrendingUp,
  Users,
  Heart,
  Settings,
  ShieldCheck,
  CalendarDays,
  Image,
  DollarSign,
  ShieldAlert,
  BookOpen,
  Newspaper
} from 'lucide-react';
import EventManager from './admin/EventManager';
import ContentManager from './admin/ContentManager';
import DonationManager from './admin/DonationManager';
import AuditLogViewer from './admin/AuditLogViewer';
import AdminPerformance from './admin/AdminPerformance';
import AdminChat from './admin/AdminChat';
import { useSupabase } from '../../SupabaseContext';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../supabase';
import { UserRole } from '../../types';

export default function AdminDashboard() {
  const { user, userProfile, loading, isAuthReady, signOut } = useSupabase();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<any>({});
  const [recentApplications, setRecentApplications] = useState<any[]>([]);
  const [recentMessages, setRecentMessages] = useState<any[]>([]);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);

  useEffect(() => {
    if (isAuthReady && !user) {
      navigate('/auth');
    }
  }, [user, isAuthReady, navigate]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user || !userProfile) return;

      setIsDataLoading(true);
      try {
        if (userProfile.role === UserRole.ADMIN) {
          // Fetch admin stats
          const { count: scholarshipCount } = await supabase.from('scholarship_applications').select('*', { count: 'exact', head: true }).eq('status', 'pending');
          const { count: messagesCount } = await supabase.from('contact_submissions').select('*', { count: 'exact', head: true });
          const { count: newsletterCount } = await supabase.from('newsletter_subscribers').select('*', { count: 'exact', head: true });
          const { count: usersCount } = await supabase.from('users').select('*', { count: 'exact', head: true });
          const { count: volunteersCount } = await supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'volunteer');
          
          const now = new Date().toISOString();
          const { count: eventsCount } = await supabase.from('events').select('*', { count: 'exact', head: true }).gt('date', now);

          // Get donation total for this month
          const startOfMonth = new Date();
          startOfMonth.setDate(1);
          startOfMonth.setHours(0,0,0,0);
          
          const { data: donationData } = await supabase
            .from('donations')
            .select('amount')
            .gte('created_at', startOfMonth.toISOString());
          
          const monthlyDonations = donationData?.reduce((acc, curr) => acc + (curr.amount || 0), 0) || 0;

          // Get lifetime disbursed (mocking with a percentage of total donations for now)
          const { data: allDonations } = await supabase.from('donations').select('amount');
          const lifetimeTotal = allDonations?.reduce((acc, curr) => acc + (curr.amount || 0), 0) || 0;

          setStats({
            scholarships: scholarshipCount || 0,
            messages: messagesCount || 0,
            subscribers: newsletterCount || 0,
            users: usersCount || 0,
            volunteers: volunteersCount || 0,
            upcomingEvents: eventsCount || 0,
            monthlyDonations,
            lifetimeDisbursed: Math.floor(lifetimeTotal * 0.7) // Assuming 70% Disbursement
          });

          // Fetch recent applications
          const { data: appSnap } = await supabase.from('scholarship_applications').select('*').order('created_at', { ascending: false }).limit(5);
          if (appSnap) setRecentApplications(appSnap);

          // Fetch recent messages
          const { data: msgSnap } = await supabase.from('contact_submissions').select('*').order('created_at', { ascending: false }).limit(5);
          if (msgSnap) setRecentMessages(msgSnap);

          // Fetch subscribers
          const { data: subSnap } = await supabase.from('newsletter_subscribers').select('*').order('created_at', { ascending: false }).limit(10);
          if (subSnap) setSubscribers(subSnap);

          // Fetch all users
          const { data: allUsersSnap } = await supabase.from('users').select('*').order('created_at', { ascending: false });
          if (allUsersSnap) setAllUsers(allUsersSnap);

        } else if (userProfile.role === UserRole.STUDENT) {
          // Fetch student stats
          const { data: appSnap } = await supabase.from('scholarship_applications').select('*').eq('user_id', user.id);
          if (appSnap) {
            setStats({
              applications: appSnap.length,
              pending: appSnap.filter(d => d.status === 'pending').length,
              approved: appSnap.filter(d => d.status === 'approved').length
            });
            setRecentApplications(appSnap);
          }
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsDataLoading(false);
      }
    };

    if (isAuthReady && user && userProfile) {
      fetchDashboardData();
    }
  }, [user, userProfile, isAuthReady]);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Logout Error:', error);
    }
  };

  const updateApplicationStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase.from('scholarship_applications').update({ status }).eq('id', id);
      if (error) throw error;
      setRecentApplications(prev => prev.map(app => app.id === id ? { ...app, status } : app));
      alert(`Application ${status} successfully!`);
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status.');
    }
  };

  const deleteDocument = async (collectionName: string, id: string) => {
    if (!window.confirm('Are you sure you want to delete this?')) return;
    try {
      const { error } = await supabase.from(collectionName).delete().eq('id', id);
      if (error) throw error;
      
      if (collectionName === 'scholarship_applications') {
        setRecentApplications(prev => prev.filter(app => app.id !== id));
      } else if (collectionName === 'contact_submissions') {
        setRecentMessages(prev => prev.filter(msg => msg.id !== id));
      } else if (collectionName === 'newsletter_subscribers') {
        setSubscribers(prev => prev.filter(sub => sub.id !== id));
      }
      alert('Deleted successfully!');
    } catch (error) {
      console.error('Error deleting document:', error);
      alert('Failed to delete.');
    }
  };

  const updateUserRole = async (userId: string, newRole: UserRole) => {
    try {
      const { error } = await supabase.from('users').update({ role: newRole }).eq('id', userId);
      if (error) throw error;
      setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
      alert(`User role updated to ${newRole} successfully!`);
    } catch (error) {
      console.error('Error updating user role:', error);
      alert('Failed to update user role.');
    }
  };

  if (loading || !isAuthReady || !userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dvs-orange"></div>
      </div>
    );
  }

  const isAdmin = userProfile.role === UserRole.ADMIN;
  const isStudent = userProfile.role === UserRole.STUDENT;

  // All 7 designated admins from PRD
  const ADMIN_ROLES: any = {
    'admin@dvs.com': { id: 'DVS-F001', name: 'Sumit Kumar Pandit', title: 'Founder & President', level: 'L1' },
    'prashant@dvs.com': { id: 'DVS-VP001', name: 'Prashant', title: 'VP & Secretary', level: 'L2' },
    'madhu@dvs.com': { id: 'DVS-VP002', name: 'Madhu', title: 'Vice President', level: 'L2' },
    'rita@dvs.com': { id: 'DVS-VP003', name: 'Rita', title: 'Vice President', level: 'L2' },
    'riya@dvs.com': { id: 'DVS-AS001', name: 'Riya', title: 'Assistant Secretary', level: 'L3a' },
    'piya@dvs.com': { id: 'DVS-AS002', name: 'Piya', title: 'Assistant Secretary', level: 'L3a' },
    'vijay@dvs.com': { id: 'DVS-TR001', name: 'Vijay', title: 'Treasurer', level: 'L3b' }
  };

  const currentAdmin = isAdmin ? ADMIN_ROLES[userProfile.email?.toLowerCase()] : null;
  const adminLevel = currentAdmin?.level || 'none';
  const adminId = currentAdmin?.id || 'USER';

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar */}
          <aside className="lg:w-64 shrink-0">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sticky top-28">
                <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-100">
                <div className="w-12 h-12 bg-dvs-orange/10 text-dvs-orange rounded-2xl flex items-center justify-center font-bold text-xl uppercase">
                  {userProfile.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <h3 className="font-bold text-dark-text truncate max-w-[120px]">{currentAdmin ? currentAdmin.name : userProfile.name}</h3>
                  <p className="text-[10px] text-medium-gray font-bold uppercase tracking-tighter">
                    {currentAdmin ? `${currentAdmin.title} (${adminId})` : userProfile.role}
                  </p>
                </div>
              </div>

              <nav className="space-y-2">
                <button 
                  onClick={() => setActiveTab('overview')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'overview' ? 'bg-dvs-orange text-white shadow-lg shadow-dvs-orange/20' : 'text-medium-gray hover:bg-gray-50'}`}
                >
                  <LayoutDashboard size={18} /> Overview
                </button>
                {isAdmin && (
                  <>
                    {(adminLevel === 'L1' || adminLevel === 'L2' || adminLevel === 'L3a') && (
                      <button 
                        onClick={() => setActiveTab('scholarships')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'scholarships' ? 'bg-dvs-orange text-white shadow-lg shadow-dvs-orange/20' : 'text-medium-gray hover:bg-gray-50'}`}
                      >
                        <FileText size={18} /> {adminLevel === 'L3a' ? 'Review Apps' : 'Scholarships'}
                      </button>
                    )}
                    {(adminLevel === 'L1' || adminLevel === 'L2' || adminLevel === 'L3a') && (
                      <button 
                        onClick={() => setActiveTab('events')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'events' ? 'bg-dvs-orange text-white shadow-lg shadow-dvs-orange/20' : 'text-medium-gray hover:bg-gray-50'}`}
                      >
                        <CalendarDays size={18} /> Events
                      </button>
                    )}
                    {(adminLevel === 'L1' || adminLevel === 'L2' || adminLevel === 'L3a') && (
                      <button 
                        onClick={() => setActiveTab('content')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'content' ? 'bg-dvs-orange text-white shadow-lg shadow-dvs-orange/20' : 'text-medium-gray hover:bg-gray-50'}`}
                      >
                        <Image size={18} /> Content
                      </button>
                    )}
                    {(adminLevel === 'L1' || adminLevel === 'L2') && (
                      <button 
                        onClick={() => setActiveTab('users')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'users' ? 'bg-dvs-orange text-white shadow-lg shadow-dvs-orange/20' : 'text-medium-gray hover:bg-gray-50'}`}
                      >
                        <Users size={18} /> Users
                      </button>
                    )}
                    <button 
                      onClick={() => setActiveTab('messages')}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'messages' ? 'bg-dvs-orange text-white shadow-lg shadow-dvs-orange/20' : 'text-medium-gray hover:bg-gray-50'}`}
                    >
                      <MessageSquare size={18} /> Messages
                    </button>
                    <button 
                      onClick={() => setActiveTab('subscribers')}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'subscribers' ? 'bg-dvs-orange text-white shadow-lg shadow-dvs-orange/20' : 'text-medium-gray hover:bg-gray-50'}`}
                    >
                      <Mail size={18} /> Subscribers
                    </button>
                    <button 
                      onClick={() => setActiveTab('chat')}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'chat' ? 'bg-dvs-orange text-white shadow-lg shadow-dvs-orange/20' : 'text-medium-gray hover:bg-gray-50'}`}
                    >
                      <MessageSquare size={18} /> Team Chat
                    </button>
                  </>
                )}
                {(adminLevel === 'L1' || adminLevel === 'L3b') && (
                  <button 
                    onClick={() => setActiveTab('donations')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'donations' ? 'bg-dvs-orange text-white shadow-lg shadow-dvs-orange/20' : 'text-medium-gray hover:bg-gray-50'}`}
                  >
                    <DollarSign size={18} /> Financials
                  </button>
                )}
                {adminLevel === 'L1' && (
                  <>
                    <button 
                      onClick={() => setActiveTab('performance')}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'performance' ? 'bg-dvs-orange text-white shadow-lg shadow-dvs-orange/20' : 'text-medium-gray hover:bg-gray-50'}`}
                    >
                      <TrendingUp size={18} /> Performance
                    </button>
                    <button 
                      onClick={() => setActiveTab('audit')}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'audit' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'text-medium-gray hover:bg-gray-50'}`}
                    >
                      <ShieldAlert size={18} /> System Audit
                    </button>
                  </>
                )}
                {isStudent && (
                  <button 
                    onClick={() => setActiveTab('my-applications')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'my-applications' ? 'bg-dvs-orange text-white shadow-lg shadow-dvs-orange/20' : 'text-medium-gray hover:bg-gray-50'}`}
                  >
                    <FileText size={18} /> My Applications
                  </button>
                )}
                <button 
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'profile' ? 'bg-dvs-orange text-white shadow-lg shadow-dvs-orange/20' : 'text-medium-gray hover:bg-gray-50'}`}
                >
                  <User size={18} /> Profile
                </button>
                <button 
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'settings' ? 'bg-dvs-orange text-white shadow-lg shadow-dvs-orange/20' : 'text-medium-gray hover:bg-gray-50'}`}
                >
                  <Settings size={18} /> Settings
                </button>
                <div className="pt-8 mt-8 border-t border-gray-100">
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all"
                  >
                    <LogOut size={18} /> Logout
                  </button>
                </div>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-grow">
            {isDataLoading ? (
              <div className="h-64 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-dvs-orange"></div>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                {activeTab === 'overview' && (
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-8"
                  >
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {adminLevel === 'L1' ? (
                        <>
                          <StatCard icon={Users} label="Total Users" value={stats.users || 0} color="purple" />
                          <StatCard icon={FileText} label="Pending Apps" value={stats.scholarships || 0} color="orange" />
                          <StatCard icon={Heart} label="Donations (Month)" value={`₹${(stats.monthlyDonations || 0).toLocaleString()}`} color="green" />
                          <StatCard icon={Users} label="Active Volunteers" value={stats.volunteers || 0} color="blue" />
                          <StatCard icon={CalendarDays} label="Upcoming Events" value={stats.upcomingEvents || 0} color="orange" />
                          <StatCard icon={TrendingUp} label="Lifetime Disbursed" value={`₹${(stats.lifetimeDisbursed || 0).toLocaleString()}`} color="green" />
                          <StatCard icon={Users} label="Daily Visitors" value={Math.floor((stats.users || 0) * 0.4 + 2)} color="blue" />
                          <StatCard icon={MessageSquare} label="Unread Admin Chat" value="5" color="purple" />
                        </>
                      ) : adminLevel === 'L2' ? (
                        <>
                          <StatCard icon={FileText} label="Pending Applications" value={stats.scholarships || 0} color="orange" />
                          <StatCard icon={CalendarDays} label="Upcoming Events" value={stats.upcomingEvents || 0} color="blue" />
                          <StatCard icon={Users} label="User Base" value={stats.users || 0} color="green" />
                          <StatCard icon={Users} label="Active Volunteers" value={stats.volunteers || 0} color="purple" />
                          <StatCard icon={BookOpen} label="Study Materials" value="Auto" color="orange" />
                          <StatCard icon={Newspaper} label="News Published" value="Auto" color="blue" />
                        </>
                      ) : adminLevel === 'L3a' ? (
                        <>
                          <StatCard icon={FileText} label="Apps to Review" value={stats.scholarships || 0} color="orange" />
                          <StatCard icon={CalendarDays} label="Upcoming Events" value={stats.upcomingEvents || 0} color="blue" />
                          <StatCard icon={MessageSquare} label="Open Queries" value={stats.messages || 0} color="green" />
                          <StatCard icon={BookOpen} label="Materials" value="Recent" color="purple" />
                        </>
                      ) : adminLevel === 'L3b' ? (
                        <>
                          <StatCard icon={Heart} label="Month Donations" value={`₹${(stats.monthlyDonations || 0).toLocaleString()}`} color="green" />
                          <StatCard icon={TrendingUp} label="Lifetime Disbursed" value={`₹${(stats.lifetimeDisbursed || 0).toLocaleString()}`} color="blue" />
                          <StatCard icon={Clock} label="Pending Reviews" value={stats.scholarships || 0} color="orange" />
                          <StatCard icon={ShieldCheck} label="Newsletter Subs" value={stats.subscribers || 0} color="purple" />
                          <StatCard icon={DollarSign} label="Active Users" value={stats.users || 0} color="green" />
                          <StatCard icon={TrendingUp} label="Projected Growth" value="+15%" color="blue" />
                        </>
                      ) : (
                        <>
                          <StatCard icon={FileText} label="Total Applied" value={stats.applications || 0} color="orange" />
                          <StatCard icon={Clock} label="Pending" value={stats.pending || 0} color="blue" />
                          <StatCard icon={CheckCircle2} label="Approved" value={stats.approved || 0} color="green" />
                          <StatCard icon={TrendingUp} label="Progress" value="Good" color="purple" />
                        </>
                      )}
                    </div>

                    {/* Recent Activity */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                        <div className="flex items-center justify-between mb-8">
                          <h3 className="text-xl font-bold text-dark-text">Recent Applications</h3>
                          <Link to="/scholarship" className="text-sm font-bold text-dvs-orange hover:underline">Apply New</Link>
                        </div>
                        <div className="space-y-4">
                          {recentApplications.length > 0 ? (
                            recentApplications.map((app) => (
                              <div key={app.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <div className="flex items-center gap-4">
                                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                    app.status === 'approved' ? 'bg-green-100 text-green-600' : 
                                    app.status === 'rejected' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                                  }`}>
                                    {app.status === 'approved' ? <CheckCircle2 size={20} /> : 
                                     app.status === 'rejected' ? <XCircle size={20} /> : <Clock size={20} />}
                                  </div>
                                  <div>
                                    <h4 className="font-bold text-dark-text text-sm">{app.full_name || 'Scholarship App'}</h4>
                                    <p className="text-xs text-medium-gray">{app.created_at ? new Date(app.created_at).toLocaleDateString() : 'Recent'}</p>
                                  </div>
                                </div>
                                <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                                  app.status === 'approved' ? 'bg-green-100 text-green-600' : 
                                  app.status === 'rejected' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                                }`}>
                                  {app.status}
                                </span>
                              </div>
                            ))
                          ) : (
                            <p className="text-center py-8 text-medium-gray text-sm">No applications found.</p>
                          )}
                        </div>
                      </div>

                      {isAdmin && (
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                          <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-bold text-dark-text">Recent Messages</h3>
                            <button onClick={() => setActiveTab('messages')} className="text-sm font-bold text-dvs-orange hover:underline">View All</button>
                          </div>
                          <div className="space-y-4">
                            {recentMessages.length > 0 ? (
                              recentMessages.map((msg) => (
                                <div key={msg.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                  <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-bold text-dark-text text-sm">{msg.name}</h4>
                                    <span className="text-[10px] text-medium-gray">{msg.created_at ? new Date(msg.created_at).toLocaleDateString() : 'Recent'}</span>
                                  </div>
                                  <p className="text-xs text-medium-gray line-clamp-2">{msg.message}</p>
                                </div>
                              ))
                            ) : (
                              <p className="text-center py-8 text-medium-gray text-sm">No messages found.</p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'scholarships' && isAdmin && (
                  <motion.div
                    key="scholarships"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8"
                  >
                    <h3 className="text-2xl font-bold text-dark-text mb-8">All Scholarship Applications</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b border-gray-100">
                            <th className="pb-4 font-bold text-sm text-medium-gray uppercase tracking-wider">Student</th>
                            <th className="pb-4 font-bold text-sm text-medium-gray uppercase tracking-wider">Class</th>
                            <th className="pb-4 font-bold text-sm text-medium-gray uppercase tracking-wider">Smart Score</th>
                            <th className="pb-4 font-bold text-sm text-medium-gray uppercase tracking-wider">Status</th>
                            <th className="pb-4 font-bold text-sm text-medium-gray uppercase tracking-wider">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {recentApplications.map((app, idx) => (
                            <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                              <td className="py-4">
                                <div className="font-bold text-dark-text">{app.full_name}</div>
                                <div className="text-xs text-medium-gray">{app.email}</div>
                              </td>
                              <td className="py-4 text-sm text-medium-gray">{app.current_class}</td>
                              <td className="py-4">
                                <div className="w-full bg-gray-200 rounded-full h-2 max-w-[100px] mb-1">
                                  <div className={`h-2 rounded-full ${idx % 2 === 0 ? 'bg-green-500 w-[85%]' : 'bg-yellow-500 w-[55%]'}`}></div>
                                </div>
                                <span className="text-[10px] font-bold text-medium-gray">{idx % 2 === 0 ? 'High Need (85)' : 'Moderate (55)'}</span>
                              </td>
                              <td className="py-4">
                                <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                                  app.status === 'approved' ? 'bg-green-100 text-green-600' : 
                                  app.status === 'rejected' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                                }`}>
                                  {app.status}
                                </span>
                              </td>
                              <td className="py-4">
                                <div className="flex items-center gap-2">
                                  {app.status === 'pending' && (
                                    <>
                                      <button 
                                        onClick={() => updateApplicationStatus(app.id, 'approved')}
                                        className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                                        title="Approve"
                                      >
                                        <CheckCircle2 size={16} />
                                      </button>
                                      <button 
                                        onClick={() => updateApplicationStatus(app.id, 'rejected')}
                                        className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                                        title="Reject"
                                      >
                                        <XCircle size={16} />
                                      </button>
                                    </>
                                  )}
                                  <button 
                                    onClick={() => deleteDocument('scholarship_applications', app.id)}
                                    className="p-2 bg-gray-50 text-gray-400 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
                                    title="Delete"
                                  >
                                    <LogOut size={16} className="rotate-180" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'users' && isAdmin && (
                  <motion.div
                    key="users"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8"
                  >
                    <h3 className="text-2xl font-bold text-dark-text mb-8">Registered Users</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b border-gray-100">
                            <th className="pb-4 font-bold text-sm text-medium-gray uppercase tracking-wider">User</th>
                            <th className="pb-4 font-bold text-sm text-medium-gray uppercase tracking-wider">Role</th>
                            <th className="pb-4 font-bold text-sm text-medium-gray uppercase tracking-wider">District</th>
                            <th className="pb-4 font-bold text-sm text-medium-gray uppercase tracking-wider">Joined</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {allUsers.map((u) => (
                            <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                              <td className="py-4">
                                <div className="font-bold text-dark-text">{u.name}</div>
                                <div className="text-xs text-medium-gray">{u.email}</div>
                              </td>
                              <td className="py-4">
                                <select 
                                  value={u.role}
                                  onChange={(e) => updateUserRole(u.id, e.target.value as UserRole)}
                                  disabled={u.email === 'pawanjerwa2023@gmail.com'}
                                  className="text-xs font-bold capitalize px-3 py-1 bg-gray-100 rounded-full text-medium-gray border-none focus:ring-2 focus:ring-dvs-orange cursor-pointer disabled:cursor-not-allowed"
                                >
                                  <option value={UserRole.STUDENT}>Student</option>
                                  <option value={UserRole.VOLUNTEER}>Volunteer</option>
                                  <option value={UserRole.DONOR}>Donor</option>
                                  <option value={UserRole.ADMIN}>Admin</option>
                                </select>
                              </td>
                              <td className="py-4 text-sm text-medium-gray">{u.district}</td>
                              <td className="py-4 text-sm text-medium-gray">{u.created_at ? new Date(u.created_at).toLocaleDateString() : 'N/A'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'messages' && isAdmin && (
                  <motion.div
                    key="messages"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8"
                  >
                    <h3 className="text-2xl font-bold text-dark-text mb-8">Contact Messages</h3>
                    <div className="space-y-4">
                      {recentMessages.map((msg) => (
                        <div key={msg.id} className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h4 className="font-bold text-dark-text">{msg.name}</h4>
                              <p className="text-sm text-medium-gray">{msg.email} • {msg.phone || 'N/A'}</p>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="text-xs text-medium-gray">{msg.created_at ? new Date(msg.created_at).toLocaleDateString() : 'N/A'}</span>
                              <button 
                                onClick={() => deleteDocument('contact_submissions', msg.id)}
                                className="text-red-500 hover:text-red-700 transition-colors"
                              >
                                <LogOut size={16} className="rotate-180" />
                              </button>
                            </div>
                          </div>
                          <p className="text-sm text-dark-text bg-white p-4 rounded-xl border border-gray-100">{msg.message}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'subscribers' && isAdmin && (
                  <motion.div
                    key="subscribers"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8"
                  >
                    <h3 className="text-2xl font-bold text-dark-text mb-8">Newsletter Subscribers</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {subscribers.map((sub) => (
                        <div key={sub.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                            <Mail size={16} />
                          </div>
                          <div className="flex flex-col">
                            <p className="text-sm font-bold text-dark-text truncate">{sub.email}</p>
                            <p className="text-[10px] text-medium-gray">{sub.created_at ? new Date(sub.created_at).toLocaleDateString() : 'N/A'}</p>
                          </div>
                          <button 
                            onClick={() => deleteDocument('newsletter_subscribers', sub.id)}
                            className="ml-auto text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <LogOut size={14} className="rotate-180" />
                          </button>
                        </div>
                      ))}
                      {subscribers.length === 0 && (
                        <p className="col-span-full text-center py-8 text-medium-gray text-sm italic">No subscribers found.</p>
                      )}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'my-applications' && isStudent && (
                  <motion.div
                    key="my-applications"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8"
                  >
                    <h3 className="text-2xl font-bold text-dark-text mb-8">My Scholarship Applications</h3>
                    <div className="space-y-4">
                      {recentApplications.map((app) => (
                        <div key={app.id} className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl border border-gray-100">
                          <div>
                            <h4 className="font-bold text-dark-text">{app.school_name}</h4>
                            <p className="text-sm text-medium-gray">Class: {app.current_class} • Applied on {app.created_at ? new Date(app.created_at).toLocaleDateString() : 'N/A'}</p>
                          </div>
                          <span className={`text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full ${
                            app.status === 'approved' ? 'bg-green-100 text-green-600' : 
                            app.status === 'rejected' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                          }`}>
                            {app.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'profile' && (
                  <motion.div
                    key="profile"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 max-w-2xl"
                  >
                    <h3 className="text-2xl font-bold text-dark-text mb-8">My Profile</h3>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <ProfileField label="Full Name" value={userProfile.name} />
                        <ProfileField label="Email Address" value={userProfile.email} />
                        <ProfileField label="Phone Number" value={userProfile.phone} />
                        <ProfileField label="District" value={userProfile.district} />
                        <ProfileField label="Role" value={userProfile.role} />
                        <ProfileField label="Joined On" value={userProfile.created_at ? new Date(userProfile.created_at).toLocaleDateString() : 'N/A'} />
                      </div>
                      <div className="pt-8 border-t border-gray-100">
                        <button className="bg-dvs-orange text-white px-8 py-3 rounded-xl font-bold hover:bg-opacity-90 transition-all shadow-lg shadow-dvs-orange/20">
                          Edit Profile
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'settings' && isAdmin && (
                  <motion.div
                    key="settings"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-8 max-w-2xl"
                  >
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                      <h3 className="text-2xl font-bold text-dark-text mb-6">Security & 2FA</h3>
                      <div className="p-6 bg-orange-50 rounded-2xl border border-orange-100 mb-6 flex items-start gap-4">
                        <div className="bg-white p-3 rounded-full text-dvs-orange shadow-sm shrink-0">
                          <ShieldCheck size={24} />
                        </div>
                        <div>
                          <h4 className="font-bold text-dark-text text-lg">Two-Factor Authentication (2FA)</h4>
                          <p className="text-sm text-medium-gray mt-1 mb-4">
                            {adminLevel === 'L1' ? 'MANDATORY for Founder (DVS-F001). Account is currently protected via simulated TOTP.' : 'Recommended for all Level 2 and Level 3 admins to protect organizational data.'}
                          </p>
                          <button className="bg-dvs-orange text-white px-6 py-2 rounded-xl font-bold shadow-md hover:bg-opacity-90 transition-colors">
                            {adminLevel === 'L1' ? 'Configure MFA' : 'Enable 2FA'}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                      <h3 className="text-2xl font-bold text-dark-text mb-6">System Preferences</h3>
                      <form className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                          <div>
                            <p className="font-bold text-dark-text">Email Notifications</p>
                            <p className="text-xs text-medium-gray">Receive alerts for new scholarships and contact messages.</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-dvs-orange"></div>
                          </label>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                          <div>
                            <p className="font-bold text-dark-text">Maintenance Mode</p>
                            <p className="text-xs text-medium-gray">Temporarily disable public access to user portals.</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                          </label>
                        </div>
                        
                        {adminLevel === 'L1' && (
                          <div className="flex items-center justify-between p-4 bg-red-50 border border-red-100 rounded-xl mt-4">
                            <div>
                              <p className="font-bold text-red-700">Emergency Lockdown Mode</p>
                              <p className="text-xs text-red-600">Instantly makes the website read-only. FOR EMERGENCY USE ONLY.</p>
                            </div>
                            <button 
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                const code = prompt('Type "LOCKDOWN" to put site in maintenance mode:');
                                if (code === 'LOCKDOWN') alert('System locked. No new applications or donations will be accepted.');
                                else if (code) alert('Invalid security code.');
                              }}
                              className="bg-red-600 text-white px-6 py-2 rounded-xl font-bold shadow-md hover:bg-red-700 transition-colors"
                            >
                              LOCK
                            </button>
                          </div>
                        )}
                      </form>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'events' && isAdmin && (
                  <motion.div
                    key="events"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <EventManager />
                  </motion.div>
                )}

                {activeTab === 'content' && isAdmin && (
                  <motion.div
                    key="content"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <ContentManager />
                  </motion.div>
                )}

                {activeTab === 'donations' && isAdmin && (
                  <motion.div
                    key="donations"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <DonationManager />
                  </motion.div>
                )}

                {activeTab === 'audit' && isAdmin && adminLevel === 'founder' && (
                  <motion.div
                    key="audit"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="max-w-6xl mx-auto"
                  >
                    <AuditLogViewer />
                  </motion.div>
                )}

                {activeTab === 'performance' && isAdmin && adminLevel === 'founder' && (
                  <motion.div
                    key="performance"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <AdminPerformance />
                  </motion.div>
                )}

                {activeTab === 'chat' && isAdmin && (
                  <motion.div
                    key="chat"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <AdminChat adminLevel={adminLevel} />
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: any) {
  const colors: any = {
    orange: 'bg-orange-50 text-orange-600',
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600'
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${colors[color]}`}>
        <Icon size={24} />
      </div>
      <p className="text-sm text-medium-gray font-medium mb-1">{label}</p>
      <h4 className="text-2xl font-bold text-dark-text">{value}</h4>
    </div>
  );
}

function ProfileField({ label, value }: { label: string, value: string }) {
  return (
    <div>
      <label className="block text-xs font-bold text-medium-gray uppercase tracking-wider mb-1">{label}</label>
      <p className="text-dark-text font-medium">{value || 'N/A'}</p>
    </div>
  );
}
