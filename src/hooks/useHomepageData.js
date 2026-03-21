import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export const useHomepageData = () => {
  const [data, setData] = useState({
    stats: [],
    news: [],
    stories: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchAll = async () => {
      try {
        // ALL queries run in PARALLEL
        // NOT one by one — saves 2000ms+
        const [statsRes, newsRes, storiesRes] =
          await Promise.all([
            supabase
              .from('homepage_stats')
              .select(
                'label_hindi,value,icon,sort_order'
              )
              .eq('is_active', true)
              .order('sort_order'),
            
            supabase
              .from('news_articles')
              .select(
                'id,title,title_hindi,' +
                'excerpt,cover_image_url,' +
                'category,published_at'
              )
              .eq('status', 'published')
              .order('published_at', {
                ascending: false
              })
              .limit(3),
            
            supabase
              .from('success_stories')
              .select(
                'id,student_name,village,' +
                'achievement,photo_url,content'
              )
              .eq('approved', true)
              .limit(3)
          ]);

        setData({
          stats: statsRes.data || [],
          news: newsRes.data || [],
          stories: storiesRes.data || [],
          loading: false,
          error: null
        });
      } catch (err) {
        setData(prev => ({
          ...prev,
          loading: false,
          error: err.message
        }));
      }
    };

    fetchAll();
  }, []);

  return data;
};
