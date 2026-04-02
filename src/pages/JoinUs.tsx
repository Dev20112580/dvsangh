import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { User, Users, Heart, ArrowRight } from 'lucide-react';

export default function JoinUs() {
  const roles = [
    {
      id: 'student',
      title: 'Join as a Student',
      hindi: 'छात्र के रूप में जुड़ें',
      description: 'Access free study resources, apply for scholarships, and join our coaching programs.',
      icon: User,
      color: 'blue',
      image: '/assets/hero_achievement.png'
    },
    {
      id: 'volunteer',
      title: 'Become a Volunteer',
      hindi: 'स्वयंसेवक बनें',
      description: 'Help us in our mission to empower rural students. Teach, mentor, or organize events.',
      icon: Users,
      color: 'orange',
      image: '/assets/join_volunteer.png'
    },
    {
      id: 'donor',
      title: 'Be a Donor',
      hindi: 'दानदाता बनें',
      description: 'Support our cause financially and help us reach more students across Jharkhand.',
      icon: Heart,
      color: 'green',
      image: '/assets/join_donor.png'
    }
  ];

  const getColorClasses = (color: string) => {
    switch(color) {
      case 'blue': return 'bg-blue-50 text-blue-600 border-blue-100 group-hover:bg-blue-600 group-hover:text-white';
      case 'orange': return 'bg-orange-50 text-orange-600 border-orange-100 group-hover:bg-dvs-orange group-hover:text-white';
      case 'green': return 'bg-green-50 text-green-600 border-green-100 group-hover:bg-green-600 group-hover:text-white';
      default: return 'bg-gray-50 text-gray-600 border-gray-100 group-hover:bg-gray-600 group-hover:text-white';
    }
  };

  return (
    <div className="pt-32 pb-24 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-dark-text mb-6"
          >
            Join the <span className="text-dvs-orange">DVS Family</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="body-text text-lg"
          >
            Whether you are here to learn, to serve, or to support, Dronacharya Vidyarthi Sangh welcomes you. Choose how you'd like to be a part of our mission.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {roles.map((role, idx) => (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (idx + 1) }}
            >
              <Link 
                to="/auth" 
                className="group block h-full bg-white p-8 rounded-3xl border-2 border-transparent hover:border-gray-100 hover:shadow-xl transition-all duration-300"
              >
                <div className="relative mb-8 overflow-hidden rounded-2xl aspect-video">
                  <img
                    src={role.image}
                    alt={role.title}
                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                  />
                  <div className={`absolute top-4 right-4 w-12 h-12 rounded-xl flex items-center justify-center shadow-lg transition-colors duration-300 ${getColorClasses(role.color)}`}>
                    <role.icon size={24} />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-dark-text mb-2 group-hover:text-dvs-orange transition-colors">
                  {role.title}
                </h3>
                <p className="text-sm font-bold text-medium-gray mb-4">
                  {role.hindi}
                </p>
                <p className="body-text text-sm mb-8 leading-relaxed">
                  {role.description}
                </p>
                
                <div className="mt-auto flex items-center text-sm font-bold text-dark-text group-hover:text-dvs-orange transition-colors">
                  Get Started <ArrowRight size={16} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-20 text-center"
        >
          <p className="text-medium-gray text-sm">
            Already have an account?{' '}
            <Link to="/auth" className="text-dvs-orange font-bold hover:underline">
              Log in here <ArrowRight size={14} className="inline" />
            </Link>
          </p>
        </motion.div>

      </div>
    </div>
  );
}
