import React from 'react';
import { motion } from 'motion/react';
import { FOCUS_AREAS } from '../constants';
import * as Icons from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FocusAreas() {
  return (
    <section className="py-24 bg-light-gray-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="section-heading mb-4">हमारे कार्यक्षेत्र</h2>
          <p className="body-text max-w-2xl mx-auto">
            Dronacharya Vidyarthi Sangh (DVS) इन 7 प्रमुख क्षेत्रों में ग्रामीण छात्रों के सशक्तिकरण के लिए काम कर रहा है।
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FOCUS_AREAS.map((area, idx) => {
            const Icon = (Icons as any)[area.icon];
            return (
              <motion.div
                key={area.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -8 }}
                className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 group"
              >
                <div className="w-14 h-14 bg-dvs-orange/10 text-dvs-orange rounded-xl flex items-center justify-center mb-6 group-hover:bg-dvs-orange group-hover:text-white transition-colors">
                  {Icon && <Icon size={32} />}
                </div>
                <h3 className="text-xl font-bold text-dark-text mb-2">{area.title}</h3>
                <p className="text-sm text-medium-gray font-medium mb-4">{area.enTitle}</p>
                <p className="body-text text-sm mb-6">{area.description}</p>
                <Link to={`/programs/${area.id}`} className="text-dvs-orange font-bold text-sm flex items-center gap-2 hover:gap-3 transition-all">
                  Learn More <Icons.ArrowRight size={16} />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
