import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Download, Heart, Share2, Search, Loader2, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../supabase';
import { format } from 'date-fns';

export default function Gallery() {
  const categories = ['All', 'Scholarship', 'Education', 'Sports', 'Digital', 'Community', 'Events'];
  const [activeCategory, setActiveCategory] = useState('All');
  const [photos, setPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<any | null>(null);

  useEffect(() => {
    fetchPhotos();
  }, [activeCategory]);

  async function fetchPhotos() {
    setLoading(true);
    try {
      let query = supabase
        .from('gallery')
        .select('*')
        .order('created_at', { ascending: false });

      if (activeCategory !== 'All') {
        query = query.ilike('category', activeCategory);
      }

      const { data, error } = await query;
      if (error) throw error;
      setPhotos(data || []);
    } catch (err) {
      console.error('Error fetching photos:', err);
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
            Photo <span className="text-dvs-orange">Gallery</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="body-text text-lg"
          >
            Capturing the moments of change and empowerment in rural Jharkhand.
          </motion.p>
        </div>
      </section>

      {/* Filters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-8 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                activeCategory === cat 
                ? 'bg-dvs-dark-green text-white shadow-lg shadow-dvs-dark-green/20 scale-105' 
                : 'bg-white text-medium-gray hover:text-dark-text border border-gray-100 hover:border-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 size={48} className="text-dvs-orange animate-spin mb-4" />
            <p className="text-medium-gray font-bold">Loading moments...</p>
          </div>
        ) : photos.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[3rem] border border-gray-100 shadow-sm">
            <ImageIcon size={64} className="mx-auto text-gray-200 mb-4" />
            <h3 className="text-xl font-bold text-dark-text mb-2">No photos yet</h3>
            <p className="text-medium-gray">Check back soon for new gallery updates.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {photos.map((photo, i) => (
                <motion.div
                  key={photo.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setSelectedPhoto(photo)}
                  className="group relative cursor-pointer rounded-[2rem] overflow-hidden shadow-sm aspect-[4/3] bg-white border border-gray-100"
                >
                  <img
                    src={photo.photo_url || `https://picsum.photos/seed/${photo.id}/800/600`}
                    alt={photo.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-8">
                    <p className="text-white font-bold text-xl mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      {photo.title || 'DVS Event'}
                    </p>
                    <div className="flex items-center justify-between translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                      <p className="text-white/80 text-xs font-bold uppercase tracking-widest">
                        {photo.category || 'General'}
                      </p>
                      <p className="text-white/60 text-[10px] font-bold">
                        {photo.created_at ? format(new Date(photo.created_at), 'MMM yyyy') : ''}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-12"
          >
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
            >
              <X size={32} />
            </button>

            <div className="max-w-5xl w-full flex flex-col items-center">
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ type: 'spring', damping: 25 }}
                className="relative group/modal"
              >
                <img
                  src={selectedPhoto.photo_url || `https://picsum.photos/seed/${selectedPhoto.id}/1200/800`}
                  alt={selectedPhoto.title}
                  className="max-h-[75vh] w-auto rounded-3xl shadow-2xl border border-white/10"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50 opacity-0 group-hover/modal:opacity-100 transition-opacity rounded-3xl pointer-events-none" />
              </motion.div>
              
              <div className="mt-8 text-center text-white max-w-2xl px-6">
                <h3 className="text-3xl font-black mb-3 tracking-tight">{selectedPhoto.title || 'Event Moment'}</h3>
                <p className="text-white/60 font-bold uppercase tracking-[0.3em] text-xs mb-8">
                  {selectedPhoto.category || 'General'} • {selectedPhoto.created_at ? format(new Date(selectedPhoto.created_at), 'MMMM do, yyyy') : 'Recently'}
                </p>
                
                <div className="flex flex-wrap justify-center gap-4">
                  <button className="flex items-center gap-3 bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-2xl font-bold transition-all backdrop-blur-md border border-white/10 active:scale-95">
                    <Heart size={20} className="text-red-400" /> Like
                  </button>
                  <a 
                    href={selectedPhoto.photo_url} 
                    download 
                    className="flex items-center gap-3 bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-2xl font-bold transition-all backdrop-blur-md border border-white/10 active:scale-95"
                  >
                    <Download size={20} className="text-blue-400" /> Save
                  </a>
                  <button className="flex items-center gap-3 bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-2xl font-bold transition-all backdrop-blur-md border border-white/10 active:scale-95">
                    <Share2 size={20} className="text-green-400" /> Share
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
