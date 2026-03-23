import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import AdminLayout from '../../components/admin/AdminLayout'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/LanguageContext'
import { 
  Award, Search, Printer, Download, Plus, Filter,
  FileText, CheckCircle, Clock, Trash2, Eye
} from 'lucide-react'

export default function Certificates() {
  const { profile } = useAuth()
  const { t, language } = useLanguage()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  async function fetchCertificates() {
    setLoading(true)
    const { data: res, error } = await supabase
      .from('certificates')
      .select('*, profiles(full_name, email)')
      .order('issued_at', { ascending: false })

    if (error) console.error('Error fetching certificates:', error)
    else setData(res || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchCertificates()
  }, [])

  const stats = [
    { label: t('Total Issued'), value: data.length, icon: <Award size={20} />, color: '#C94E1A' },
    { label: t('Scholarships'), value: data.filter(c => c.type === 'scholarship').length, icon: <FileText size={20} />, color: '#3B82F6' },
    { label: t('Volunteers'), value: data.filter(c => c.type === 'volunteer').length, icon: <CheckCircle size={20} />, color: '#10B981' },
  ]

  return (
    <AdminLayout title={t("Certificates")} adminInfo={profile}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
        <div>
           <h1 className="hindi" style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111', marginBottom: 8 }}>{t('Certificate Management')}</h1>
           <p className="hindi" style={{ color: '#6b7280', fontSize: '0.9rem' }}>{t('Issue and track achievement certificates for students and volunteers.')}</p>
        </div>
        <button className="btn btn-primary">
           <Plus size={18} /> {t('Issue New Certificate')}
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 20, marginBottom: 32 }}>
         {stats.map((s, i) => (
           <div key={i} style={{ flex: 1, background: 'white', padding: 24, borderRadius: 16, border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 20 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: `${s.color}15`, color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{s.icon}</div>
              <div>
                 <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>{s.label}</div>
                 <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111' }}>{s.value}</div>
              </div>
           </div>
         ))}
      </div>

      {/* Main Container */}
      <div style={{ background: 'white', borderRadius: 20, border: '1px solid #e2e8f0', padding: 24 }}>
         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <div style={{ position: 'relative', width: '300px' }}>
               <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
               <input 
                 placeholder={t('Search by name or number...')} 
                 style={{ width: '100%', padding: '10px 10px 10px 40px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: '0.9rem', outline: 'none' }}
               />
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
               <button style={{ padding: '10px 16px', borderRadius: 8, border: '1px solid #e2e8f0', background: 'white', display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', fontWeight: 600 }}>
                  <Filter size={16} /> {t('Filter')}
               </button>
            </div>
         </div>

         <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
               <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '2px solid #f1f5f9' }}>
                     <th style={{ padding: '16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>{t('Certificate #')}</th>
                     <th style={{ padding: '16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>{t('Recipient')}</th>
                     <th style={{ padding: '16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>{t('Type')}</th>
                     <th style={{ padding: '16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>{t('Issue Date')}</th>
                     <th style={{ padding: '16px', textAlign: 'right', fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>{t('Actions')}</th>
                  </tr>
               </thead>
               <tbody>
                  {loading ? (
                    <tr><td colSpan="5" style={{ padding: 40, textAlign: 'center' }}>{t('Loading...')}</td></tr>
                  ) : data.length === 0 ? (
                    <tr><td colSpan="5" style={{ padding: 40, textAlign: 'center' }}>{t('No certificates found.')}</td></tr>
                  ) : (
                    data.map(item => (
                      <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                         <td style={{ padding: '16px', fontWeight: 700, color: '#C94E1A' }}>{item.certificate_number}</td>
                         <td style={{ padding: '16px' }}>
                            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#111' }}>{item.profiles?.full_name}</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{item.profiles?.email}</div>
                         </td>
                         <td style={{ padding: '16px' }}>
                            <span style={{ padding: '4px 10px', borderRadius: 20, fontSize: '0.7rem', fontWeight: 700, background: '#f8fafc', color: '#475569', textTransform: 'capitalize' }}>{item.type}</span>
                         </td>
                         <td style={{ padding: '16px', fontSize: '0.9rem', color: '#64748b' }}>{new Date(item.issued_at).toLocaleDateString()}</td>
                         <td style={{ padding: '16px', textAlign: 'right' }}>
                            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                               <button style={{ padding: 6, borderRadius: 6, border: 'none', background: '#f1f5f9', color: '#475569', cursor: 'pointer' }}><Eye size={16} /></button>
                               <button style={{ padding: 6, borderRadius: 6, border: 'none', background: '#f1f5f9', color: '#475569', cursor: 'pointer' }}><Download size={16} /></button>
                               <button style={{ padding: 6, borderRadius: 6, border: 'none', background: '#f1f5f9', color: '#991B1B', cursor: 'pointer' }}><Trash2 size={16} /></button>
                            </div>
                         </td>
                      </tr>
                    ))
                  )}
               </tbody>
            </table>
         </div>
      </div>
    </AdminLayout>
  )
}
