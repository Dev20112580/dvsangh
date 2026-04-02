import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutDashboard, Heart, User, LogOut, CheckCircle2, TrendingUp, Download, Loader2, IndianRupee } from 'lucide-react';
import { useSupabase } from '../../SupabaseContext';
import { supabase } from '../../supabase';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

export default function DonorDashboard() {
  const { user, userProfile, signOut } = useSupabase();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({ total_donated: 0, impact: 0, count: 0 });
  const [donations, setDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userProfile?.email || user?.email) {
      fetchDonorData();
    }
  }, [userProfile, user]);

  const fetchDonorData = async () => {
    setLoading(true);
    try {
      const email = userProfile?.email || user?.email;
      
      const { data, error } = await supabase
        .from('donations')
        .select('*')
        .eq('donor_email', email)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const total = data?.reduce((sum, d) => sum + (Number(d.amount) || 0), 0) || 0;
      const impactCount = Math.floor(total / 1000);

      setDonations(data || []);
      setStats({
        total_donated: total,
        impact: impactCount,
        count: data?.length || 0
      });
    } catch (err) {
      console.error('Error fetching donor data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 min-h-[600px]">
      {/* Sidebar */}
      <aside className="lg:w-72 shrink-0">
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 p-8 sticky top-28">
          <div className="flex flex-col items-center text-center mb-10 pb-10 border-b border-gray-50">
            <div className="w-20 h-20 bg-rose-500 text-white rounded-3xl flex items-center justify-center font-black text-3xl shadow-lg shadow-rose-500/20 mb-4 transform rotate-3 hover:rotate-0 transition-transform">
              {userProfile?.name?.charAt(0) || user?.email?.charAt(0).toUpperCase() || 'D'}
            </div>
            <h3 className="font-black text-xl text-dark-text tracking-tight mb-1">{userProfile?.name || 'Supporter'}</h3>
            <p className="text-[10px] font-black text-medium-gray uppercase tracking-[0.2em] bg-gray-50 px-4 py-1.5 rounded-full text-rose-600">DVS Patron</p>
          </div>

          <nav className="space-y-2">
            <TabButton icon={LayoutDashboard} label="Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} color="rose" />
            <TabButton icon={Heart} label="Donations" active={activeTab === 'donations'} onClick={() => setActiveTab('donations')} color="rose" />
            <TabButton icon={User} label="My Profile" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} color="rose" />
            
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
            <Loader2 size={48} className="text-rose-500 animate-spin mb-4" />
            <p className="text-medium-gray font-black uppercase tracking-widest text-xs">Loading Impact...</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <StatCard icon={IndianRupee} label="Total Life-time" value={`₹${stats.total_donated.toLocaleString()}`} color="rose" />
                  <StatCard icon={TrendingUp} label="Lives Touched" value={stats.impact} color="green" />
                  <StatCard icon={CheckCircle2} label="Completed" value={stats.count} color="blue" />
                </div>

                <div className="bg-white rounded-[3rem] shadow-xl shadow-gray-200/50 border border-gray-100 p-10">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-black text-dark-text tracking-tight">Recent Donations</h3>
                    <button onClick={() => setActiveTab('donations')} className="text-rose-600 font-black text-xs uppercase tracking-widest hover:underline">Full History</button>
                  </div>
                  
                  {donations.length > 0 ? (
                    <div className="space-y-4">
                      {donations.slice(0, 3).map(don => (
                        <div key={don.id} className="flex justify-between items-center p-6 bg-gray-50/50 rounded-[2rem] border border-transparent hover:border-gray-200 transition-all group">
                          <div className="flex items-center gap-6">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-sm text-rose-500">
                              <Heart size={24} fill={don.status === 'completed' ? 'currentColor' : 'none'} />
                            </div>
                            <div>
                              <p className="font-black text-dark-text group-hover:text-rose-600 transition-colors">₹{don.amount.toLocaleString()}</p>
                              <p className="text-[11px] font-bold text-medium-gray uppercase tracking-wider mt-1">
                                {don.created_at ? format(new Date(don.created_at), 'MMM dd, yyyy') : 'Recently'} • {don.donor_pan ? '80G Benefit' : 'General'}
                              </p>
                            </div>
                          </div>
                          {don.is_80g_issued && don['80g_certificate_url'] && (
                            <a 
                              href={don['80g_certificate_url']} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-rose-600 hover:bg-rose-50 p-3 rounded-2xl transition-colors"
                              title="Download Receipt"
                            >
                              <Download size={20} />
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16 bg-gray-50/50 rounded-[2.5rem]">
                      <Heart size={48} className="mx-auto text-gray-200 mb-4" />
                      <p className="text-medium-gray font-bold">Your generosity will shine here.</p>
                      <button onClick={() => navigate('/donate')} className="mt-4 text-rose-600 font-black text-xs uppercase tracking-widest">Support a cause</button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'donations' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="bg-white rounded-[3rem] shadow-xl shadow-gray-200/50 border border-gray-100 p-10">
                <h3 className="text-3xl font-black text-dark-text tracking-tight mb-8">Donation History</h3>
                {donations.length > 0 ? (
                  <div className="space-y-4">
                    {donations.map(don => (
                      <div key={don.id} className="flex flex-col md:flex-row justify-between md:items-center p-8 bg-gray-50/50 rounded-[2.5rem] border border-gray-100 hover:shadow-lg transition-all group">
                        <div className="mb-4 md:mb-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-2xl font-black text-dark-text group-hover:text-rose-600 transition-colors">₹{don.amount.toLocaleString()}</h4>
                            <span className={`text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest ${don.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                              {don.status}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] font-black text-medium-gray uppercase tracking-widest opacity-80">
                            <span className="flex items-center gap-2">Reference: {don.id.slice(0, 8)}</span>
                            <span className="flex items-center gap-2">Date: {don.created_at ? format(new Date(don.created_at), 'PPp') : 'Recently'}</span>
                            {don.donor_pan && <span className="text-rose-500">80G Applied</span>}
                          </div>
                        </div>
                        {don.is_80g_issued && don['80g_certificate_url'] ? (
                          <a 
                            href={don['80g_certificate_url']}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-3 bg-rose-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-rose-600/20 hover:scale-105 active:scale-95 transition-all"
                          >
                            <Download size={16} /> 80G Receipt
                          </a>
                        ) : (
                          <span className="text-[10px] font-black text-medium-gray uppercase tracking-widest bg-gray-100 px-6 py-4 rounded-2xl border border-gray-200">
                            {don.donor_pan ? 'Processing Receipt' : 'No Receipt'}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : <p className="text-medium-gray font-bold py-10 text-center">No donation records found for this account.</p>}
              </motion.div>
            )}

            {activeTab === 'profile' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="bg-white rounded-[3rem] shadow-xl shadow-gray-200/50 border border-gray-100 p-10 max-w-3xl">
                <h3 className="text-3xl font-black text-dark-text tracking-tight mb-8">Patron Profile</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <ProfileField label="Full Name" value={userProfile?.name} icon="rose" />
                  <ProfileField label="Email Address" value={userProfile?.email || user?.email} icon="rose" />
                  <ProfileField label="Mobile Number" value={userProfile?.phone} icon="rose" />
                  <ProfileField label="PAN Card (Tax Benefit)" value="Not Provided" icon="rose" />
                  
                  <div className="md:col-span-2 p-8 bg-rose-50/50 rounded-[2.5rem] border border-rose-100 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest mb-2">Impact Tier</p>
                      <h4 className="text-xl font-black text-dark-text">Educational Supporter</h4>
                    </div>
                    <IndianRupee size={40} className="text-rose-200" />
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

function TabButton({ icon: Icon, label, active, onClick, color }: any) {
  const activeStyles: any = {
    rose: 'bg-rose-600 text-white shadow-xl shadow-rose-600/20 scale-[1.02]'
  };

  return (
    <button 
      onClick={onClick} 
      className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-black transition-all duration-300 ${
        active 
        ? activeStyles[color] 
        : 'text-medium-gray hover:bg-gray-50 hover:text-dark-text'
      }`}
    >
      <Icon size={20} /> {label}
    </button>
  );
}

function StatCard({ icon: Icon, label, value, color }: any) {
  const colors: any = { 
    rose: 'bg-rose-50 text-rose-600 border-rose-100', 
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

function ProfileField({ label, value, icon }: { label: string, value: string, icon?: string }) {
  const hoverColor = icon === 'rose' ? 'group-hover:text-rose-600' : 'group-hover:text-dvs-orange';
  
  return (
    <div className="group">
      <label className={`block text-[10px] font-black text-medium-gray uppercase tracking-[0.2em] mb-2 ${hoverColor} transition-colors`}>{label}</label>
      <p className="text-lg font-bold text-dark-text bg-gray-50/50 px-6 py-4 rounded-2xl border border-transparent group-hover:border-gray-200 transition-all">{value || 'Not provided'}</p>
    </div>
  );
}
