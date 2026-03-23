import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Calendar, Share2, MessageSquare } from 'lucide-react';
import { NEWS_ITEMS as STATIC_NEWS } from '../constants';
import { supabase } from '../lib/supabase';

export default function NewsDetail() {
  const { id } = useParams();
  const [news, setNews] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewsDetail = async () => {
      setLoading(true);
      try {
        // Try Supabase first
        const { data, error } = await supabase
          .from('news')
          .select('*')
          .eq('id', id)
          .single();
          
        if (data) {
          setNews(data);
        } else {
          // Fallback to static news
          const staticItem = STATIC_NEWS.find(n => n.id === id);
          setNews(staticItem || null);
        }
      } catch (err) {
        console.error('Error fetching news detail:', err);
        const staticItem = STATIC_NEWS.find(n => n.id === id);
        setNews(staticItem || null);
      } finally {
        setLoading(false);
      }
    };
    fetchNewsDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="pt-32 pb-24 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dvs-orange mx-auto"></div>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="pt-32 pb-24 text-center">
        <h1 className="text-2xl font-bold mb-4 text-dark-text">News not found</h1>
        <Link to="/news" className="text-dvs-orange font-bold hover:underline">Back to News</Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/news" className="inline-flex items-center gap-2 text-medium-gray hover:text-dvs-orange font-bold mb-12 transition-colors">
          <ArrowLeft size={20} /> Back to News
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
                <span>{news.created_at ? new Date(news.created_at).toLocaleDateString() : news.date}</span>
              </div>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-dark-text leading-tight">
              {news.title}
            </h1>
          </div>

          <div className="rounded-[2.5rem] overflow-hidden shadow-2xl aspect-video">
            <img
              src={news.image_url || news.image || 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&q=80'}
              alt={news.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="prose prose-lg max-w-none body-text leading-relaxed space-y-6">
            {news.content ? (
               <div className="whitespace-pre-wrap">{news.content}</div>
            ) : (
              <>
                <p className="text-xl font-medium text-dark-text italic">
                  {news.excerpt}
                </p>
                <p>
                  Dronacharya Vidyarthi Sangh (DVS) continues to make significant strides in rural education through its innovative programs and community-driven initiatives. This update highlights our recent efforts to bridge the digital divide and provide quality educational opportunities to students in remote areas of Jharkhand.
                </p>
                <h3 className="text-2xl font-bold text-dark-text pt-4">Community Impact</h3>
                <p>
                  Our volunteers have been working tirelessly on the ground, engaging with parents and local leaders to ensure that every child has access to the tools they need to succeed in the modern world.
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Successful implementation of digital literacy workshops</li>
                  <li>Distribution of scholarship funds to deserving students</li>
                  <li>Inauguration of new rural study centers</li>
                  <li>Community-led sports and cultural events</li>
                </ul>
              </>
            )}
          </div>

          <div className="pt-12 border-t border-gray-100 flex flex-wrap justify-between items-center gap-6">
            <div className="flex gap-4">
              <button 
                onClick={() => alert('Sharing functionality coming soon!')}
                className="flex items-center gap-2 bg-gray-50 text-dark-text px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-all"
              >
                <Share2 size={20} /> Share
              </button>
              <button 
                onClick={() => alert('Commenting functionality coming soon!')}
                className="flex items-center gap-2 bg-gray-50 text-dark-text px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-all"
              >
                <MessageSquare size={20} /> Comment
              </button>
            </div>
            <Link
              to="/donate"
              className="bg-dvs-orange text-white px-8 py-3 rounded-xl font-bold hover:bg-opacity-90 transition-all shadow-lg shadow-dvs-orange/20"
            >
              Support Our Mission
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
