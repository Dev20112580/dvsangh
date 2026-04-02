import React from 'react';
import { motion } from 'motion/react';
import { STATS } from '../constants';

export default function Stats() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {STATS.map((stat, idx) => (
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
