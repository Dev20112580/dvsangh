import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { User, Users, Heart, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function JoinUs() {
  const { t } = useLanguage();
  const roles = [
    {
      id: 'student',
      title: t('Join as a Student', 'छात्र के रूप में जुड़ें'),
      description: t('Access free study resources, apply for scholarships, and join our coaching programs.', 'मुफ्त अध्ययन संसाधन प्राप्त करें, छात्रवृत्ति के लिए आवेदन करें और हमारे कोचिंग कार्यक्रमों में शामिल हों।'),
      icon: User,
      color: 'blue',
      image: '/assets/hero_achievement.png'
    },
    {
      id: 'volunteer',
      title: t('Become a Volunteer', 'स्वयंसेवक बनें'),
      description: t('Help us in our mission to empower rural students. Teach, mentor, or organize events.', 'ग्रामीण छात्रों को सशक्त बनाने के हमारे मिशन में हमारी मदद करें। पढ़ाएं, मार्गदर्शन करें या कार्यक्रम आयोजित करें।'),
      icon: Users,
      color: 'orange',
      image: '/assets/join_volunteer.png'
    },
    {
      id: 'donor',
      title: t('Be a Donor', 'दानदाता बनें'),
      description: t('Support our cause financially and help us reach more students across Jharkhand.', 'वित्तीय रूप से हमारे उद्देश्य का समर्थन करें और झारखंड के अधिक छात्रों तक पहुँचने में हमारी मदद करें।'),
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
            {t('Join the', 'जुड़ें')} <span className="text-dvs-orange">{t('DVS Family', 'DVS परिवार से')}</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="body-text text-lg"
          >
            {t("Whether you are here to learn, to serve, or to support, Dronacharya Vidyarthi Sangh welcomes you. Choose how you'd like to be a part of our mission.", "चाहे आप सीखने के लिए हों, सेवा करने के लिए हों, या समर्थन करने के लिए हों, द्रोणाचार्य विद्यार्थी संघ आपका स्वागत करता है। चुनें कि आप हमारे मिशन का हिस्सा कैसे बनना चाहेंगे।")}
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
                <p className="body-text text-sm mb-8 leading-relaxed">
                  {role.description}
                </p>
                
                <div className="mt-auto flex items-center text-sm font-bold text-dark-text group-hover:text-dvs-orange transition-colors">
                  {t('Get Started', 'शुरू करें')} <ArrowRight size={16} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
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
            {t('Already have an account?', 'क्या आपके पास पहले से एक खाता है?')}
            <Link to="/auth" className="text-dvs-orange font-bold hover:underline ml-2">
              {t('Log in here', 'यहाँ लॉग इन करें')} <ArrowRight size={14} className="inline ml-1" />
            </Link>
          </p>
        </motion.div>

      </div>
    </div>
  );
}
