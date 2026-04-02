import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Briefcase, Building2, MapPin, Search, ArrowRight, DollarSign, Loader2, Calendar } from 'lucide-react';
import { supabase } from '../supabase';
import { formatDistanceToNow } from 'date-fns';

export default function Jobs() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');

  useEffect(() => {
    fetchJobs();
  }, [searchQuery, locationQuery]);

  async function fetchJobs() {
    setLoading(true);
    try {
      let query = supabase
        .from('job_postings')
        .select('*')
        .eq('is_active', true)
        .order('posted_at', { ascending: false });

      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,company.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }

      if (locationQuery) {
        query = query.ilike('location', `%${locationQuery}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      setJobs(data || []);
    } catch (err) {
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  }

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
            DVS <span className="text-dvs-dark-green">Job Board</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="body-text text-lg"
          >
            Connecting local talent with local opportunities. Find teaching, technical, and administrative roles across Jharkhand.
          </motion.p>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white p-4 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col md:flex-row gap-4 max-w-5xl mx-auto mb-16 relative z-10">
          <div className="flex-grow relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-medium-gray" size={20} />
            <input 
              type="text" 
              placeholder="Job title or keywords..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-4 py-5 rounded-2xl bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-dvs-dark-green/10 transition-all font-medium"
            />
          </div>
          <div className="hidden md:block w-px h-10 bg-gray-100 self-center" />
          <div className="flex-grow relative">
            <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-medium-gray" size={20} />
            <input 
              type="text" 
              placeholder="All Locations..." 
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
              className="w-full pl-14 pr-4 py-5 rounded-2xl bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-dvs-dark-green/10 transition-all font-medium"
            />
          </div>
          <button className="bg-dvs-dark-green text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-opacity-90 hover:shadow-lg hover:shadow-dvs-dark-green/20 transition-all active:scale-[0.98]">
            Search
          </button>
        </div>

        {/* Job Listings Section */}
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-dark-text">
              Latest Openings <span className="text-medium-gray font-medium text-lg ml-2">({jobs.length})</span>
            </h2>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[3rem] border border-gray-100 shadow-sm">
              <Loader2 size={48} className="text-dvs-dark-green animate-spin mb-4" />
              <p className="text-medium-gray font-bold">Finding matching opportunities...</p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-[3rem] border border-gray-100 shadow-sm px-6">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Briefcase size={40} className="text-gray-200" />
              </div>
              <h3 className="text-xl font-bold text-dark-text mb-2">No jobs found</h3>
              <p className="text-medium-gray max-w-sm mx-auto font-medium">We couldn't find any jobs matching your criteria. Try expanding your search area.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {jobs.map((job, i) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white p-6 md:p-10 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col md:flex-row gap-8 items-start md:items-center justify-between"
                >
                  <div className="flex gap-8 items-start flex-grow">
                    <div className="w-16 h-16 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center shrink-0 shadow-inner group-hover:bg-dvs-dark-green/5 transition-colors">
                      <Building2 size={28} className="text-medium-gray group-hover:text-dvs-dark-green transition-colors" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        <h3 className="text-2xl font-bold text-dark-text group-hover:text-dvs-dark-green transition-colors">{job.title}</h3>
                        <span className={`text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest ${
                          job.type === 'Full-time' ? 'bg-blue-50 text-blue-600' :
                          job.type === 'Part-time' ? 'bg-orange-50 text-orange-600' :
                          job.type === 'Internship' ? 'bg-purple-50 text-purple-600' :
                          'bg-green-50 text-green-600'
                        }`}>
                          {job.type}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-medium-gray font-bold opacity-80">
                        <span className="flex items-center gap-2 text-dark-text"><Briefcase size={16} className="text-dvs-orange" /> {job.company}</span>
                        <span className="flex items-center gap-2"><MapPin size={16} className="text-dvs-orange" /> {job.location}</span>
                        <span className="flex items-center gap-2"><DollarSign size={16} className="text-dvs-orange" /> {job.salary || 'Competitive'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="w-full md:w-auto flex flex-row md:flex-col items-center md:items-end justify-between gap-6 pt-6 md:pt-0 border-t md:border-none border-gray-50">
                    <div className="flex items-center gap-2 text-xs text-medium-gray font-bold">
                      <Calendar size={14} />
                      {formatDistanceToNow(new Date(job.posted_at), { addSuffix: true })}
                    </div>
                    <button className="bg-dvs-orange text-white px-8 py-3.5 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-opacity-90 hover:shadow-lg hover:shadow-dvs-orange/20 transition-all flex items-center gap-3 active:scale-[0.95]">
                      Apply <ArrowRight size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
