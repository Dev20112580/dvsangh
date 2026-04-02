import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutDashboard, FileText, User, LogOut, CheckCircle2, Clock, TrendingUp } from 'lucide-react';
import { useSupabase } from '../../SupabaseContext';
import { supabase } from '../../supabase';
import { Link, useNavigate } from 'react-router-dom';

export default function StudentDashboard() {
  const { user, userProfile, signOut } = useSupabase();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({ applications: 0, pending: 0, approved: 0 });
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      const { data } = await supabase.from('scholarship_applications').select('*').eq('user_id', user.id);
      if (data) {
        setStats({
          applications: data.length,
          pending: data.filter(d => d.status === 'pending').length,
          approved: data.filter(d => d.status === 'approved').length
        });
        setApplications(data);
      }
      setLoading(false);
    };
    fetchData();
  }, [user]);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Sidebar */}
      <aside className="lg:w-64 shrink-0">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sticky top-28">
          <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-100">
            <div className="w-12 h-12 bg-dvs-orange/10 text-dvs-orange rounded-2xl flex items-center justify-center font-bold text-xl uppercase">
              {userProfile?.name?.charAt(0) || 'S'}
            </div>
            <div>
              <h3 className="font-bold text-dark-text truncate max-w-[120px]">{userProfile?.name}</h3>
              <p className="text-xs text-medium-gray capitalize">Student</p>
            </div>
          </div>
          <nav className="space-y-2">
            <TabButton icon={LayoutDashboard} label="Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
            <TabButton icon={FileText} label="Applications" active={activeTab === 'applications'} onClick={() => setActiveTab('applications')} />
            <TabButton icon={User} label="Profile" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
            <div className="pt-8 mt-8 border-t border-gray-100">
              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all">
                <LogOut size={18} /> Logout
              </button>
            </div>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow">
        {loading ? (
          <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-dvs-orange"></div></div>
        ) : (
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <StatCard icon={FileText} label="Total Applied" value={stats.applications} color="orange" />
                  <StatCard icon={Clock} label="Pending" value={stats.pending} color="blue" />
                  <StatCard icon={CheckCircle2} label="Approved" value={stats.approved} color="green" />
                </div>
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-dark-text">Recent Applications</h3>
                    <Link to="/scholarship" className="text-sm font-bold text-dvs-orange hover:underline">Apply New</Link>
                  </div>
                  {applications.length > 0 ? (
                    <div className="space-y-4">
                      {applications.slice(0,3).map(app => (
                        <div key={app.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                          <div>
                            <p className="font-bold text-sm text-dark-text">{app.school_name || 'Scholarship'}</p>
                            <p className="text-xs text-medium-gray">{new Date(app.created_at).toLocaleDateString()}</p>
                          </div>
                          <span className={`text-xs font-bold uppercase px-3 py-1 rounded-full ${app.status === 'approved' ? 'bg-green-100 text-green-600' : app.status === 'rejected' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>{app.status}</span>
                        </div>
                      ))}
                    </div>
                  ) : <p className="text-sm text-medium-gray text-center py-4">No applications yet.</p>}
                </div>
              </motion.div>
            )}

            {activeTab === 'applications' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                <h3 className="text-2xl font-bold text-dark-text mb-6">All Applications</h3>
                {applications.length > 0 ? (
                  <div className="space-y-4">
                    {applications.map(app => (
                      <div key={app.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <div>
                          <p className="font-bold text-dark-text">{app.school_name || 'Scholarship'}</p>
                          <p className="text-sm text-medium-gray">Class: {app.current_class} • Date: {new Date(app.created_at).toLocaleDateString()}</p>
                        </div>
                        <span className={`text-xs font-bold uppercase px-4 py-2 rounded-full ${app.status === 'approved' ? 'bg-green-100 text-green-600' : app.status === 'rejected' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>{app.status}</span>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-sm text-medium-gray py-4">No applications yet.</p>}
              </motion.div>
            )}

            {activeTab === 'profile' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 max-w-2xl">
                <h3 className="text-2xl font-bold text-dark-text mb-6">My Profile</h3>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <ProfileField label="Full Name" value={userProfile?.name} />
                    <ProfileField label="Email Address" value={userProfile?.email} />
                    <ProfileField label="Phone" value={userProfile?.phone} />
                    <ProfileField label="District" value={userProfile?.district} />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </main>
    </div>
  );
}

function TabButton({ icon: Icon, label, active, onClick }: any) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${active ? 'bg-dvs-orange text-white shadow-lg' : 'text-medium-gray hover:bg-gray-50'}`}>
      <Icon size={18} /> {label}
    </button>
  );
}

function StatCard({ icon: Icon, label, value, color }: any) {
  const colors: any = { orange: 'bg-orange-50 text-orange-600', blue: 'bg-blue-50 text-blue-600', green: 'bg-green-50 text-green-600' };
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${colors[color]}`}><Icon size={24} /></div>
      <p className="text-sm text-medium-gray font-medium mb-1">{label}</p>
      <h4 className="text-2xl font-bold text-dark-text">{value}</h4>
    </div>
  );
}

function ProfileField({ label, value }: { label: string, value: string }) {
  return (
    <div>
      <label className="block text-xs font-bold text-medium-gray uppercase mb-1">{label}</label>
      <p className="text-dark-text font-medium">{value || 'N/A'}</p>
    </div>
  );
}
