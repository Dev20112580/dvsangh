import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Download, Heart, Share2, Search } from 'lucide-react';

const categories = ['All', 'Educational Programs', 'Girls Education', 'Sports & Yoga', 'Social Service', 'Workshops'];

const photos = Array.from({ length: 12 }).map((_, i) => ({
  id: i + 1,
  url: `https://picsum.photos/seed/gallery${i + 1}/800/600`,
  category: categories[Math.floor(Math.random() * (categories.length - 1)) + 1],
  title: `DVS Event ${i + 1}`,
  date: '22 March 2026'
}));

export default function Gallery() {
  const [activeCategory, setActiveCategory] = React.useState('All');
  const [selectedPhoto, setSelectedPhoto] = React.useState<typeof photos[0] | null>(null);

  const filteredPhotos = activeCategory === 'All' 
    ? photos 
    : photos.filter(p => p.category === activeCategory);

  return (
    <div className="pt-32 pb-24">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-dark-text mb-6">Photo Gallery</h1>
          <p className="body-text text-lg">
            Capturing the moments of change and empowerment in rural Jharkhand.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="flex flex-wrap justify-center gap-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeCategory === cat ? 'bg-dvs-orange text-white shadow-md' : 'bg-white text-medium-gray hover:text-dark-text border border-gray-100'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredPhotos.map((photo) => (
              <motion.div
                key={photo.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -8 }}
                onClick={() => setSelectedPhoto(photo)}
                className="group relative cursor-pointer rounded-2xl overflow-hidden shadow-sm aspect-[4/3]"
              >
                <img
                  src={photo.url}
                  alt={photo.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                  <p className="text-white font-bold text-lg mb-1">{photo.title}</p>
                  <p className="text-white/70 text-sm">{photo.category} • {photo.date}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-12"
          >
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-8 right-8 text-white/70 hover:text-white"
            >
              <X size={40} />
            </button>

            <div className="max-w-5xl w-full flex flex-col items-center">
              <motion.img
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                src={selectedPhoto.url}
                alt={selectedPhoto.title}
                className="max-h-[70vh] w-auto rounded-2xl shadow-2xl mb-8"
                referrerPolicy="no-referrer"
              />
              <div className="text-center text-white">
                <h3 className="text-2xl font-bold mb-2">{selectedPhoto.title}</h3>
                <p className="text-white/60 mb-8">{selectedPhoto.category} • {selectedPhoto.date}</p>
                <div className="flex gap-6">
                  <button className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
                    <Heart size={24} /> Like
                  </button>
                  <button className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
                    <Download size={24} /> Download
                  </button>
                  <button className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
                    <Share2 size={24} /> Share
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
