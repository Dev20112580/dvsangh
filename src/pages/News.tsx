import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Calendar, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { NEWS_ITEMS as STATIC_NEWS } from '../constants';
import { supabase } from '../lib/supabase';

export default function News() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        let query = supabase
          .from('news')
          .select('*')
          .order('created_at', { ascending: false });

        if (selectedCategory !== 'All') {
          query = query.eq('category', selectedCategory);
        }

        if (searchTerm) {
          query = query.ilike('title', `%${searchTerm}%`);
        }

        const { data, error } = await query;
        
        if (data && data.length > 0) {
          setNews(data);
        } else {
          setNews(STATIC_NEWS);
        }
      } catch (err) {
        console.error('Error fetching news:', err);
        setNews(STATIC_NEWS);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchNews();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, selectedCategory]);

  return (
    <div className="pt-32 pb-24">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-dark-text mb-6">News & Updates</h1>
          <p className="body-text text-lg">
            Stay updated with the latest activities, achievements, and announcements from DVS.
          </p>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="flex flex-col md:flex-row gap-6 justify-between items-center bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-medium-gray" size={20} />
            <input
              type="text"
              placeholder="Search news..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-dvs-orange"
            />
          </div>
          <div className="flex gap-4 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
            {['All', 'Scholarship', 'Education', 'Sports', 'Digital'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${selectedCategory === cat ? 'bg-dvs-orange text-white shadow-md' : 'bg-gray-50 text-medium-gray hover:bg-gray-100'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* News Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dvs-orange"></div>
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
                className="bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow group"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={item.image_url || item.image || 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&q=80'}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-1 rounded-full text-[10px] font-bold text-dvs-orange uppercase tracking-wider">
                    {item.category}
                  </div>
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-2 text-xs text-medium-gray mb-4">
                    <Calendar size={14} />
                    <span>{item.created_at ? new Date(item.created_at).toLocaleDateString() : item.date}</span>
                  </div>
                  <h3 className="text-xl font-bold text-dark-text mb-4 line-clamp-2 group-hover:text-dvs-orange transition-colors">
                    {item.title}
                  </h3>
                  <p className="body-text text-sm mb-8 line-clamp-3">
                    {item.content || item.excerpt}
                  </p>
                  <Link to={`/news/${item.id}`} className="text-dvs-orange font-bold text-sm flex items-center gap-2 group-hover:gap-3 transition-all">
                    Read More <ArrowRight size={18} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Pagination Placeholder */}
      <section className="mt-16 flex justify-center gap-2">
        <button className="w-10 h-10 rounded-xl font-bold bg-dvs-orange text-white shadow-md">1</button>
      </section>
    </div>
  );
}
