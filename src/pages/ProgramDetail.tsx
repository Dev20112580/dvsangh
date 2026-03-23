import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, CheckCircle2, Users, Target, Heart } from 'lucide-react';
import { FOCUS_AREAS } from '../constants';

export default function ProgramDetail() {
  const { id } = useParams();
  const program = FOCUS_AREAS.find(p => p.id === id);

  if (!program) {
    return (
      <div className="pt-32 pb-24 text-center">
        <h1 className="text-2xl font-bold mb-4">Program not found</h1>
        <Link to="/programs" className="text-dvs-orange font-bold">Back to Programs</Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/programs" className="inline-flex items-center gap-2 text-medium-gray hover:text-dvs-orange font-bold mb-12 transition-colors">
          <ArrowLeft size={20} /> Back to Programs
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left: Image & Stats */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-[3rem] overflow-hidden shadow-2xl aspect-video"
            >
              <img
                src={program.image}
                alt={program.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </motion.div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <Users className="text-dvs-orange mb-4" size={32} />
                <h4 className="text-2xl font-bold text-dark-text mb-1">1,200+</h4>
                <p className="text-xs text-medium-gray uppercase tracking-wider font-bold">Beneficiaries</p>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <Target className="text-dvs-orange mb-4" size={32} />
                <h4 className="text-2xl font-bold text-dark-text mb-1">50+</h4>
                <p className="text-xs text-medium-gray uppercase tracking-wider font-bold">Villages Covered</p>
              </div>
            </div>
          </div>

          {/* Right: Content */}
          <div className="space-y-10">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-dark-text mb-6">{program.title}</h1>
              <p className="body-text text-lg leading-relaxed">
                {program.description}
              </p>
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-dark-text">Key Objectives</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  'Providing quality study materials',
                  'Ensuring regular attendance',
                  'Community awareness programs',
                  'Skill development workshops',
                  'Mentorship from experts',
                  'Regular assessment and feedback'
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <CheckCircle2 className="text-dvs-orange shrink-0 mt-0.5" size={20} />
                    <span className="text-sm font-medium text-dark-text">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-8 border-t border-gray-100 flex flex-wrap gap-6">
              <Link
                to="/donate"
                className="bg-dvs-orange text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-opacity-90 transition-all shadow-lg shadow-dvs-orange/20 flex items-center gap-2"
              >
                <Heart size={20} /> Support this Program
              </Link>
              <Link
                to="/auth"
                className="bg-dvs-dark-green text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-opacity-90 transition-all flex items-center gap-2"
              >
                <Users size={20} /> Volunteer Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
