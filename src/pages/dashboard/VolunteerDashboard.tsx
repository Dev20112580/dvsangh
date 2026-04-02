import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutDashboard, Users, User, LogOut, CheckCircle2, Clock, MapPin, Loader2, AlertCircle } from 'lucide-react';
import { useSupabase } from '../../SupabaseContext';
import { supabase } from '../../supabase';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

export default function VolunteerDashboard() {
  const { user, userProfile, signOut } = useSupabase();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({ hours: 0, tasksCount: 0 });
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchVolunteerData();
    }
  }, [user]);

  const fetchVolunteerData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Assigned Tasks
      const { data: taskData, error: taskError } = await supabase
        .from('volunteer_tasks')
        .select('*')
        .eq('assigned_to', user?.id)
        .order('task_date', { ascending: false });

      if (taskError) throw taskError;
      setTasks(taskData || []);

      // 2. Fetch Volunteer Hours
      const { data: hoursData, error: hoursError } = await supabase
        .from('volunteer_hours')
        .select('hours')
        .eq('volunteer_id', user?.id);

      if (hoursError) throw hoursError;

      const totalHours = hoursData?.reduce((sum, item) => sum + (Number(item.hours) || 0), 0) || 0;
      const completedTasks = taskData?.filter(t => t.status === 'completed').length || 0;

      setStats({ 
        hours: totalHours, 
        tasksCount: completedTasks 
      });

    } catch (err) {
      console.error('Error fetching volunteer data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Sidebar */}
      <aside className="lg:w-72 shrink-0">
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 p-8 sticky top-28">
          <div className="flex flex-col items-center text-center mb-10 pb-10 border-b border-gray-50">
            <div className="w-20 h-20 bg-dvs-dark-green text-white rounded-3xl flex items-center justify-center font-black text-3xl shadow-lg shadow-dvs-dark-green/20 mb-4 transform -rotate-3 hover:rotate-0 transition-transform">
              {userProfile?.name?.charAt(0) || user?.email?.charAt(0).toUpperCase() || 'V'}
            </div>
            <h3 className="font-black text-xl text-dark-text tracking-tight mb-1">{userProfile?.name || 'Volunteer'}</h3>
            <p className="text-[10px] font-black text-medium-gray uppercase tracking-[0.2em] bg-gray-50 px-4 py-1.5 rounded-full">DVS Volunteer</p>
          </div>
          
          <nav className="space-y-2">
            <TabButton icon={LayoutDashboard} label="Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
            <TabButton icon={Users} label="My Assignments" active={activeTab === 'tasks'} onClick={() => setActiveTab('tasks')} />
            <TabButton icon={User} label="My Profile" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
            
            <div className="pt-8 mt-8 border-t border-gray-50">
              <button 
                onClick={handleLogout} 
                className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-black text-red-500 hover:bg-red-50 transition-all group"
              >
                <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" /> Sign Out
              </button>
            </div>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[3rem] border border-gray-100 shadow-sm">
            <Loader2 size={48} className="text-dvs-dark-green animate-spin mb-4" />
            <p className="text-medium-gray font-black uppercase tracking-widest text-xs">Syncing with HQ...</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <StatCard icon={Clock} label="Service Hours" value={stats.hours} color="blue" />
                  <StatCard icon={CheckCircle2} label="Tasks Completed" value={stats.tasksCount} color="green" />
                  <StatCard icon={Users} label="Community Impact" value={stats.hours > 20 ? "Significant" : "Growing"} color="orange" />
                </div>

                <div className="bg-white rounded-[3rem] shadow-xl shadow-gray-200/50 border border-gray-100 p-10">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-black text-dark-text tracking-tight">Recent Tasks</h3>
                    <button onClick={() => setActiveTab('tasks')} className="text-dvs-dark-green font-black text-xs uppercase tracking-widest hover:underline">View All</button>
                  </div>
                  
                  {tasks.length > 0 ? (
                    <div className="space-y-4">
                      {tasks.slice(0, 3).map(task => (
                        <div key={task.id} className="flex justify-between items-center p-6 bg-gray-50/50 rounded-[2rem] border border-transparent hover:border-gray-200 transition-all group">
                          <div className="flex items-center gap-6">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${task.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                              {task.status === 'completed' ? <CheckCircle2 size={24} /> : <Clock size={24} />}
                            </div>
                            <div>
                              <p className="font-black text-dark-text group-hover:text-dvs-dark-green transition-colors">{task.title}</p>
                              <div className="flex items-center gap-4 mt-1 text-[11px] font-bold text-medium-gray uppercase tracking-wider">
                                <span className="flex items-center gap-1.5"><MapPin size={12} className="text-dvs-orange" />{task.location || 'Remote'}</span>
                                <span>{task.task_date ? format(new Date(task.task_date), 'MMM dd, yyyy') : 'No Date'}</span>
                              </div>
                            </div>
                          </div>
                          <span className={`text-[10px] font-black uppercase tracking-widest px-5 py-2 rounded-full ${
                            task.status === 'completed' ? 'bg-green-100 text-green-700' : 
                            task.status === 'in_progress' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {task.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16 bg-gray-50/50 rounded-[2.5rem]">
                      <AlertCircle size={48} className="mx-auto text-gray-200 mb-4" />
                      <p className="text-medium-gray font-bold">No tasks assigned yet.</p>
                      <button className="mt-4 text-dvs-dark-green font-black text-xs uppercase tracking-widest">Apply for opportunities</button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'tasks' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="bg-white rounded-[3rem] shadow-xl shadow-gray-200/50 border border-gray-100 p-10">
                <h3 className="text-3xl font-black text-dark-text tracking-tight mb-8">Service Record</h3>
                {tasks.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {tasks.map(task => (
                      <div key={task.id} className="flex flex-col md:flex-row justify-between md:items-center p-8 bg-gray-50/50 rounded-[2.5rem] border border-gray-100 hover:shadow-lg transition-all">
                        <div className="mb-4 md:mb-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-xl font-bold text-dark-text">{task.title}</h4>
                            <span className="text-[10px] font-black bg-white px-3 py-1 rounded-full border border-gray-100 uppercase tracking-widest">{task.type || 'Activity'}</span>
                          </div>
                          <p className="text-sm text-medium-gray mb-4 max-w-lg">{task.description}</p>
                          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] font-black text-medium-gray uppercase tracking-widest opacity-80">
                            <span className="flex items-center gap-2"><MapPin size={14} className="text-dvs-orange" /> {task.location || 'Jharkhand'}</span>
                            <span className="flex items-center gap-2"><Clock size={14} className="text-dvs-orange" /> {task.estimated_hours || 0} Hours Est.</span>
                            <span className="flex items-center gap-2"><CheckCircle2 size={14} className="text-dvs-orange" /> {task.task_date ? format(new Date(task.task_date), 'MMM dd, yyyy') : 'TBD'}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={`text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-2xl ${
                            task.status === 'completed' ? 'bg-green-100 text-green-700' : 
                            task.status === 'in_progress' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {task.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-medium-gray font-bold py-10 text-center">No tasks assigned to your profile yet.</p>}
              </motion.div>
            )}

            {activeTab === 'profile' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="bg-white rounded-[3rem] shadow-xl shadow-gray-200/50 border border-gray-100 p-10 max-w-3xl">
                <h3 className="text-3xl font-black text-dark-text tracking-tight mb-8">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <ProfileField label="Full Name" value={userProfile?.name} />
                  <ProfileField label="Primary Email" value={userProfile?.email} />
                  <ProfileField label="Mobile Number" value={userProfile?.phone} />
                  <ProfileField label="Assigned District" value={userProfile?.district} />
                  <div className="md:col-span-2 p-6 bg-gray-50 rounded-3xl border border-gray-100">
                    <p className="text-[10px] font-black text-medium-gray uppercase tracking-widest mb-3">Volunteer Status</p>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-sm shadow-green-500/50" />
                      <span className="text-sm font-bold text-dark-text">Verified Active Volunteer</span>
                    </div>
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
    <button 
      onClick={onClick} 
      className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-black transition-all duration-300 ${
        active 
        ? 'bg-dvs-dark-green text-white shadow-xl shadow-dvs-dark-green/20 scale-[1.02]' 
        : 'text-medium-gray hover:bg-gray-50 hover:text-dark-text'
      }`}
    >
      <Icon size={20} /> {label}
    </button>
  );
}

function StatCard({ icon: Icon, label, value, color }: any) {
  const colors: any = { 
    orange: 'bg-orange-50 text-orange-600 border-orange-100', 
    blue: 'bg-blue-50 text-blue-600 border-blue-100', 
    green: 'bg-green-50 text-green-600 border-green-100' 
  };
  
  return (
    <div className={`bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/40 border-2 ${colors[color].split(' ')[2]} hover:shadow-2xl transition-all duration-300`}>
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-inner ${colors[color].split(' ').slice(0, 2).join(' ')}`}><Icon size={28} /></div>
      <p className="text-[10px] font-black text-medium-gray uppercase tracking-[0.2em] mb-2">{label}</p>
      <h4 className="text-4xl font-black text-dark-text tracking-tighter">{value}</h4>
    </div>
  );
}

function ProfileField({ label, value }: { label: string, value: string }) {
  return (
    <div className="group">
      <label className="block text-[10px] font-black text-medium-gray uppercase tracking-[0.2em] mb-2 group-hover:text-dvs-orange transition-colors">{label}</label>
      <p className="text-lg font-bold text-dark-text bg-gray-50/50 px-6 py-4 rounded-2xl border border-transparent group-hover:border-gray-200 transition-all">{value || 'Not provided'}</p>
    </div>
  );
}
