import { FileText, Download, Calendar, ShieldCheck, IndianRupee, Sparkles } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'

export default function DonorCertificates() {
  const { t } = useLanguage()

  const receipts = [
    { id: 'TXN-9402', type: 'Tax Receipt', date: '2024-02-10', amount: '₹5,000', fy: '2023-24' },
    { id: 'TXN-8812', type: '80G Certificate', date: '2023-12-25', amount: '₹12,500', fy: '2023-24' },
    { id: 'TXN-7250', type: 'Tax Receipt', date: '2023-08-14', amount: '₹2,500', fy: '2023-24' }
  ]
  const handleDownloadReceipt = (receipt) => {
    const printWindow = window.open('', '_blank');
    const receiptHtml = `
      <html>
        <head>
          <title>DVS 80G Receipt - ${receipt.id}</title>
          <style>
            body { font-family: 'Inter', system-ui, sans-serif; padding: 40px; color: #1e293b; line-height: 1.6; }
            .header { text-align: center; border-bottom: 2px solid #A1401D; padding-bottom: 20px; margin-bottom: 30px; }
            .logo { font-size: 24px; font-weight: 800; color: #A1401D; margin-bottom: 5px; }
            .subtitle { font-size: 14px; color: #64748b; }
            .receipt-title { text-align: center; font-size: 20px; font-weight: 700; margin: 30px 0; text-decoration: underline; }
            .details { margin-bottom: 40px; }
            .row { display: flex; justify-content: space-between; margin-bottom: 15px; border-bottom: 1px solid #f1f5f9; padding-bottom: 5px; }
            .label { font-weight: 600; color: #64748b; }
            .value { font-weight: 700; }
            .footer { margin-top: 60px; font-size: 12px; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; paddingTop: 20px; }
            .signature { margin-top: 80px; display: flex; justify-content: flex-end; }
            .sig-box { border-top: 1px solid #1e293b; width: 200px; text-align: center; padding-top: 5px; font-weight: 700; }
            @media print { .no-print { display: none; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">Dronacharya Vidyarthi Sangh</div>
            <div class="subtitle">Empowering Rural India through Education | Reg No: 1234/2023</div>
            <div class="subtitle">80G Registration: IT/80G/123-ABC/2023</div>
          </div>
          
          <div class="receipt-title">DONATION RECEIPT (UNDER SECTION 80G)</div>
          
          <div class="details">
            <div class="row"><span class="label">Receipt Number:</span> <span class="value">${receipt.id}</span></div>
            <div class="row"><span class="label">Date:</span> <span class="value">${receipt.date}</span></div>
            <div class="row"><span class="label">Received From:</span> <span class="value">DVS Valued Donor</span></div>
            <div class="row"><span class="label">Amount:</span> <span class="value">${receipt.amount}</span></div>
            <div class="row"><span class="label">Financial Year:</span> <span class="value">${receipt.fy}</span></div>
            <div class="row"><span class="label">Mode of Payment:</span> <span class="value">Online Transfer</span></div>
          </div>
          
          <p style="font-size: 14px;">Certified that the donation mentioned above has been received and the same is eligible for deduction under Section 80G of the Income Tax Act, 1961.</p>
          
          <div class="signature">
            <div class="sig-box">Authorized Signatory</div>
          </div>
          
          <div class="footer">
            Dronacharya Vidyarthi Sangh | Ranchi, Jharkhand | www.dvsangh.org
          </div>
          <script>window.print(); setTimeout(() => window.close(), 500);</script>
        </body>
      </html>
    `;
    printWindow.document.write(receiptHtml);
    printWindow.document.close();
  }

  return (
    <div style={{ padding: '32px' }}>
      
      <div style={{ maxWidth: 640, marginBottom: 48 }}>
        <h1 className="hindi" style={{ fontSize: '2.25rem', fontWeight: 800, color: '#111' }}>{t('Donor Certificates')}</h1>
        <p className="hindi" style={{ color: '#64748b', marginTop: 12, fontSize: '1rem' }}>{t('Download 80G tax exemption certificates for your contributions. Your support fuels rural transformation.')}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 320px', gap: 32 }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
           <div style={{ background: '#f8fafc', padding: '16px 24px', borderRadius: 12, border: '1px solid #e2e8f0', display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr 0.5fr', alignItems: 'center', fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>
              <div>{t('Document')}</div>
              <div>{t('Date')}</div>
              <div>{t('Amount')}</div>
              <div>{t('Fiscal Year')}</div>
              <div style={{ textAlign: 'right' }}></div>
           </div>

           {receipts.map(r => (
             <div key={r.id} style={{ background: 'white', padding: '24px', borderRadius: 16, border: '1px solid #f1f5f9', display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr 0.5fr', alignItems: 'center', transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#fcfcfc'}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                   <div style={{ color: r.type.includes('80G') ? '#1d4ed8' : '#10b981' }}><FileText size={20} /></div>
                   <div>
                     <div style={{ fontWeight: 700, color: '#1e293b' }}>{t(r.type)}</div>
                     <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: 2 }}>ID: {r.id}</div>
                   </div>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{r.date}</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#111' }}>{r.amount}</div>
                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{r.fy}</div>
                <div style={{ textAlign: 'right' }}>
                   <button 
                     onClick={() => handleDownloadReceipt(r)}
                     style={{ background: 'none', border: 'none', color: '#1d4ed8', cursor: 'pointer', display: 'flex', justifyContent: 'flex-end' }}
                   >
                     <Download size={18} />
                   </button>
                </div>
             </div>
           ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
           <div style={{ background: '#fffbeb', border: '1px solid #fef3c7', borderRadius: 20, padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                 <div style={{ width: 40, height: 40, background: '#fbbf24', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}><ShieldCheck size={20} /></div>
                 <h3 className="hindi" style={{ fontSize: '1rem', fontWeight: 800, color: '#92400e' }}>{t('Tax Benefits')}</h3>
              </div>
              <p className="hindi" style={{ fontSize: '0.75rem', color: '#b45309', lineHeight: 1.6 }}>{t('As a registered NGO, all donations to DVS are exempt under Section 80G of the Indian Income Tax Act. Save up to 50% on taxable income.')}</p>
           </div>

           <div style={{ background: '#111', borderRadius: 20, padding: 24, color: 'white', textAlign: 'center' }}>
              <IndianRupee size={32} color="#fbbf24" style={{ margin: '0 auto 16px' }} />
              <div style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', opacity: 0.6, marginBottom: 8 }}>{t('Lifetime Contribution')}</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: 20 }}>₹1,45,000</div>
              <button className="hindi" style={{ width: '100%', padding: '12px', borderRadius: 10, background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}>{t('View Detailed Impact')}</button>
           </div>
        </div>

      </div>

    </div>
  )
}
