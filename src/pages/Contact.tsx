import React from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send, MessageSquare, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Contact() {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message
        });
        
      if (error) throw error;
      
      setIsSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error: any) {
      console.error('Contact Error:', error);
      alert('Failed to send message: ' + (error.message || 'Unknown error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-32 pb-24">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-dark-text mb-6">Contact Us</h1>
          <p className="body-text text-lg">
            Have questions? We're here to help. Reach out to us and we'll get back to you as soon as possible.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <div>
            <div className="space-y-12">
              <div className="flex gap-6">
                <div className="w-14 h-14 bg-dvs-orange/10 text-dvs-orange rounded-2xl flex items-center justify-center shrink-0">
                  <MapPin size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-dark-text mb-2">Our Office</h3>
                  <p className="body-text">Jairuwa Khilkanali, Masalia, Dumka, Jharkhand — 814166</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="w-14 h-14 bg-dvs-orange/10 text-dvs-orange rounded-2xl flex items-center justify-center shrink-0">
                  <Phone size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-dark-text mb-2">Phone</h3>
                  <p className="body-text">+91 9241859951</p>
                  <p className="text-sm text-medium-gray">Available: Mon-Sat, 9 AM - 6 PM</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="w-14 h-14 bg-dvs-orange/10 text-dvs-orange rounded-2xl flex items-center justify-center shrink-0">
                  <Mail size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-dark-text mb-2">Email</h3>
                  <p className="body-text">dvs.ngo.official@gmail.com</p>
                  <p className="text-sm text-medium-gray">We reply within 24 hours</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="w-14 h-14 bg-dvs-orange/10 text-dvs-orange rounded-2xl flex items-center justify-center shrink-0">
                  <MessageSquare size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-dark-text mb-2">WhatsApp</h3>
                  <a 
                    href="https://wa.me/919241859951" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-dvs-orange font-bold hover:underline"
                  >
                    Chat with us on WhatsApp
                  </a>
                </div>
              </div>
            </div>

            {/* Map Placement */}
            <div className="mt-12 rounded-3xl overflow-hidden h-64 bg-gray-200 border border-gray-100">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14612.3789314488!2d87.0!3d24.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjTCsDAwJzAwLjAiTiA4N8KwMDAnMDAuMCJF!5e0!3m2!1sen!2sin!4v1710987654321!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-gray-100">
            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={40} />
                </div>
                <h2 className="text-2xl font-bold text-dark-text mb-4">Message Sent!</h2>
                <p className="body-text mb-8">
                  Thank you for reaching out. We have received your message and will get back to you as soon as possible.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="bg-dvs-orange text-white px-8 py-3 rounded-xl font-bold hover:bg-opacity-90 transition-all"
                >
                  Send Another Message
                </button>
              </motion.div>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-dark-text mb-8">Send us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-dark-text mb-2">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-sm focus:outline-none focus:border-dvs-orange"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-dark-text mb-2">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-sm focus:outline-none focus:border-dvs-orange"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-dark-text mb-2">Subject</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-sm focus:outline-none focus:border-dvs-orange"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-dark-text mb-2">Message</label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-sm focus:outline-none focus:border-dvs-orange resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-dvs-orange text-white py-4 rounded-xl font-bold text-lg hover:bg-opacity-90 transition-all shadow-lg shadow-dvs-orange/20 flex items-center justify-center gap-3 disabled:opacity-50"
              >
                <Send size={20} /> {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  </section>
</div>
  );
}
