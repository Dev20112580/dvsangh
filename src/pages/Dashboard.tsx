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
  Users
} from 'lucide-react';
import { useSupabase } from '../SupabaseContext';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { UserRole } from '../types';

export default function Dashboard() {
  const { user, userProfile, loading, isAuthReady } = useSupabase();
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
          // Fetch admin stats using count optimization
          const [
            { count: scholarshipCount },
            { count: messageCount },
            { count: subscriberCount },
            { count: userCount }
          ] = await Promise.all([
            supabase.from('scholarships').select('*', { count: 'exact', head: true }),
            supabase.from('contact_messages').select('*', { count: 'exact', head: true }),
            supabase.from('newsletter_subscriptions').select('*', { count: 'exact', head: true }),
            supabase.from('profiles').select('*', { count: 'exact', head: true })
          ]);

          setStats({
            scholarships: scholarshipCount || 0,
            messages: messageCount || 0,
            subscribers: subscriberCount || 0,
            users: userCount || 0
          });

          // Fetch recent applications
          const { data: appData } = await supabase
            .from('scholarships')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(5);
          setRecentApplications(appData || []);

          // Fetch recent messages
          const { data: msgData } = await supabase
            .from('contact_messages')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(5);
          setRecentMessages(msgData || []);

          // Fetch subscribers
          const { data: subData } = await supabase
            .from('newsletter_subscriptions')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(10);
          setSubscribers(subData || []);

          // Fetch all users
          const { data: userData } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false });
          setAllUsers(userData || []);

        } else if (userProfile.role === UserRole.STUDENT) {
          // Fetch student stats
          const { data: appData } = await supabase
            .from('scholarships')
            .select('*')
            .eq('student_id', user.id);
            
          const apps = appData || [];
          setStats({
            applications: apps.length,
            pending: apps.filter(d => d.status === 'pending').length,
            approved: apps.filter(d => d.status === 'approved').length
          });
          setRecentApplications(apps.slice(0, 5));
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
      await supabase.auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Logout Error:', error);
    }
  };

  const updateApplicationStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('scholarships')
        .update({ status })
        .eq('id', id);
        
      if (error) throw error;
      
      setRecentApplications(prev => prev.map(app => app.id === id ? { ...app, status } : app));
      alert(`Application ${status} successfully!`);
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status.');
    }
  };

  const deleteDocument = async (tableName: string, id: string) => {
    if (!window.confirm('Are you sure you want to delete this?')) return;
    try {
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);
        
      if (error) throw error;

      if (tableName === 'scholarships') {
        setRecentApplications(prev => prev.filter(app => app.id !== id));
      } else if (tableName === 'contact_messages') {
        setRecentMessages(prev => prev.filter(msg => msg.id !== id));
      } else if (tableName === 'newsletter_subscriptions') {
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
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);
        
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

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar */}
          <aside className="lg:w-64 shrink-0">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sticky top-28">
              <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-100">
                <div className="w-12 h-12 bg-dvs-orange/10 text-dvs-orange rounded-2xl flex items-center justify-center font-bold text-xl">
                  {userProfile.full_name?.charAt(0) || 'U'}
                </div>
                <div>
                  <h3 className="font-bold text-dark-text truncate max-w-[120px]">{userProfile.full_name}</h3>
                  <p className="text-xs text-medium-gray capitalize">{userProfile.role}</p>
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
                    <button 
                      onClick={() => setActiveTab('scholarships')}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'scholarships' ? 'bg-dvs-orange text-white shadow-lg shadow-dvs-orange/20' : 'text-medium-gray hover:bg-gray-50'}`}
                    >
                      <FileText size={18} /> Scholarships
                    </button>
                    <button 
                      onClick={() => setActiveTab('users')}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'users' ? 'bg-dvs-orange text-white shadow-lg shadow-dvs-orange/20' : 'text-medium-gray hover:bg-gray-50'}`}
                    >
                      <Users size={18} /> Users
                    </button>
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
              <div className="flex items-center justify-center p-12">
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
                      {isAdmin ? (
                        <>
                          <StatCard icon={FileText} label="Scholarships" value={stats.scholarships || 0} color="orange" />
                          <StatCard icon={MessageSquare} label="Messages" value={stats.messages || 0} color="blue" />
                          <StatCard icon={Mail} label="Subscribers" value={stats.subscribers || 0} color="green" />
                          <StatCard icon={Users} label="Total Users" value={stats.users || 0} color="purple" />
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
                                    <h4 className="font-bold text-dark-text text-sm truncate max-w-[150px]">{app.full_name || app.student_name || 'Scholarship App'}</h4>
                                    <p className="text-xs text-medium-gray">{new Date(app.created_at).toLocaleDateString()}</p>
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
                                    <span className="text-[10px] text-medium-gray">{new Date(msg.created_at).toLocaleDateString()}</span>
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
                            <th className="pb-4 font-bold text-sm text-medium-gray uppercase tracking-wider">Course</th>
                            <th className="pb-4 font-bold text-sm text-medium-gray uppercase tracking-wider">Status</th>
                            <th className="pb-4 font-bold text-sm text-medium-gray uppercase tracking-wider">Date</th>
                            <th className="pb-4 font-bold text-sm text-medium-gray uppercase tracking-wider">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {recentApplications.map((app) => (
                            <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                              <td className="py-4">
                                <div className="font-bold text-dark-text">{app.full_name || app.student_name}</div>
                                <div className="text-xs text-medium-gray">{app.email}</div>
                              </td>
                              <td className="py-4 text-sm text-medium-gray">{app.course || app.class}</td>
                              <td className="py-4">
                                <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                                  app.status === 'approved' ? 'bg-green-100 text-green-600' : 
                                  app.status === 'rejected' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                                }`}>
                                  {app.status}
                                </span>
                              </td>
                              <td className="py-4 text-sm text-medium-gray">{new Date(app.created_at).toLocaleDateString()}</td>
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
                                    onClick={() => deleteDocument('scholarships', app.id)}
                                    className="p-2 bg-gray-50 text-gray-400 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
                                    title="Delete"
                                  >
                                    <XCircle size={16} />
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
                                <div className="font-bold text-dark-text">{u.full_name}</div>
                                <div className="text-xs text-medium-gray">{u.email}</div>
                              </td>
                              <td className="py-4">
                                <select 
                                  value={u.role}
                                  onChange={(e) => updateUserRole(u.id, e.target.value as UserRole)}
                                  // Prevent self-demotion or demotion of primary admin
                                  disabled={u.id === user?.id || u.email === 'pawanjerwa2023@gmail.com'}
                                  className="text-xs font-bold capitalize px-3 py-1 bg-gray-100 rounded-full text-medium-gray border-none focus:ring-2 focus:ring-dvs-orange cursor-pointer disabled:cursor-not-allowed"
                                >
                                  <option value={UserRole.STUDENT}>Student</option>
                                  <option value={UserRole.VOLUNTEER}>Volunteer</option>
                                  <option value={UserRole.DONOR}>Donor</option>
                                  <option value={UserRole.ADMIN}>Admin</option>
                                </select>
                              </td>
                              <td className="py-4 text-sm text-medium-gray">{u.district}</td>
                              <td className="py-4 text-sm text-medium-gray">{new Date(u.created_at).toLocaleDateString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
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
                        <ProfileField label="Full Name" value={userProfile.full_name} />
                        <ProfileField label="Email Address" value={userProfile.email} />
                        <ProfileField label="Phone Number" value={userProfile.phone} />
                        <ProfileField label="District" value={userProfile.district} />
                        <ProfileField label="Role" value={userProfile.role} />
                        <ProfileField label="Joined On" value={new Date(userProfile.created_at).toLocaleDateString()} />
                      </div>
                      <div className="pt-8 border-t border-gray-100 text-xs text-medium-gray">
                        Member since {new Date(userProfile.created_at).getFullYear()}
                      </div>
                    </div>
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
