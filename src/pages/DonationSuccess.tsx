import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Download, Share2, ArrowRight, Heart } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function DonationSuccess() {
  const location = useLocation();
  const { amount, orderId } = location.state || { amount: 1000, orderId: 'ORD_12345' };

  return (
    <div className="pt-32 pb-24 min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-2xl w-full px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-[3rem] p-12 text-center shadow-2xl border border-gray-100"
        >
          <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 size={48} />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-dark-text mb-4">Thank You for Your Support!</h1>
          <p className="body-text text-lg mb-8">
            Your donation of <span className="text-dvs-orange font-bold">₹{amount}</span> has been received successfully. Your contribution will directly support the education of rural students in Jharkhand.
          </p>

          <div className="bg-gray-50 rounded-2xl p-6 mb-12 text-left space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-medium-gray">Order ID:</span>
              <span className="font-bold text-dark-text">{orderId}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-medium-gray">Date:</span>
              <span className="font-bold text-dark-text">{new Date().toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-medium-gray">Status:</span>
              <span className="text-green-600 font-bold">Success</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
            <button className="flex items-center justify-center gap-2 bg-dvs-dark-green text-white py-4 rounded-xl font-bold hover:bg-opacity-90 transition-all">
              <Download size={20} /> Download Receipt
            </button>
            <button className="flex items-center justify-center gap-2 bg-white border border-gray-200 text-dark-text py-4 rounded-xl font-bold hover:bg-gray-50 transition-all">
              <Share2 size={20} /> Share Impact
            </button>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link to="/" className="text-dvs-orange font-bold flex items-center gap-2 hover:gap-3 transition-all">
              Back to Home <ArrowRight size={20} />
            </Link>
            <Link to="/scholarship" className="text-medium-gray font-bold flex items-center gap-2 hover:text-dark-text transition-all">
              See Who You Helped <Heart size={20} />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
