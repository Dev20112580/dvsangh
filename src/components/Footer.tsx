import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Youtube, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

import { supabase } from '../supabase';

export default function Footer() {
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleNewsletter = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const email = (e.currentTarget.elements.namedItem('email') as HTMLInputElement).value;
    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert([{ email }]);
        
      if (error) throw error;
      alert(t('Thank you for subscribing!', 'सब्सक्राइब करने के लिए धन्यवाद!'));
      e.currentTarget.reset();
    } catch (error) {
      console.error('Newsletter Error:', error);
      alert(t('Failed to subscribe. Please try again.', 'सब्सक्राइब करने में विफल रहा। कृपया फिर से प्रयास करें।'));
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
              <img src="/logo_dvs.jpg" alt="DVS Logo" className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-md" />
              <h2 className="text-xl font-bold">DVS NGO</h2>
            </div>
            <p className="text-white/70 text-sm leading-relaxed mb-6">
              {t('Empowering rural students in Jharkhand through quality education, digital literacy, and holistic development.', 'गुणवत्तापूर्ण शिक्षा, डिजिटल साक्षरता और समग्र विकास के माध्यम से झारखंड के ग्रामीण छात्रों को सशक्त बनाना।')}
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
            <h3 className="text-lg font-bold mb-6">{t('Quick Links', 'त्वरित संपर्क')}</h3>
            <ul className="space-y-4 text-sm text-white/70">
              <li><Link to="/about" className="hover:text-white transition-colors">{t('About Us', 'हमारे बारे में')}</Link></li>
              <li><Link to="/programs" className="hover:text-white transition-colors">{t('Our Programs', 'हमारे कार्यक्रम')}</Link></li>
              <li><Link to="/gallery" className="hover:text-white transition-colors">{t('Photo Gallery', 'फोटो गैलरी')}</Link></li>
              <li><Link to="/scholarship" className="hover:text-white transition-colors">{t('Scholarship', 'छात्रवृति')}</Link></li>
              <li><Link to="/news" className="hover:text-white transition-colors">{t('News & Updates', 'समाचार और अपडेट')}</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">{t('Contact Us', 'संपर्क करें')}</Link></li>
              <li><Link to="/auth" className="hover:text-white transition-colors">{t('Login / Register', 'लॉगिन / रजिस्टर')}</Link></li>
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h3 className="text-lg font-bold mb-6">{t('Our Programs', 'हमारे कार्यक्रम')}</h3>
            <ul className="space-y-4 text-sm text-white/70">
              <li><Link to="/programs/quality-education" className="hover:text-white transition-colors">{t('Quality Education', 'गुणवत्तापूर्ण शिक्षा')}</Link></li>
              <li><Link to="/programs/girl-education" className="hover:text-white transition-colors">{t('Girl Education', 'बालिका शिक्षा')}</Link></li>
              <li><Link to="/programs/digital-literacy" className="hover:text-white transition-colors">{t('Digital Literacy', 'डिजिटल साक्षरता')}</Link></li>
              <li><Link to="/programs/sports-yoga" className="hover:text-white transition-colors">{t('Sports & Yoga', 'खेलकूद और योग')}</Link></li>
              <li><Link to="/programs/competitive-exams" className="hover:text-white transition-colors">{t('Competitive Exams', 'प्रतियोगी परीक्षा')}</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-6">{t('Contact Us', 'संपर्क करें')}</h3>
            <ul className="space-y-4 text-sm text-white/70">
              <li className="flex gap-3">
                <MapPin size={20} className="text-dvs-orange shrink-0" />
                <span>{t('Jairuwa Khilkanali, Masalia, Dumka, Jharkhand — 814166', 'जैरुआ खिलकनाली, मसलिया, दुमका, झारखंड — 814166')}</span>
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
            <h3 className="text-lg font-bold mb-6">{t('Newsletter', 'न्यूज़लेटर')}</h3>
            <p className="text-white/70 text-sm mb-6">{t('Subscribe to get the latest updates and news from DVS.', 'DVS से नवीनतम अपडेट और समाचार प्राप्त करने के लिए सब्सक्राइब करें।')}</p>
            <form className="space-y-3" onSubmit={handleNewsletter}>
              <input
                type="email"
                name="email"
                placeholder={t('Your email address', 'आपका ईमेल पता')}
                required
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-dvs-orange"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-dvs-orange text-white py-3 rounded-xl font-bold text-sm hover:bg-opacity-90 transition-all disabled:opacity-50"
              >
                {isSubmitting ? t('Subscribing...', 'सब्सक्राइब कर रहे हैं...') : t('Subscribe', 'सब्सक्राइब करें')}
              </button>
            </form>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/50">
          <p>© 2025 Dronacharya Vidyarthi Sangh (DVS). {t('All rights reserved.', 'सर्वाधिकार सुरक्षित।')}</p>
          <div className="flex gap-6">
            <Link to="/privacy-policy" className="hover:text-white">{t('Privacy Policy', 'गोपनीयता नीति')}</Link>
            <Link to="/terms" className="hover:text-white">{t('Terms & Conditions', 'नियम और शर्तें')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
