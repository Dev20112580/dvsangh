import React from 'react';
import { motion } from 'motion/react';
import { FOCUS_AREAS } from '../constants';
import * as Icons from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Programs() {
  return (
    <div className="pt-32 pb-24">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-dark-text mb-6">Our Programs</h1>
          <p className="body-text text-lg">
            We work across 7 key focus areas to ensure holistic development and quality education for rural students.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-24">
          {FOCUS_AREAS.map((area, idx) => {
            const Icon = (Icons as any)[area.icon];
            return (
              <motion.div
                key={area.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`flex flex-col lg:flex-row items-center gap-16 ${idx % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
              >
                <div className="lg:w-1/2">
                  <div className="relative">
                    <div className="absolute -top-4 -left-4 w-24 h-24 bg-dvs-orange/10 rounded-3xl -z-10" />
                    <img
                      src={`https://picsum.photos/seed/${area.id}/800/600`}
                      alt={area.title}
                      className="rounded-3xl shadow-xl w-full h-[400px] object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
                <div className="lg:w-1/2">
                  <div className="w-16 h-16 bg-dvs-orange/10 text-dvs-orange rounded-2xl flex items-center justify-center mb-8">
                    {Icon && <Icon size={32} />}
                  </div>
                  <Link to={`/programs/${area.id}`}>
                    <h2 className="text-3xl font-bold text-dark-text mb-2 hover:text-dvs-orange transition-colors">{area.title}</h2>
                  </Link>
                  <p className="text-lg text-dvs-orange font-bold mb-6">{area.enTitle}</p>
                  <p className="body-text text-lg mb-10">
                    {area.description}. Our program focuses on providing the necessary resources, coaching, and mentorship to help students achieve their full potential.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Link
                      to={`/programs/${area.id}`}
                      className="bg-dvs-orange text-white px-8 py-3 rounded-xl font-bold hover:bg-opacity-90 transition-all"
                    >
                      Learn More
                    </Link>
                    <Link
                      to="/register"
                      className="bg-gray-100 text-dark-text px-8 py-3 rounded-xl font-bold hover:bg-gray-200 transition-all"
                    >
                      Enroll Now
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="mt-32 py-24 bg-dvs-dark-green text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-8">Ready to make a difference?</h2>
          <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto">
            Whether you are a student, volunteer, or donor, there is a place for you in the DVS community.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link
              to="/register"
              className="bg-dvs-orange text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-opacity-90 transition-all"
            >
              Join as Student
            </Link>
            <Link
              to="/donate"
              className="bg-white text-dvs-dark-green px-10 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all"
            >
              Support a Program
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
