import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Calendar, Tag, Share2, MessageSquare } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { NEWS_ITEMS } from '../constants';

export default function NewsDetail() {
  const { t } = useLanguage();
  const { id } = useParams();
  const news = NEWS_ITEMS.find(n => n.id === id);

  if (!news) {
    return (
      <div className="pt-32 pb-24 text-center">
        <h1 className="text-2xl font-bold mb-4">{t('News not found', 'समाचार नहीं मिला')}</h1>
        <Link to="/news" className="text-dvs-orange font-bold">{t('Back to News', 'समाचार पर वापस जाएं')}</Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/news" className="inline-flex items-center gap-2 text-medium-gray hover:text-dvs-orange font-bold mb-12 transition-colors">
          <ArrowLeft size={20} /> {t('Back to News', 'समाचार पर वापस जाएं')}
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-4 text-sm text-medium-gray">
              <span className="bg-dvs-orange/10 text-dvs-orange px-4 py-1 rounded-full font-bold uppercase tracking-wider text-xs">
                {news.category}
              </span>
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>{news.date}</span>
              </div>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-dark-text leading-tight">
              {news.title}
            </h1>
          </div>

          <div className="rounded-[2.5rem] overflow-hidden shadow-2xl aspect-video">
            <img
              src={news.image}
              alt={news.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="prose prose-lg max-w-none body-text leading-relaxed space-y-6">
            <p className="text-xl font-medium text-dark-text italic">
              {news.excerpt}
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            <p>
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
            <h3 className="text-2xl font-bold text-dark-text pt-4">{t('Key Highlights', 'मुख्य विशेषताएं')}</h3>
            <ul className="list-disc list-inside space-y-2">
              <li>{t('Expansion of educational resources in rural areas', 'ग्रामीण क्षेत्रों में शैक्षिक संसाधनों का विस्तार')}</li>
              <li>{t('Increased community participation in digital literacy', 'डिजिटल साक्षरता में सामुदायिक भागीदारी में वृद्धि')}</li>
              <li>{t('New partnerships with local schools and organizations', 'स्थानीय स्कूलों और संगठनों के साथ नई साझेदारी')}</li>
              <li>{t('Success stories from our scholarship recipients', 'हमारे छात्रवृत्ति प्राप्तकर्ताओं की सफलता की कहानियां')}</li>
            </ul>
            <p>
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
            </p>
          </div>

          <div className="pt-12 border-t border-gray-100 flex flex-wrap justify-between items-center gap-6">
            <div className="flex gap-4">
              <button className="flex items-center gap-2 bg-gray-50 text-dark-text px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-all">
                <Share2 size={20} /> {t('Share', 'साझा करें')}
              </button>
              <button className="flex items-center gap-2 bg-gray-50 text-dark-text px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-all">
                <MessageSquare size={20} /> {t('Comment', 'टिप्पणी')}
              </button>
            </div>
            <Link
              to="/donate"
              className="bg-dvs-orange text-white px-8 py-3 rounded-xl font-bold hover:bg-opacity-90 transition-all shadow-lg shadow-dvs-orange/20"
            >
              {t('Support Our Mission', 'हमारे मिशन का समर्थन करें')}
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
