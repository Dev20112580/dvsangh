import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { supabase } from '../lib/supabase';

interface Stat {
  label: string;
  hindiLabel: string;
  value: string | number;
}

export default function Stats() {
  const [stats, setStats] = useState<Stat[]>([
    { label: 'Students Impacted', hindiLabel: 'प्रभावित छात्र', value: '1500+' },
    { label: 'Villages Reached', hindiLabel: 'गाँव तक पहुँच', value: '50+' },
    { label: 'Active Volunteers', hindiLabel: 'सक्रिय स्वयंसेवक', value: '200+' },
    { label: 'Scholarships', hindiLabel: 'छात्रवृत्ति', value: '₹5L+' }
  ]);

  useEffect(() => {
    const fetchRealStats = async () => {
      try {
        const [
          { count: studentCount },
          { count: volunteerCount },
          { count: scholarshipCount }
        ] = await Promise.all([
          supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'student'),
          supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'volunteer'),
          supabase.from('scholarships').select('*', { count: 'exact', head: true }).eq('status', 'approved')
        ]);

        setStats([
          { label: 'Students Impacted', hindiLabel: 'प्रभावित छात्र', value: `${(studentCount || 0) + 1200}+` },
          { label: 'Villages Reached', hindiLabel: 'गाँव तक पहुँच', value: '45+' }, // Static village count for now
          { label: 'Active Volunteers', hindiLabel: 'सक्रिय स्वयंसेवक', value: `${(volunteerCount || 0) + 150}+` },
          { label: 'Scholarships Awarded', hindiLabel: 'छात्रवृत्ति', value: `${scholarshipCount || 0}+` }
        ]);
      } catch (err) {
        console.error('Error fetching live stats:', err);
      }
    };
    fetchRealStats();
  }, []);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="text-center p-8 rounded-2xl bg-light-gray-bg border border-gray-100"
            >
              <h3 className="text-3xl md:text-4xl font-bold text-dvs-orange mb-2">{stat.value}</h3>
              <p className="text-dark-text font-semibold mb-1">{stat.label}</p>
              <p className="text-medium-gray text-sm hindi">{stat.hindiLabel}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
