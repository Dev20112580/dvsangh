import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-light-gray-bg px-4">
      <div className="max-w-md w-full text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8"
        >
          <h1 className="text-9xl font-bold text-dvs-orange opacity-20">404</h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <h2 className="text-3xl font-bold text-dark-text">Page Not Found</h2>
          </div>
        </motion.div>
        <p className="body-text mb-12">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="bg-dvs-orange text-white px-8 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-opacity-90 transition-all"
          >
            <Home size={20} /> Back to Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="bg-white text-dark-text border border-gray-200 px-8 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition-all"
          >
            <ArrowLeft size={20} /> Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
