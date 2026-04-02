import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { BookOpen, Video, FileText, Search, PlayCircle, Loader2, Download } from 'lucide-react';
import { supabase } from '../supabase';
import { formatDistanceToNow } from 'date-fns';

export default function Gyan() {
  const categories = ['All', 'UPSC', 'JPSC', 'Banking', 'Digital Literacy', 'Skill Dev'];
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResources();
  }, [activeCategory, searchQuery]);

  async function fetchResources() {
    setLoading(true);
    try {
      let query = supabase
        .from('study_materials')
        .select('*')
        .order('created_at', { ascending: false });

      if (activeCategory !== 'All') {
        // Query against exam_type array or subject
        query = query.or(`subject.eq.${activeCategory},exam_type.cs.{${activeCategory}}`);
      }

      if (searchQuery) {
        query = query.ilike('title', `%${searchQuery}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      setResources(data || []);
    } catch (err) {
      console.error('Error fetching resources:', err);
    } finally {
      setLoading(false);
    }
  }

  const getResourceTypeIcon = (type: string) => {
    const t = type?.toLowerCase();
    if (t?.includes('video')) return <Video size={14} className="text-blue-500" />;
    if (t?.includes('pdf') || t?.includes('doc')) return <FileText size={14} className="text-red-500" />;
    return <BookOpen size={14} className="text-green-500" />;
  };

  return (
    <div className="pt-32 pb-24 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-dark-text mb-6"
          >
            DVS <span className="text-dvs-orange">ज्ञान संगम</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="body-text text-lg"
          >
            A free digital library and knowledge base for students of Jharkhand. Access premium lectures, study notes, and career guidance.
          </motion.p>
        </div>

        {/* Search & Filter */}
        <div className="mb-12">
          <div className="relative max-w-2xl mx-auto mb-8">
            <input 
              type="text" 
              placeholder="Search lectures, notes, or topics..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border-2 border-gray-100 rounded-full py-4 pl-14 pr-6 text-lg focus:outline-none focus:border-dvs-orange shadow-sm"
            />
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-medium-gray" size={20} />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${
                  activeCategory === cat 
                  ? 'bg-dvs-dark-green text-white shadow-md' 
                  : 'bg-white text-medium-gray border border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2rem] border border-gray-100 shadow-sm">
            <Loader2 size={48} className="text-dvs-orange animate-spin mb-4" />
            <p className="text-medium-gray font-bold">Loading educational resources...</p>
          </div>
        ) : resources.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[2rem] border border-gray-100 shadow-sm">
            <BookOpen size={64} className="mx-auto text-gray-200 mb-4" />
            <h3 className="text-xl font-bold text-dark-text mb-2">No resources found</h3>
            <p className="text-medium-gray">Try adjusting your search or category filter.</p>
          </div>
        ) : (
          /* Resources Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {resources.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all group flex flex-col"
              >
                <div className="relative h-48 bg-gray-200 shrink-0">
                  <img 
                    src={item.thumbnail_url || "/assets/hero_classroom.png"} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    {item.file_type?.toLowerCase().includes('video') && (
                      <PlayCircle className="text-white opacity-80 group-hover:opacity-100 transform group-hover:scale-110 transition-all shadow-2xl" size={64} />
                    )}
                  </div>
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-dark-text flex items-center gap-1 shadow-sm">
                    {getResourceTypeIcon(item.file_type)}
                    <span className="capitalize">{item.file_type || 'Document'}</span>
                  </div>
                  {item.is_free && (
                    <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
                      Free
                    </div>
                  )}
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <span className="text-[10px] font-black text-dvs-orange uppercase tracking-[0.2em] mb-2">
                    {item.subject || item.exam_type?.[0] || 'General'}
                  </span>
                  <h3 className="text-xl font-bold text-dark-text mb-4 line-clamp-2 leading-tight group-hover:text-dvs-orange transition-colors">
                    {item.title}
                  </h3>
                  <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between text-xs text-medium-gray font-bold">
                    <div className="flex items-center gap-4">
                      <span>{item.download_count?.toLocaleString() || 0} {item.file_type?.toLowerCase().includes('video') ? 'views' : 'downloads'}</span>
                      <span>{formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}</span>
                    </div>
                    <a 
                      href={item.file_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-gray-100 p-2 rounded-lg text-dark-text hover:bg-dvs-orange hover:text-white transition-all shadow-sm"
                    >
                      <Download size={16} />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

