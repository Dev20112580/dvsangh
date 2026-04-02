import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Calendar, Tag, Search, Loader2, Newspaper } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../supabase';
import { format } from 'date-fns';

export default function News() {
  const { t } = useLanguage();
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Scholarship', 'Education', 'Sports', 'Digital', 'Community'];

  useEffect(() => {
    fetchNews();
  }, [searchQuery, activeCategory]);

  async function fetchNews() {
    setLoading(true);
    try {
      let query = supabase
        .from('news_articles')
        .select('*')
        .order('published_at', { ascending: false });

      if (activeCategory !== 'All') {
        query = query.ilike('category', activeCategory);
      }

      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      setNews(data || []);
    } catch (err) {
      console.error('Error fetching news:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="pt-32 pb-24 bg-gray-50 min-h-screen">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="text-center max-w-3xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-dark-text mb-6"
          >
            {t('News &', 'समाचार और')} <span className="text-dvs-orange">{t('Updates', 'अपडेट')}</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="body-text text-lg"
          >
            {t('Stay updated with the latest activities, achievements, and announcements from Dronacharya Vidyarthi Sangh.', 'द्रोणाचार्य विद्यार्थी संघ की नवीनतम गतिविधियों, उपलब्धियों और घोषणाओं के साथ अपडेट रहें।')}
          </motion.p>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="flex flex-col md:flex-row gap-6 justify-between items-center bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-medium-gray" size={20} />
            <input
              type="text"
              placeholder={t('Search news...', 'समाचार खोजें...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-dvs-orange transition-all"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
                  activeCategory === cat 
                  ? 'bg-dvs-dark-green text-white shadow-md' 
                  : 'bg-gray-50 text-medium-gray hover:bg-gray-100 border border-transparent'
                }`}
              >
                {t(cat, cat === 'All' ? 'सभी' : (cat === 'Scholarship' ? 'छात्रवृति' : (cat === 'Education' ? 'शिक्षा' : (cat === 'Sports' ? 'खेल' : (cat === 'Digital' ? 'डिजिटल' : (cat === 'Community' ? 'समुदाय' : cat))))))}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* News Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 size={48} className="text-dvs-orange animate-spin mb-4" />
            <p className="text-medium-gray font-bold">{t('Fetching latest updates...', 'नवीनतम अपडेट प्राप्त किए जा रहे हैं...')}</p>
          </div>
        ) : news.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[2rem] border border-gray-100 shadow-sm">
            <Newspaper size={64} className="mx-auto text-gray-200 mb-4" />
            <h3 className="text-xl font-bold text-dark-text mb-2">{t('No updates found', 'कोई अपडेट नहीं मिला')}</h3>
            <p className="text-medium-gray">{t('Check back later for fresh news and announcements.', 'ताजा समाचारों और घोषणाओं के लिए बाद में देखें।')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all group flex flex-col h-full"
              >
                <div className="relative h-60 overflow-hidden shrink-0">
                  <img
                    src={item.image_url || `https://picsum.photos/seed/${item.id}/800/600`}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black text-dvs-orange uppercase tracking-[0.2em] shadow-sm">
                    {t(item.category || 'General', item.category === 'Scholarship' ? 'छात्रवृत्ति' : (item.category === 'Education' ? 'शिक्षा' : (item.category === 'Sports' ? 'खेल' : (item.category === 'Digital' ? 'डिजिटल' : (item.category === 'Community' ? 'समुदाय' : 'सामान्य')))))}
                  </div>
                </div>
                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex items-center gap-3 text-xs text-medium-gray font-bold mb-5 opacity-80 uppercase tracking-wider">
                    <Calendar size={14} className="text-dvs-dark-green" />
                    <span>{item.published_at ? format(new Date(item.published_at), 'MMM dd, yyyy') : t('Recently', 'हाल ही में')}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-dark-text mb-4 line-clamp-2 group-hover:text-dvs-orange transition-colors leading-tight">
                    {item.title}
                  </h3>
                  <p className="body-text text-sm mb-8 line-clamp-3 text-medium-gray leading-relaxed flex-grow">
                    {item.content?.substring(0, 150)}...
                  </p>
                  <Link 
                    to={`/news/${item.slug || item.id}`} 
                    className="mt-auto inline-flex items-center gap-3 text-dvs-dark-green font-black text-sm uppercase tracking-widest hover:text-dvs-orange transition-all group/btn"
                  >
                    {t('Read Full Story', 'पूरी कहानी पढ़ें')} 
                    <span className="w-8 h-8 rounded-full border-2 border-gray-100 flex items-center justify-center group-hover/btn:border-dvs-orange transition-colors">
                      <ArrowRight size={14} />
                    </span>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Pagination (Optional/Mock for now) */}
      {!loading && news.length > 0 && (
        <section className="mt-16 flex justify-center gap-3">
          {[1].map((p) => (
            <button
              key={p}
              className={`w-12 h-12 rounded-2xl font-black transition-all ${p === 1 ? 'bg-dvs-dark-green text-white shadow-lg shadow-dvs-dark-green/20' : 'bg-white text-medium-gray hover:bg-gray-50 border-2 border-gray-100'}`}
            >
              {p}
            </button>
          ))}
        </section>
      )}
    </div>
  );
}
