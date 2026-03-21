import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { AdminLayout } from './Dashboard'
import { History, User, Activity, FileText, Database, Terminal, Clock, Shield, Search } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'

export default function AdminAuditLogs() {
  const { t, language } = useLanguage()
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchLogs() }, [])

  async function fetchLogs() {
    const { data } = await supabase
      .from('system_logs')
      .select('*, profiles(full_name, management_level)')
      .order('created_at', { ascending: false })
      .limit(50)
    setLogs(data || [])
    setLoading(false)
  }

  const getStatusStyle = (action) => {
    if (action.includes('lockdown')) return { bg: '#fee2e2', color: '#dc2626' }
    if (action.includes('rejected')) return { bg: '#fff1f2', color: '#e11d48' }
    if (action.includes('approved')) return { bg: '#f0fdf4', color: '#166534' }
    return { bg: '#f8fafc', color: '#475569' }
  }

  return (
    <AdminLayout title={t("Audit Trail")}>
      <div style={{ marginBottom: 28 }}>
         <h2 className="hindi" style={{ fontSize: '1.5rem', fontWeight: 800 }}>{t('Immutable Logs')}</h2>
         <p className="hindi" style={{ color: '#64748b', fontSize: '0.9rem' }}>{t('7-Year Retained History of Every Administrative Move')}</p>
      </div>

      <div className="card">
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #f1f5f9', background: '#f8fafc', display: 'flex', gap: 12 }}>
           <button className="btn btn-secondary btn-sm hindi">{t('Export PDF')}</button>
           <button className="btn btn-secondary btn-sm hindi">{t('Export Excel')}</button>
           <div style={{ flex: 1 }}></div>
           <div className="hindi" style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Terminal size={14} /> CLI ID: DVS-MGMT-TRAIL
           </div>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'white', borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>{t('TIMESTAMP')}</th>
              <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>{t('ADMIN')}</th>
              <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>{t('ACTION')}</th>
              <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>{t('TARGET')}</th>
              <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>{t('IP ADDRESS')}</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <tr key={log.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '16px 24px', fontSize: '0.8rem', color: '#94a3b8' }}>
                  {new Date(log.created_at).toLocaleString(language === 'hi' ? 'hi-IN' : 'en-IN')}
                </td>
                <td style={{ padding: '16px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#e2e8f0', fontSize: '0.65rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                      {log.profiles?.full_name?.charAt(0) || 'S'}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{log.profiles?.full_name || 'System'}</span>
                      <span style={{ fontSize: '0.65rem', color: '#1d4ed8', fontWeight: 700 }}>{log.profiles?.management_level || 'L1'}</span>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '16px 24px' }}>
                   <span style={{ 
                      padding: '4px 8px', borderRadius: 4, fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase',
                      ...getStatusStyle(log.action)
                   }}>{t(log.action.replace('_', ' '))}</span>
                </td>
                <td style={{ padding: '16px 24px', fontSize: '0.85rem', fontWeight: 500 }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span>{t(log.entity_type)}: {log.entity_id}</span>
                    {log.metadata && (
                      <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 400 }}>
                        {JSON.stringify(log.metadata)}
                      </span>
                    )}
                  </div>
                </td>
                <td style={{ padding: '16px 24px', fontSize: '0.8rem', color: '#94a3b8', fontFamily: 'monospace' }}>
                  {log.metadata?.ip || '103.21.XX.XX'}
                </td>
              </tr>
            ))}
            {logs.length === 0 && !loading && (
              <tr>
                <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                  <History size={48} style={{ opacity: 0.2, marginBottom: 16 }} />
                  <p className="hindi">{t('No audit logs found yet.')}</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  )
}
