import React from 'react';
import { motion } from 'motion/react';
import { Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Rahul Kumar',
    role: 'Scholarship Recipient',
    text: 'DVS की छात्रवृत्ति ने मेरी पढ़ाई को जारी रखने में बहुत मदद की। आज मैं अपनी कॉलेज की पढ़ाई पूरी कर पा रहा हूँ।',
    image: 'https://picsum.photos/seed/user1/100/100'
  },
  {
    name: 'Priya Kumari',
    role: 'Digital Literacy Student',
    text: 'कंप्यूटर कोर्स करने के बाद मुझे डिजिटल दुनिया की समझ मिली। अब मैं ऑनलाइन फॉर्म भर सकती हूँ और इंटरनेट का सही उपयोग कर सकती हूँ।',
    image: 'https://picsum.photos/seed/user2/100/100'
  },
  {
    name: 'Amit Pandit',
    role: 'Volunteer',
    text: 'DVS के साथ जुड़कर मुझे समाज के लिए कुछ करने का मौका मिला। ग्रामीण छात्रों की मदद करना एक सुखद अनुभव है।',
    image: 'https://picsum.photos/seed/user3/100/100'
  }
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="section-heading mb-4">What People Say</h2>
          <p className="body-text max-w-2xl mx-auto">
            Real stories of impact and transformation from our community in Jharkhand.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-gray-50 p-8 rounded-[2rem] relative group hover:bg-dvs-orange transition-all duration-500"
            >
              <Quote className="absolute top-6 right-8 text-dvs-orange/20 group-hover:text-white/20 transition-colors" size={48} />
              <div className="relative z-10">
                <p className="body-text mb-8 group-hover:text-white transition-colors italic">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-4">
                  <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full object-cover border-2 border-white" referrerPolicy="no-referrer" />
                  <div>
                    <h4 className="font-bold text-dark-text group-hover:text-white transition-colors">{t.name}</h4>
                    <p className="text-xs text-medium-gray group-hover:text-white/70 transition-colors">{t.role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
