import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Youtube, Twitter, Mail, Phone, MapPin } from 'lucide-react';

import { supabase } from '../lib/supabase';

export default function Footer() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleNewsletter = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const email = (e.currentTarget.elements.namedItem('email') as HTMLInputElement).value;
    try {
      const { error } = await supabase.from('newsletter_subscriptions').insert([{ email }]);
      if (error) throw error;
      alert('Thank you for subscribing!');
      e.currentTarget.reset();
    } catch (error) {
      console.error('Newsletter Error:', error);
      alert('Failed to subscribe. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-dvs-dark-green text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-white text-dvs-dark-green rounded-full flex items-center justify-center font-bold text-xl">D</div>
              <h2 className="text-xl font-bold">DVS NGO</h2>
            </div>
            <p className="text-white/70 text-sm leading-relaxed mb-6">
              Empowering rural students in Jharkhand through quality education, digital literacy, and holistic development.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-dvs-orange transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-dvs-orange transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-dvs-orange transition-colors">
                <Youtube size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-dvs-orange transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6">Quick Links</h3>
            <ul className="space-y-4 text-sm text-white/70">
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/programs" className="hover:text-white transition-colors">Our Programs</Link></li>
              <li><Link to="/gallery" className="hover:text-white transition-colors">Photo Gallery</Link></li>
              <li><Link to="/scholarship" className="hover:text-white transition-colors">Scholarship</Link></li>
              <li><Link to="/news" className="hover:text-white transition-colors">News & Updates</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link to="/auth" className="hover:text-white transition-colors">Login / Register</Link></li>
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h3 className="text-lg font-bold mb-6">Our Programs</h3>
            <ul className="space-y-4 text-sm text-white/70">
              <li><Link to="/programs/quality-education" className="hover:text-white transition-colors">Quality Education</Link></li>
              <li><Link to="/programs/girl-education" className="hover:text-white transition-colors">Girl Education</Link></li>
              <li><Link to="/programs/digital-literacy" className="hover:text-white transition-colors">Digital Literacy</Link></li>
              <li><Link to="/programs/sports-yoga" className="hover:text-white transition-colors">Sports & Yoga</Link></li>
              <li><Link to="/programs/competitive-exams" className="hover:text-white transition-colors">Competitive Exams</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-6">Contact Us</h3>
            <ul className="space-y-4 text-sm text-white/70">
              <li className="flex gap-3">
                <MapPin size={20} className="text-dvs-orange shrink-0" />
                <span>Jairuwa Khilkanali, Masalia, Dumka, Jharkhand — 814166</span>
              </li>
              <li className="flex gap-3">
                <Phone size={20} className="text-dvs-orange shrink-0" />
                <span>+91 9241859951</span>
              </li>
              <li className="flex gap-3">
                <Mail size={20} className="text-dvs-orange shrink-0" />
                <span>dvs.ngo.official@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-bold mb-6">Newsletter</h3>
            <p className="text-white/70 text-sm mb-6">Subscribe to get the latest updates and news from DVS.</p>
            <form className="space-y-3" onSubmit={handleNewsletter}>
              <input
                type="email"
                name="email"
                placeholder="Your email address"
                required
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-dvs-orange"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-dvs-orange text-white py-3 rounded-xl font-bold text-sm hover:bg-opacity-90 transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/50">
          <p>© 2025 Dronacharya Vidyarthi Sangh (DVS). All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/privacy-policy" className="hover:text-white">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
