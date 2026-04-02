import React from 'react';
import { motion } from 'motion/react';
import { Target, Eye, Heart, Users, Award } from 'lucide-react';

export default function About() {
  return (
    <div className="pt-32 pb-24">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-dark-text mb-6">About Us</h1>
          <p className="body-text text-lg">
            Dronacharya Vidyarthi Sangh (DVS) is a registered NGO dedicated to empowering rural students in Jharkhand through education, digital literacy, and holistic development.
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
                <h3 className="font-bold text-dark-text">Shri Sumit Kumar Pandit</h3>
                <p className="text-sm text-dvs-orange font-bold">Founder & President</p>
              </div>
            </div>
            <div>
              <h2 className="section-heading mb-6">Founder's Message</h2>
              <div className="space-y-6 body-text">
                <p>
                  "Har rural student ko scholarship, digital literacy, aur free coaching milni chahiye. DVS ka platform yeh kaam 24/7 karta hai — students, volunteers, donors, aur admin team ke liye."
                </p>
                <p>
                  Our mission is to bridge the digital and educational divide in rural Jharkhand. We believe that every child, regardless of their background, deserves the opportunity to excel and contribute to society.
                </p>
                <p>
                  Through DVS, we are creating a community where knowledge is accessible, talent is nurtured, and dreams are realized.
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
            <h2 className="text-3xl font-bold text-dark-text mb-6">Our Vision</h2>
            <p className="body-text">
              To build the most trusted, accessible, and impactful digital platform for rural education in Jharkhand — where every tribal child finds a scholarship, every aspirant gets free coaching, every donor sees real impact, and every volunteer's contribution is celebrated.
            </p>
          </div>
          <div className="bg-dvs-dark-green/5 p-12 rounded-[2.5rem] border border-dvs-dark-green/10">
            <div className="w-16 h-16 bg-dvs-dark-green text-white rounded-2xl flex items-center justify-center mb-8">
              <Target size={32} />
            </div>
            <h2 className="text-3xl font-bold text-dark-text mb-6">Our Mission</h2>
            <p className="body-text">
              To provide quality education, digital literacy, and holistic empowerment to rural, tribal, and economically weak students through innovative programs and community engagement.
            </p>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="section-heading mb-16">Our Leadership Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: 'Prashant', role: 'VP & Secretary', img: 'team4' },
              { name: 'Madhu', role: 'Vice President', img: 'team1' },
              { name: 'Rita', role: 'Vice President', img: 'rita' },
              { name: 'Vijay', role: 'Treasurer', img: 'team3' },
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
