import React from 'react';
import { motion } from 'motion/react';
import { useNavigate, Link } from 'react-router-dom';
import { useSupabase } from '../SupabaseContext';
import { supabase } from '../supabase';

import { GraduationCap, CheckCircle2, FileText, Send, AlertCircle } from 'lucide-react';

export default function Scholarship() {
  const { user, isAuthReady } = useSupabase();
  const [step, setStep] = React.useState(1);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [applicationId, setApplicationId] = React.useState('');
  const navigate = useNavigate();

  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    phone: '',
    school: '',
    class: '',
    marks: '',
    income: '',
    reason: ''
  });

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthReady) return;
    if (!user) {
      alert('Please login to apply for scholarship');
      navigate('/auth');
      return;
    }

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.from('scholarship_applications').insert([{
        user_id: user.id,
        full_name: formData.name,
        email: formData.email,
        phone: formData.phone,
        school_name: formData.school,
        current_class: formData.class,
        last_exam_marks: Number(formData.marks) || 0,
        family_income: Number(formData.income) || 0,
        reason: formData.reason,
        status: 'pending' // Note: using default DB val or passing it explicitly
      }]).select();

      if (error) throw error;
      
      if (data && data.length > 0) {
        setApplicationId(data[0].id);
      }
      setStep(4);
      setFormData({
        name: '', email: '', phone: '', school: '', class: '', marks: '', income: '', reason: ''
      });
    } catch (error: any) {
      console.error('Supabase Error: ', error);
      alert('Application failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-32 pb-24">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-dark-text mb-6">DVS Scholarship Program</h1>
          <p className="body-text text-lg">
            Empowering rural students through financial assistance and educational support.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Info Column */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="text-xl font-bold text-dark-text mb-6 flex items-center gap-3">
                <CheckCircle2 className="text-dvs-orange" /> Eligibility Criteria
              </h3>
              <ul className="space-y-4">
                {[
                  'Resident of rural Jharkhand',
                  'Studying in Class 8th to 12th',
                  'Minimum 60% marks in last exam',
                  'Annual family income < ₹1.5 Lakh',
                  'Active participation in DVS programs'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm body-text">
                    <div className="w-1.5 h-1.5 rounded-full bg-dvs-orange mt-1.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-dvs-orange/5 p-8 rounded-3xl border border-dvs-orange/10">
              <h3 className="text-xl font-bold text-dark-text mb-6 flex items-center gap-3">
                <AlertCircle className="text-dvs-orange" /> Required Documents
              </h3>
              <ul className="space-y-4 text-sm body-text">
                <li>• Last year's Marksheet</li>
                <li>• Income Certificate</li>
                <li>• Residential Certificate</li>
                <li>• Aadhar Card</li>
                <li>• Passport size Photo</li>
              </ul>
            </div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-gray-100">
              <div className="flex items-center justify-between mb-12">
                <h2 className="text-2xl font-bold text-dark-text">Scholarship Application</h2>
                <div className="flex gap-2">
                  {[1, 2, 3].map((s) => (
                    <div 
                      key={s} 
                      className={`h-2 w-8 rounded-full transition-all ${step >= s ? 'bg-dvs-orange' : 'bg-gray-100'}`}
                    />
                  ))}
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {step === 1 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-dark-text mb-2">Phone Number</label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-sm focus:outline-none focus:border-dvs-orange"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-dark-text mb-2">School/College Name</label>
                        <input
                          type="text"
                          required
                          value={formData.school}
                          onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-sm focus:outline-none focus:border-dvs-orange"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={nextStep}
                      className="w-full bg-dvs-orange text-white py-4 rounded-xl font-bold text-lg hover:bg-opacity-90 transition-all shadow-lg shadow-dvs-orange/20"
                    >
                      Next Step
                    </button>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-dark-text mb-2">Current Class/Course</label>
                        <input
                          type="text"
                          required
                          value={formData.class}
                          onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-sm focus:outline-none focus:border-dvs-orange"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-dark-text mb-2">Marks in Last Exam (%)</label>
                        <input
                          type="number"
                          required
                          value={formData.marks}
                          onChange={(e) => setFormData({ ...formData, marks: e.target.value })}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-sm focus:outline-none focus:border-dvs-orange"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-dark-text mb-2">Annual Family Income (₹)</label>
                      <input
                        type="number"
                        required
                        value={formData.income}
                        onChange={(e) => setFormData({ ...formData, income: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-sm focus:outline-none focus:border-dvs-orange"
                      />
                    </div>
                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="flex-1 bg-gray-100 text-medium-gray py-4 rounded-xl font-bold text-lg hover:bg-gray-200 transition-all"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={nextStep}
                        className="flex-[2] bg-dvs-orange text-white py-4 rounded-xl font-bold text-lg hover:bg-opacity-90 transition-all shadow-lg shadow-dvs-orange/20"
                      >
                        Next Step
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-dark-text mb-2">Why do you need this scholarship?</label>
                      <textarea
                        required
                        rows={6}
                        value={formData.reason}
                        onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-sm focus:outline-none focus:border-dvs-orange resize-none"
                        placeholder="Tell us about your goals and financial situation..."
                      />
                    </div>
                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="flex-1 bg-gray-100 text-medium-gray py-4 rounded-xl font-bold text-lg hover:bg-gray-200 transition-all"
                      >
                        Back
                      </button>
                      <button
                        disabled={isSubmitting}
                        type="submit"
                        className="flex-[2] bg-dvs-orange text-white py-4 rounded-xl font-bold text-lg hover:bg-opacity-90 transition-all shadow-lg shadow-dvs-orange/20 flex items-center justify-center gap-3 disabled:opacity-50"
                      >
                        {isSubmitting ? 'Submitting...' : <><Send size={20} /> Submit Application</>}
                      </button>
                    </div>
                  </motion.div>
                )}
                {step === 4 && (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 size={40} />
                    </div>
                    <h2 className="text-2xl font-bold text-dark-text mb-4">Application Submitted!</h2>
                    <p className="body-text mb-8">
                      Your scholarship application has been received successfully. Your Application ID is <span className="font-bold text-dvs-orange">{applicationId.split('-')[0]}</span>. Please keep this for future reference.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <button
                        onClick={() => setStep(1)}
                        className="bg-dvs-orange text-white px-8 py-3 rounded-xl font-bold hover:bg-opacity-90 transition-all"
                      >
                        Submit Another Application
                      </button>
                      <Link
                        to="/dashboard"
                        className="bg-white text-dark-text border border-gray-200 px-8 py-3 rounded-xl font-bold hover:bg-gray-50 transition-all text-center"
                      >
                        Go to Dashboard
                      </Link>
                    </div>
                  </motion.div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
