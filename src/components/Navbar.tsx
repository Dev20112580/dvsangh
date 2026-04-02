import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Bell, User, LogOut, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useSupabase } from '../SupabaseContext';
import { supabase } from '../supabase';

export default function Navbar() {
  const { user, userProfile } = useSupabase();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [lang, setLang] = React.useState<'HI' | 'EN'>('HI');

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Logout Error:', error);
    }
  };

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Programs', path: '/programs' },
    { name: 'Gyan (ज्ञान)', path: '/gyan' },
    { name: 'Jobs', path: '/jobs' },
    { name: 'Scholarship', path: '/scholarship' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'News', path: '/news' },
    { name: 'Donate', path: '/donate' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo_dvs.jpg" alt="DVS Logo" className="w-10 h-10 rounded-full object-cover border border-dvs-orange shadow-sm" />
            <div className="hidden sm:block">
              <h1 className={`text-lg font-bold leading-tight ${isScrolled ? 'text-dark-text' : 'text-white'}`}>द्रोणाचार्य विद्यार्थी संघ</h1>
              <p className={`text-xs ${isScrolled ? 'text-medium-gray' : 'text-white/80'}`}>Dronacharya Vidyarthi Sangh</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-dvs-orange ${isScrolled ? 'text-dark-text' : 'text-white'}`}
              >
                {link.name}
              </Link>
            ))}
            <button
              onClick={() => setLang(lang === 'HI' ? 'EN' : 'HI')}
              className={`text-xs font-bold px-3 py-1 rounded-full border transition-all ${isScrolled ? 'border-dark-text text-dark-text hover:bg-dark-text hover:text-white' : 'border-white text-white hover:bg-white hover:text-dark-text'}`}
            >
              {lang === 'HI' ? 'English' : 'हिंदी'}
            </button>
            {user ? (
              <div className="flex items-center gap-4">
                <Link
                  to="/dashboard"
                  className={`flex items-center gap-2 text-sm font-bold transition-colors hover:text-dvs-orange ${isScrolled ? 'text-dark-text' : 'text-white'}`}
                >
                  <LayoutDashboard size={18} /> Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className={`text-sm font-bold transition-colors hover:text-red-500 ${isScrolled ? 'text-dark-text' : 'text-white'}`}
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <Link
                to="/join"
                className="bg-dvs-orange text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-opacity-90 transition-all"
              >
                Join Us
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`${isScrolled ? 'text-dark-text' : 'text-white'}`}
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-4 text-base font-medium text-dark-text hover:bg-gray-50 rounded-lg"
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4">
                {user ? (
                  <div className="space-y-2">
                    <Link
                      to="/dashboard"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-center gap-2 w-full bg-dvs-orange text-white px-6 py-3 rounded-xl font-semibold"
                    >
                      <LayoutDashboard size={18} /> Dashboard
                    </Link>
                    <button
                      onClick={() => { handleLogout(); setIsOpen(false); }}
                      className="flex items-center justify-center gap-2 w-full bg-red-50 text-red-500 px-6 py-3 rounded-xl font-semibold"
                    >
                      <LogOut size={18} /> Logout
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/join"
                    onClick={() => setIsOpen(false)}
                    className="block w-full text-center bg-dvs-orange text-white px-6 py-3 rounded-xl font-semibold"
                  >
                    Join Us
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
