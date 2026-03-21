import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Construction } from 'lucide-react';

const AdminPlaceholder = ({ title }) => {
  const { t } = useLanguage();
  return (
    <div style={{ padding: '64px 24px', textAlign: 'center', background: 'white', borderRadius: 24, boxShadow: 'var(--shadow-sm)' }}>
      <div style={{ width: 80, height: 80, background: 'var(--dvs-orange-bg)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: 'var(--dvs-orange)' }}>
        <Construction size={40} />
      </div>
      <h1 className="hindi" style={{ fontSize: '2rem', marginBottom: 16 }}>{t(title)}</h1>
      <p style={{ color: 'var(--gray-500)', maxWidth: 500, margin: '0 auto', lineHeight: 1.6 }}>
        This module is currently being optimized for better performance and security. 
        It will be available in the next system update.
      </p>
      <div style={{ marginTop: 32, fontSize: '0.85rem', color: 'var(--gray-400)', fontWeight: 600 }}>
        प्रशासक ध्यान दें: यह मॉड्यूल अभी निर्माणधीन है।
      </div>
    </div>
  );
};

export default AdminPlaceholder;
