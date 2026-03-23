/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import GuruBot from './components/GuruBot';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Donate from './pages/Donate';
import Auth from './pages/Auth';
import About from './pages/About';
import Programs from './pages/Programs';
import Contact from './pages/Contact';
import Gallery from './pages/Gallery';
import News from './pages/News';
import Scholarship from './pages/Scholarship';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import DonationSuccess from './pages/DonationSuccess';
import ProgramDetail from './pages/ProgramDetail';
import NewsDetail from './pages/NewsDetail';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';

import { SupabaseProvider } from './SupabaseContext';

export default function App() {
  return (
    <SupabaseProvider>
      <Router>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/programs" element={<Programs />} />
              <Route path="/programs/:id" element={<ProgramDetail />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/news" element={<News />} />
              <Route path="/news/:id" element={<NewsDetail />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/scholarship" element={<Scholarship />} />
              <Route path="/donate" element={<Donate />} />
              <Route path="/donation-success" element={<DonationSuccess />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
          <GuruBot />
        </div>
      </Router>
    </SupabaseProvider>
  );
}
