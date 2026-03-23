import React from 'react';
import { motion } from 'motion/react';
import { Mail, ArrowLeft, Send, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = React.useState('');
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock password reset
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center bg-light-gray-bg p-4">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-12 border border-gray-100">
        <Link to="/auth" className="inline-flex items-center gap-2 text-medium-gray hover:text-dvs-orange font-bold mb-8 transition-colors">
          <ArrowLeft size={20} /> Back to Login
        </Link>

        {!submitted ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl font-bold text-dark-text mb-4">Forgot Password?</h1>
            <p className="body-text mb-8">
              Enter your email address and we'll send you a link to reset your password.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-dark-text mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-medium-gray" size={20} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:border-dvs-orange"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-dvs-orange text-white py-4 rounded-xl font-bold text-lg hover:bg-opacity-90 transition-all shadow-lg shadow-dvs-orange/20 flex items-center justify-center gap-3"
              >
                <Send size={20} /> Send Reset Link
              </button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={40} />
            </div>
            <h2 className="text-2xl font-bold text-dark-text mb-4">Check Your Email</h2>
            <p className="body-text mb-8">
              We've sent a password reset link to <span className="font-bold text-dark-text">{email}</span>. Please check your inbox and follow the instructions.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="text-dvs-orange font-bold hover:underline"
            >
              Didn't receive the email? Try again
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
