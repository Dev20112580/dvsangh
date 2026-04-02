import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const images = [
  "/assets/hero_classroom.png",
  "/assets/hero_community.png",
  "/assets/hero_achievement.png"
];

export default function Hero() {
  const [currentImage, setCurrentImage] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-[600px] w-full overflow-hidden">
      {/* Background Slider */}
      {images.map((img, idx) => (
        <motion.div
          key={img}
          initial={{ opacity: 0 }}
          animate={{ opacity: currentImage === idx ? 1 : 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <img
            src={img}
            alt="DVS Hero"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/50" />
        </motion.div>
      ))}

      {/* Content */}
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-start">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="max-w-2xl"
        >
          <h1 className="hero-heading mb-6">
            ग्रामीण भारत में शिक्षा की ज्योति
          </h1>
          <p className="text-white/90 text-xl mb-10 font-dm">
            हर बच्चे को गुणवत्तापूर्ण शिक्षा का अधिकार है। DVS के साथ जुड़ें और बदलाव का हिस्सा बनें।
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/scholarship"
              className="bg-dvs-orange text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-opacity-90 transition-all flex items-center gap-2"
            >
              छात्रवृत्ति आवेदन <ArrowRight size={20} />
            </Link>
            <Link
              to="/donate"
              className="bg-white text-dark-text px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all"
            >
              अभी दान करें
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentImage(idx)}
            className={`w-3 h-3 rounded-full transition-all ${currentImage === idx ? 'bg-dvs-orange w-8' : 'bg-white/50'}`}
          />
        ))}
      </div>
    </div>
  );
}
