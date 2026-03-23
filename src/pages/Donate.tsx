import React from 'react';
import { motion } from 'motion/react';
import { Heart, Shield, CheckCircle, Calculator } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Donate() {
  const [amount, setAmount] = React.useState<number | ''>('');
  const [category, setCategory] = React.useState('General Fund');
  const [frequency, setFrequency] = React.useState('One-time');
  const navigate = useNavigate();

  const quickAmounts = [500, 1000, 2500, 5000, 10000, 25000];

  const handleDonate = async () => {
    if (!amount || Number(amount) < 100) {
      alert('Minimum donation amount is ₹100');
      return;
    }

    try {
      const response = await fetch('/api/donations/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: Number(amount) * 100, currency: 'INR' })
      });
      const order = await response.json();
      
      // Mock Razorpay Success
      alert(`Order ${order.id} created successfully. Redirecting to payment...`);
      setTimeout(() => {
        navigate('/donation-success', { state: { amount, orderId: order.id } });
      }, 1500);
    } catch (error) {
      console.error('Donation Error:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  const taxSaved = amount ? Math.floor(Number(amount) * 0.5 * 0.3) : 0;
  const effectiveCost = amount ? Number(amount) - taxSaved : 0;

  return (
    <div className="pt-32 pb-24 bg-light-gray-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left: Info */}
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-dark-text mb-6">
              आपका एक छोटा सा योगदान <span className="text-dvs-orange">बदलाव ला सकता है</span>
            </h1>
            <p className="body-text text-lg mb-10">
              Dronacharya Vidyarthi Sangh (DVS) को दिया गया आपका दान ग्रामीण छात्रों के लिए छात्रवृत्ति, डिजिटल साक्षरता और गुणवत्तापूर्ण शिक्षा सुनिश्चित करता है।
            </p>

            <div className="space-y-6 mb-12">
              <div className="flex gap-4 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center shrink-0">
                  <Shield size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-dark-text mb-1">80G Tax Exemption</h3>
                  <p className="text-sm text-medium-gray">All donations to DVS are eligible for 50% tax deduction under Section 80G of the Income Tax Act.</p>
                </div>
              </div>
              <div className="flex gap-4 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                  <CheckCircle size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-dark-text mb-1">Secure Payments</h3>
                  <p className="text-sm text-medium-gray">Your transactions are secured with industry-standard encryption via Razorpay.</p>
                </div>
              </div>
            </div>

            <div className="bg-dvs-dark-green p-8 rounded-3xl text-white">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Calculator size={24} className="text-dvs-orange" /> Tax Benefit Calculator
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Donation Amount:</span>
                  <span className="font-bold">₹{amount || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>80G Deduction (50%):</span>
                  <span className="font-bold">₹{amount ? Number(amount) * 0.5 : 0}</span>
                </div>
                <div className="flex justify-between text-green-400">
                  <span>Estimated Tax Saved (30% bracket):</span>
                  <span className="font-bold">₹{taxSaved}</span>
                </div>
                <div className="pt-3 border-t border-white/10 flex justify-between text-lg">
                  <span>Effective Cost to You:</span>
                  <span className="font-bold text-dvs-orange">₹{effectiveCost}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-gray-100">
            <h2 className="text-2xl font-bold text-dark-text mb-8">Donate Now</h2>
            
            <div className="space-y-8">
              {/* Frequency */}
              <div className="flex gap-4 p-1 bg-gray-100 rounded-xl">
                {['One-time', 'Monthly', 'Yearly'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFrequency(f)}
                    className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${frequency === f ? 'bg-white text-dvs-orange shadow-sm' : 'text-medium-gray hover:text-dark-text'}`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              {/* Quick Amounts */}
              <div className="grid grid-cols-3 gap-3">
                {quickAmounts.map((a) => (
                  <button
                    key={a}
                    onClick={() => setAmount(a)}
                    className={`py-3 rounded-xl border-2 font-bold transition-all ${amount === a ? 'border-dvs-orange bg-dvs-orange/5 text-dvs-orange' : 'border-gray-100 hover:border-gray-200 text-medium-gray'}`}
                  >
                    ₹{a}
                  </button>
                ))}
              </div>

              {/* Custom Amount */}
              <div>
                <label className="block text-sm font-bold text-dark-text mb-2">Custom Amount (₹)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="Enter amount"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-lg font-bold focus:outline-none focus:border-dvs-orange"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-bold text-dark-text mb-2">Donation Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-sm font-medium focus:outline-none focus:border-dvs-orange"
                >
                  <option>General Fund</option>
                  <option>Education</option>
                  <option>Girl Education</option>
                  <option>Digital Literacy</option>
                  <option>Sports & Yoga</option>
                </select>
              </div>

              {/* Submit */}
              <button
                onClick={handleDonate}
                className="w-full bg-dvs-orange text-white py-5 rounded-2xl font-bold text-xl hover:bg-opacity-90 transition-all shadow-lg shadow-dvs-orange/20 flex items-center justify-center gap-3"
              >
                <Heart size={24} /> Donate ₹{amount || 0}
              </button>

              <p className="text-center text-xs text-medium-gray">
                By donating, you agree to our Terms and Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
