import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import AdminLayout from '../../components/admin/AdminLayout'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/LanguageContext'
import { 
  ShieldCheck, RefreshCw, Upload, AlertTriangle, 
  CheckCircle2, ArrowRightLeft, Landmark
} from 'lucide-react'

export default function BankRecon() {
  const { profile } = useAuth()
  const { t, language } = useLanguage()
  const [loading, setLoading] = useState(false)

  const items = [
    { id: 1, date: '2024-10-20', type: 'Credit', desc: 'Online Donation - Batch #39', internal: 14500, bank: 14500, status: 'matched' },
    { id: 2, date: '2024-10-18', type: 'Debit', desc: 'Scholarship Payout - AD-8901', internal: 5000, bank: 5000, status: 'matched' },
    { id: 3, date: '2024-10-15', type: 'Credit', desc: 'Corporate CSR Grant', internal: 50000, bank: 0, status: 'pending' },
    { id: 4, date: '2024-10-14', type: 'Debit', desc: 'Stationery Purchase', internal: 2450, bank: 2460, status: 'mismatch' },
  ]

  return (
    <AdminLayout title={t("Bank Reconciliation")} adminInfo={profile}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
        <div>
           <h1 className="hindi" style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111', marginBottom: 8 }}>{t('Bank Reconciliation')}</h1>
           <p className="hindi" style={{ color: '#6b7280', fontSize: '0.9rem' }}>{t('Verify internal ledger against bank statements to ensure financial integrity.')}</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
           <button style={{ padding: '10px 16px', borderRadius: 8, border: '1px solid #e2e8f0', background: 'white', display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', fontWeight: 600 }}>
              <Upload size={16} /> {t('Upload Statement')}
           </button>
           <button className="btn btn-primary" onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 2000); }}>
              {loading ? <RefreshCw className="spin" size={18} /> : <ShieldCheck size={18} />} {t('Start Auto-Match')}
           </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, marginBottom: 32 }}>
         <div style={{ background: '#f0fdf4', border: '1px solid #dcfce7', padding: 20, borderRadius: 12 }}>
            <div style={{ color: '#16a34a', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: 4 }}>{t('Matched')}</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#111' }}>84%</div>
         </div>
         <div style={{ background: '#fffbeb', border: '1px solid #fef3c7', padding: 20, borderRadius: 12 }}>
            <div style={{ color: '#d97706', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: 4 }}>{t('Unreconciled')}</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#111' }}>12</div>
         </div>
         <div style={{ background: '#fef2f2', border: '1px solid #fee2e2', padding: 20, borderRadius: 12 }}>
            <div style={{ color: '#dc2626', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: 4 }}>{t('Discrepancies')}</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#111' }}>02</div>
         </div>
      </div>

      <div style={{ background: 'white', borderRadius: 20, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
         <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
               <tr style={{ background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
                  <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>{t('Date')}</th>
                  <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>{t('Description')}</th>
                  <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>{t('Internal Ledger')}</th>
                  <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>{t('Bank Statement')}</th>
                  <th style={{ padding: '16px 24px', textAlign: 'right', fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>{t('Status')}</th>
               </tr>
            </thead>
            <tbody>
               {items.map(m => (
                 <tr key={m.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '16px 24px', fontSize: '0.85rem', color: '#64748b' }}>{m.date}</td>
                    <td style={{ padding: '16px 24px' }}>
                       <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1e293b' }}>{m.desc}</div>
                       <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{m.type}</div>
                    </td>
                    <td style={{ padding: '16px 24px', fontWeight: 800 }}>₹{m.internal.toLocaleString()}</td>
                    <td style={{ padding: '16px 24px', fontWeight: 800, color: m.status === 'pending' ? '#94a3b8' : '#111' }}>₹{m.bank.toLocaleString()}</td>
                    <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                       <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6, fontWeight: 700, fontSize: '0.75rem', color: m.status === 'matched' ? '#16a34a' : m.status === 'mismatch' ? '#dc2626' : '#d97706' }}>
                          {m.status === 'matched' ? <CheckCircle2 size={14} /> : m.status === 'mismatch' ? <AlertTriangle size={14} /> : <RefreshCw size={14} />}
                          {t(m.status.toUpperCase())}
                       </div>
                    </td>
                 </tr>
               ))}
            </tbody>
         </table>
      </div>

      <style>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </AdminLayout>
  )
}
