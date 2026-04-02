import React from 'react';
import { motion } from 'motion/react';
import { Target, Eye, Heart, Users, Award } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function About() {
  const { t } = useLanguage();
  return (
    <div className="pt-32 pb-24">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-dark-text mb-6">{t('About Us', 'हमारे बारे में')}</h1>
          <p className="body-text text-lg">
            {t('Dronacharya Vidyarthi Sangh (DVS) is a registered NGO dedicated to empowering rural students in Jharkhand through education, digital literacy, and holistic development.', 'द्रोणाचार्य विद्यार्थी संघ (DVS) एक पंजीकृत एनजीओ है जो शिक्षा, डिजिटल साक्षरता और समग्र विकास के माध्यम से झारखंड के ग्रामीण छात्रों को सशक्त बनाने के लिए समर्पित है।')}
          </p>
        </div>
      </section>

      {/* Founder Message */}
      <section className="bg-white py-24 mb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-dvs-orange rounded-3xl -z-10" />
              <img
                src="/assets/founder.png"
                alt="Founder"
                className="rounded-3xl shadow-2xl w-full h-[500px] object-cover"
              />
              <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
                <h3 className="font-bold text-dark-text">{t('Shri Sumit Kumar Pandit', 'श्री सुमित कुमार पंडित')}</h3>
                <p className="text-sm text-dvs-orange font-bold">{t('Founder & President', 'संस्थापक एवं अध्यक्ष')}</p>
              </div>
            </div>
            <div>
              <h2 className="section-heading mb-6">{t("Founder's Message", 'संस्थापक का संदेश')}</h2>
              <div className="space-y-6 body-text">
                <p>
                  {t('"Har rural student ko scholarship, digital literacy, aur free coaching milni chahiye. DVS ka platform yeh kaam 24/7 karta hai — students, volunteers, donors, aur admin team ke liye."', '"हर ग्रामीण छात्र को छात्रवृत्ति, डिजिटल साक्षरता और मुफ्त कोचिंग मिलनी चाहिए। DVS का प्लेटफॉर्म यह काम 24/7 करता है - छात्रों, स्वयंसेवकों, दानदाताओं और एडमिन टीम के लिए।"')}
                </p>
                <p>
                  {t('Our mission is to bridge the digital and educational divide in rural Jharkhand. We believe that every child, regardless of their background, deserves the opportunity to excel and contribute to society.', 'हमारा मिशन ग्रामीण झारखंड में डिजिटल और शैक्षिक अंतर को पाटना है। हमारा मानना है कि हर बच्चा, चाहे उसकी पृष्ठभूमि कुछ भी हो, उत्कृष्टता प्राप्त करने और समाज में योगदान करने के अवसर का हकदार है।')}
                </p>
                <p>
                  {t('Through DVS, we are creating a community where knowledge is accessible, talent is nurtured, and dreams are realized.', 'DVS के माध्यम via, हम एक ऐसा समुदाय बना रहे हैं जहाँ ज्ञान सुलभ हो, प्रतिभा को निखारा जाए और सपनों को साकार किया जाए।')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-dvs-orange/5 p-12 rounded-[2.5rem] border border-dvs-orange/10">
            <div className="w-16 h-16 bg-dvs-orange text-white rounded-2xl flex items-center justify-center mb-8">
              <Eye size={32} />
            </div>
            <h2 className="text-3xl font-bold text-dark-text mb-6">{t('Our Vision', 'हमारा दृष्टिकोण')}</h2>
            <p className="body-text">
              {t('To build the most trusted, accessible, and impactful digital platform for rural education in Jharkhand — where every tribal child finds a scholarship, every aspirant gets free coaching, every donor sees real impact, and every volunteer\'s contribution is celebrated.', 'झारखंड में ग्रामीण शिक्षा के लिए सबसे विश्वसनीय, सुलभ और प्रभावशाली डिजिटल प्लेटफॉर्म बनाना - जहाँ हर आदिवासी बच्चे को छात्रवृत्ति मिले, हर आकांक्षी को मुफ्त कोचिंग मिले, हर दानदाता को वास्तविक प्रभाव दिखे, और हर स्वयंसेवक के योगदान का जश्न मनाया जाए।')}
            </p>
          </div>
          <div className="bg-dvs-dark-green/5 p-12 rounded-[2.5rem] border border-dvs-dark-green/10">
            <div className="w-16 h-16 bg-dvs-dark-green text-white rounded-2xl flex items-center justify-center mb-8">
              <Target size={32} />
            </div>
            <h2 className="text-3xl font-bold text-dark-text mb-6">{t('Our Mission', 'हमारा मिशन')}</h2>
            <p className="body-text">
              {t('To provide quality education, digital literacy, and holistic empowerment to rural, tribal, and economically weak students through innovative programs and community engagement.', 'नवोन्मेषी कार्यक्रमों और सामुदायिक सहभागिता के माध्यम से ग्रामीण, आदिवासी और आर्थिक रूप से कमजोर छात्रों को गुणवत्तापूर्ण शिक्षा, डिजिटल साक्षरता और समग्र सशक्तिकरण प्रदान करना।')}
            </p>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="section-heading mb-16">{t('Our Leadership Team', 'हमारी नेतृत्व टीम')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: t('Prashant', 'प्रशांत'), role: t('VP & Secretary', 'वीपी और सचिव'), img: 'team4' },
              { name: t('Madhu', 'मधु'), role: t('Vice President', 'उपाध्यक्ष'), img: 'team1' },
              { name: t('Rita', 'रीता'), role: t('Vice President', 'उपाध्यक्ष'), img: 'rita' },
              { name: t('Vijay', 'विजय'), role: t('Treasurer', 'कोषाध्यक्ष'), img: 'team3' },
            ].map((member, idx) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group"
              >
                <div className="relative mb-6 overflow-hidden rounded-2xl aspect-square">
                  <img
                    src={`/assets/${member.img}.png`}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                  />
                </div>
                <h3 className="font-bold text-dark-text text-lg">{member.name}</h3>
                <p className="text-sm text-medium-gray">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
