import React from 'react';
import Hero from '../components/Hero';
import Stats from '../components/Stats';
import FocusAreas from '../components/FocusAreas';
import Testimonials from '../components/Testimonials';
import { motion } from 'motion/react';
import { ArrowRight, BookOpen, Users, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Home() {
  const [news, setNews] = React.useState<any[]>([]);

  React.useEffect(() => {
    async function fetchNews() {
      const { data } = await supabase
        .from('news')
        .select('*')
        .order('published_at', { ascending: false })
        .limit(3);
      if (data) setNews(data);
    }
    fetchNews();
  }, []);
  return (
    <div className="pt-0">
      <Hero />
      <Stats />
      <FocusAreas />
      <Testimonials />

      {/* News Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="section-heading mb-4">ताज़ा समाचार एवं ब्लॉग</h2>
              <p className="body-text">DVS की नवीनतम गतिविधियों और समाचारों से अपडेट रहें।</p>
            </div>
            <Link to="/news" className="hidden md:flex items-center gap-2 text-dvs-orange font-bold hover:gap-3 transition-all">
              View All News <ArrowRight size={20} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="p-6">
                  <div className="flex items-center gap-4 text-xs text-medium-gray mb-4">
                    <span>{new Date(item.published_at).toLocaleDateString()}</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full" />
                    <span className="text-dvs-orange font-bold uppercase">{item.category}</span>
                  </div>
                  <h3 className="text-xl font-bold text-dark-text mb-4 line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="body-text text-sm mb-6 line-clamp-3">
                    {item.content?.substring(0, 150)}...
                  </p>
                  <Link to={`/news/${item.id}`} className="text-dvs-orange font-bold text-sm flex items-center gap-2">
                    Read More <ArrowRight size={16} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-dvs-orange to-[#ff8c5a] rounded-[2rem] p-12 md:p-20 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative z-10"
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-6">शिक्षा ही सबसे बड़ा अधिकार है</h2>
              <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
                आपका एक छोटा सा योगदान किसी ग्रामीण छात्र का भविष्य बदल सकता है। आज ही DVS परिवार का हिस्सा बनें।
              </p>
              <div className="flex flex-wrap justify-center gap-6">
                <Link
                  to="/donate"
                  className="bg-white text-dvs-orange px-10 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all flex items-center gap-2"
                >
                  <Heart size={20} /> अभी दान करें
                </Link>
                <Link
                  to="/auth"
                  className="bg-dvs-dark-green text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-opacity-90 transition-all flex items-center gap-2"
                >
                  <Users size={20} /> स्वयंसेवक बनें
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
