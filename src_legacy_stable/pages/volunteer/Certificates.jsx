import { Award, Download, Calendar, CheckCircle, FileText, Sparkles } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'

export default function VolunteerCertificates() {
  const { t } = useLanguage()

  const certificates = [
    { id: 1, title: 'Outstanding Teaching Assistant', type: 'Excellence', date: '2024-02-15', hours: '120' },
    { id: 2, title: 'Quarterly Participation Award', type: 'Participation', date: '2023-12-30', hours: '45' },
    { id: 3, title: 'Rural Outreach Fellowship', type: 'Completion', date: '2023-09-10', hours: '200' }
  ]

  const handleDownloadCertificate = (cert) => {
    const printWindow = window.open('', '_blank');
    const certHtml = `
      <html>
        <head>
          <title>DVS Certificate - ${cert.title}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=Great+Vibes&family=Inter:wght@400;700&display=swap');
            body { padding: 40px; text-align: center; color: #1e293b; background: #f8fafc; }
            .cert-border { border: 20px solid #1e3a8a; padding: 60px; background: white; border-image: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%) 30; position: relative; }
            .cert-content { border: 2px solid #e2e8f0; padding: 40px; position: relative; }
            .header { font-family: 'Cinzel', serif; font-size: 42px; color: #1e3a8a; margin-bottom: 10px; }
            .tagline { font-family: 'Inter', sans-serif; font-size: 14px; letter-spacing: 3px; color: #64748b; text-transform: uppercase; margin-bottom: 40px; }
            .award-text { font-family: 'Inter', sans-serif; font-size: 18px; margin-bottom: 20px; }
            .recipient { font-family: 'Great Vibes', cursive; font-size: 54px; color: #1e293b; margin: 30px 0; border-bottom: 1px solid #e2e8f0; display: inline-block; padding: 0 40px; }
            .certify { font-family: 'Inter', sans-serif; font-size: 18px; margin-bottom: 40px; max-width: 600px; margin-left: auto; margin-right: auto; line-height: 1.6; }
            .achievement { font-family: 'Inter', sans-serif; font-weight: 700; font-size: 24px; color: #1e40af; margin-bottom: 10px; }
            .stats { display: flex; justify-content: center; gap: 40px; margin-top: 50px; }
            .stat-box { text-align: center; }
            .stat-label { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; }
            .stat-value { font-size: 18px; font-weight: 700; color: #1e293b; border-top: 1px solid #e2e8f0; margin-top: 5px; padding-top: 5px; }
            .footer { margin-top: 80px; display: flex; justify-content: space-around; align-items: flex-end; }
            .sig-box { border-top: 1px solid #1e293b; width: 180px; text-align: center; padding-top: 5px; font-size: 14px; font-weight: 700; }
            .seal { width: 100px; height: 100px; background: #fbbf24; border-radius: 50%; display: flex; align-items: center; justifyContent: center; color: white; border: 4px double white; box-shadow: 0 4px 6px rgba(0,0,0,0.1); font-weight: 800; font-size: 12px; transform: rotate(-15deg); }
            @media print { body { background: white; padding: 0; } .cert-border { border-width: 15px; } }
          </style>
        </head>
        <body>
          <div class="cert-border">
            <div class="cert-content">
              <div class="header">CERTIFICATE</div>
              <div class="tagline">OF APPRECIATION & EXCELLENCE</div>
              
              <div class="award-text">THIS CERTIFICATE IS PROUDLY PRESENTED TO</div>
              <div class="recipient">DVS Valued Volunteer</div>
              
              <div class="certify">
                For their outstanding contribution and selfless dedication to the rural education initiatives at <strong>Dronacharya Vidyarthi Sangh</strong>. Your commitment has directly impacted the lives of many aspiring students.
              </div>
              
              <div class="achievement">${cert.title}</div>
              
              <div class="stats">
                <div class="stat-box">
                  <div class="stat-label">Hours Contributed</div>
                  <div class="stat-value">${cert.hours} Hours</div>
                </div>
                <div class="stat-box">
                  <div class="stat-label">Issued On</div>
                  <div class="stat-value">${cert.date}</div>
                </div>
              </div>
              
              <div class="footer">
                <div class="sig-box">Program Director</div>
                <div class="seal">OFFICIAL SEAL</div>
                <div class="sig-box">Chairman, DVS</div>
              </div>
            </div>
          </div>
          <script>window.print(); setTimeout(() => window.close(), 500);</script>
        </body>
      </html>
    `;
    printWindow.document.write(certHtml);
    printWindow.document.close();
  }

  return (
    <div style={{ padding: '32px' }}>
      
      <div style={{ maxWidth: 640, marginBottom: 48 }}>
        <h1 className="hindi" style={{ fontSize: '2.25rem', fontWeight: 800, color: '#111' }}>{t('Volunteer Certificates')}</h1>
        <p className="hindi" style={{ color: '#64748b', marginTop: 12, fontSize: '1rem' }}>{t('Download your participation and appreciation certificates. Your hard work impacts thousands of lives in Jharkhand.')}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 32 }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
           {certificates.map(cert => (
             <div key={cert.id} style={{ background: 'white', borderRadius: 20, border: '1px solid #e2e8f0', padding: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.2s', cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.borderColor = '#1d4ed8'}>
                <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
                   <div style={{ width: 64, height: 64, background: '#eff6ff', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1d4ed8' }}>
                      <Award size={32} />
                   </div>
                   <div>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1e293b' }}>{cert.title}</h3>
                      <div className="hindi" style={{ fontSize: '0.85rem', color: '#64748b', marginTop: 4, display: 'flex', gap: 16 }}>
                         <span>{t('Hours Logged')}: {cert.hours}</span>
                         <span>{t('Issue Date')}: {cert.date}</span>
                      </div>
                   </div>
                </div>
                <button 
                  onClick={() => handleDownloadCertificate(cert)}
                  style={{ padding: '12px 20px', borderRadius: 10, background: '#111', color: 'white', border: 'none', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
                >
                   <Download size={18} /> {t('Download')}
                </button>
             </div>
           ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
           <div style={{ background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)', borderRadius: 24, padding: 32, color: 'white', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'relative', zIndex: 2 }}>
                 <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: 16, letterSpacing: 1 }}>{t('Your Impact')}</div>
                 <div style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: 8 }}>365+</div>
                 <div className="hindi" style={{ fontSize: '0.9rem', opacity: 0.9 }}>{t('Total Hours Dedicated to DVS Cause')}</div>
              </div>
              <Sparkles size={120} style={{ position: 'absolute', right: -20, bottom: -20, opacity: 0.1 }} />
           </div>

           <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 20, padding: 24 }}>
              <h3 className="hindi" style={{ fontSize: '0.9rem', fontWeight: 800, color: '#111', marginBottom: 16 }}>{t('How to verification?')}</h3>
              <p className="hindi" style={{ fontSize: '0.75rem', color: '#64748b', lineHeight: 1.6 }}>{t('Each certificate contains a unique QR code for instant blockchain verification. Employers can scan to verify authenticity.')}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 16, color: '#1d4ed8', fontWeight: 700, fontSize: '0.75rem' }}>
                 <CheckCircle size={14} /> {t('Smart Verified')}
              </div>
           </div>
        </div>

      </div>

    </div>
  )
}
