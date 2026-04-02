import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Users, Heart, ArrowRight, ArrowLeft, Mail, Lock, Phone, MapPin } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { UserRole } from '../types';
import { useSupabase } from '../SupabaseContext';
import { supabase } from '../supabase';

export default function Auth() {
  const { user, isAuthReady } = useSupabase();
  const [isLogin, setIsLogin] = React.useState(true);
  const [step, setStep] = React.useState(1);
  const [role, setRole] = React.useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isAuthReady && user) {
      navigate('/dashboard');
    }
  }, [user, isAuthReady, navigate]);

  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    phone: '',
    district: 'Dumka',
    password: ''
  });

  const handleRoleSelect = (selectedRole: UserRole) => {
    setRole(selectedRole);
    setStep(2);
  };

  const handleAuthError = (error: any) => {
    console.error('Auth Error:', error);
    alert(error.message || 'Authentication failed. Please try again.');
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/dashboard'
        }
      });
      if (error) throw error;
    } catch (error: any) {
      handleAuthError(error);
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const email = (e.target as any).elements[0].value;
      const password = (e.target as any).elements[1].value;
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      navigate('/dashboard');
    } catch (error: any) {
      handleAuthError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) return;
    setIsLoading(true);
    try {
      const finalRole = formData.email === 'pawanjerwa2023@gmail.com' ? UserRole.ADMIN : role;

      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name,
            phone: formData.phone,
            role: finalRole,
            district: formData.district,
          }
        }
      });
      if (error) throw error;

      if (data.user) {
        // Attempt to insert into public.users if a trigger didn't already
        const { error: profileError } = await supabase.from('users').insert({
          id: data.user.id, // Assuming id matches auth.users.id
          auth_id: data.user.id,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          role: finalRole,
          district: formData.district,
        });
        
        if (profileError) {
            console.log("Profile insert skipped or failed:", profileError.message);
        }
      }

      alert('Account created successfully! Please check your email to verify.');
      navigate('/dashboard');
    } catch (error: any) {
      handleAuthError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center bg-light-gray-bg p-4">
      <div className="max-w-5xl w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-gray-100">
        {/* Left: Info */}
        <div className="md:w-2/5 bg-dvs-orange p-12 text-white flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-6">DVS के साथ अपना भविष्य बनाएं</h2>
            <ul className="space-y-6">
              {[
                'Access Free Study Materials',
                'Apply for Scholarships',
                'Join Free Coaching',
                'Connect with Community'
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-white/90">
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                    <ArrowRight size={14} />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right: Form */}
        <div className="md:w-3/5 p-8 md:p-16">
          <div className="flex gap-8 mb-12 border-b border-gray-100">
            <button
              onClick={() => { setIsLogin(true); setStep(1); }}
              className={`pb-4 text-lg font-bold transition-all ${isLogin ? 'text-dvs-orange border-b-2 border-dvs-orange' : 'text-medium-gray'}`}
            >
              Login
            </button>
            <button
              onClick={() => { setIsLogin(false); setStep(1); }}
              className={`pb-4 text-lg font-bold transition-all ${!isLogin ? 'text-dvs-orange border-b-2 border-dvs-orange' : 'text-medium-gray'}`}
            >
              Register
            </button>
          </div>

          <AnimatePresence mode="wait">
            {isLogin ? (
              <motion.form
                key="login"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleLogin}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-bold text-dark-text mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-medium-gray" size={20} />
                    <input
                      type="email"
                      required
                      placeholder="Enter your email"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:border-dvs-orange"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-dark-text mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-medium-gray" size={20} />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:border-dvs-orange"
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-[10px] text-medium-gray">Admin? Use your official email.</p>
                  <Link to="/forgot-password" title="Forgot Password?" className="text-xs font-bold text-dvs-orange">Forgot Password?</Link>
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-dvs-orange text-white py-4 rounded-xl font-bold text-lg hover:bg-opacity-90 transition-all shadow-lg shadow-dvs-orange/20 disabled:opacity-50"
                >
                  {isLoading ? 'Logging in...' : 'Login'}
                </button>

                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-100"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-4 text-medium-gray font-bold">Or continue with</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className="w-full bg-white border border-gray-200 text-dark-text py-4 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all flex items-center justify-center gap-3"
                >
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                  Sign in with Google
                </button>
              </motion.form>
            ) : (
              <motion.div
                key="register"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                {step === 1 && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-dark-text mb-6">Choose Your Role</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {[
                        { id: UserRole.STUDENT, title: 'Student', hindi: 'छात्र', icon: User, desc: 'Apply for scholarships' },
                        { id: UserRole.VOLUNTEER, title: 'Volunteer', hindi: 'स्वयंसेवक', icon: Users, desc: 'Help rural students' },
                        { id: UserRole.DONOR, title: 'Donor', hindi: 'दानदाता', icon: Heart, desc: 'Support our mission' },
                      ].map((r) => (
                        <button
                          key={r.id}
                          onClick={() => handleRoleSelect(r.id)}
                          className={`p-6 rounded-2xl border-2 text-left transition-all hover:border-dvs-orange ${role === r.id ? 'border-dvs-orange bg-dvs-orange/5' : 'border-gray-100'}`}
                        >
                          <r.icon className={`mb-4 ${role === r.id ? 'text-dvs-orange' : 'text-medium-gray'}`} size={32} />
                          <h4 className="font-bold text-dark-text">{r.title}</h4>
                          <p className="text-xs text-medium-gray mb-1">{r.hindi}</p>
                          <p className="text-[10px] text-medium-gray leading-tight">{r.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6">
                    <button
                      onClick={() => setStep(1)}
                      className="flex items-center gap-2 text-medium-gray hover:text-dvs-orange font-bold transition-colors mb-4"
                    >
                      <ArrowLeft size={16} /> Back to Role Selection
                    </button>
                    <form onSubmit={handleRegister} className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-bold text-dark-text mb-2">Full Name</label>
                          <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-sm focus:outline-none focus:border-dvs-orange"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-dark-text mb-2">Mobile Number</label>
                          <input
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-sm focus:outline-none focus:border-dvs-orange"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-dark-text mb-2">Email Address</label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-sm focus:outline-none focus:border-dvs-orange"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-bold text-dark-text mb-2">District</label>
                          <select
                            value={formData.district}
                            onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-sm focus:outline-none focus:border-dvs-orange"
                          >
                            <option>Dumka</option>
                            <option>Deoghar</option>
                            <option>Ranchi</option>
                            <option>Jamshedpur</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-dark-text mb-2">Password</label>
                          <input
                            type="password"
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-sm focus:outline-none focus:border-dvs-orange"
                          />
                        </div>
                      </div>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-dvs-orange text-white py-4 rounded-xl font-bold text-lg hover:bg-opacity-90 transition-all shadow-lg shadow-dvs-orange/20 disabled:opacity-50"
                      >
                        {isLoading ? 'Creating Account...' : 'Register'}
                      </button>

                      <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-100"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-white px-4 text-medium-gray font-bold">Or continue with</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleGoogleLogin}
                        disabled={isLoading}
                        className="w-full bg-white border border-gray-200 text-dark-text py-4 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all flex items-center justify-center gap-3"
                      >
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                        Sign in with Google
                      </button>
                    </form>
                </div>
              )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
