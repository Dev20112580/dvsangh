import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import AdminLayout from '../../components/admin/AdminLayout'
import { 
  Activity, Users, Target, Award, TrendingUp, 
  Clock, CheckCircle, BarChart3, Star
} from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'

export default function AdminPerformance() {
  const { t } = useLanguage()
  const [adminStats, setAdminStats] = useState([])
  const [loading, setLoading] = useState(true)
  const [totals, setTotals] = useState({ tasks: 0, avgTime: '4.2h', accuracy: '98%' })

  useEffect(() => {
    fetchPerformanceData()
  }, [])

  async function fetchPerformanceData() {
    setLoading(true)
    try {
      // 1. Fetch all active admins
      const { data: admins } = await supabase
        .from('admin_accounts')
        .select('*, profiles(full_name)')
        .eq('is_active', true)

      // 2. Fetch logs summary for stats
      const { data: logs } = await supabase
        .from('system_logs')
        .select('admin_id, action')
      
      const statsMap = (logs || []).reduce((acc, log) => {
        if (!log.admin_id) return acc
        acc[log.admin_id] = (acc[log.admin_id] || 0) + 1
        return acc
      }, {})

      const processed = (admins || []).map(admin => {
        const count = statsMap[admin.user_id] || 0
        // Calculate a relative score based on task volume (mocking complexity for now)
        const score = Math.min(60 + (count * 2), 99) 
        return {
          id: admin.admin_id,
          name: admin.full_name || admin.profiles?.full_name || 'Admin',
          role: admin.designation || admin.level,
          apps: count,
          speed: count > 10 ? '2.5h' : '5.1h', // Placeholder logic
          accuracy: score > 90 ? '99%' : '95%',  // Placeholder logic
          score: score
        }
      })

      setAdminStats(processed)
      setTotals(prev => ({ ...prev, tasks: (logs || []).length }))
    } catch (err) {
      console.error('Performance fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  const starAdmin = adminStats.length > 0 
    ? [...adminStats].sort((a, b) => b.score - a.score)[0] 
    : { name: 'N/A', role: 'N/A' }

  return (
    <AdminLayout title={t("Admin Performance")}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 className="hindi" style={{ fontSize: '1.5rem', fontWeight: 800 }}>{t('Performance Scorecards')}</h2>
          <p className="hindi" style={{ color: '#64748b', fontSize: '0.9rem' }}>{t('Real-time operational efficiency metrics for the DVS Admin Team.')}</p>
        </div>
        <div style={{ background: 'linear-gradient(135deg, #fefce8 0%, #fef9c3 100%)', border: '1px solid #fde047', borderRadius: 12, padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
           <div style={{ background: '#facc15', color: 'white', padding: 8, borderRadius: '50%' }}><Star size={20} fill="white" /></div>
           <div>
              <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#854d0e', textTransform: 'uppercase' }}>{t('Star of the Week')}</div>
              <div style={{ fontWeight: 800, color: '#111' }}>{starAdmin.name} ({starAdmin.role})</div>
           </div>
        </div>
      </div>

      {/* Summary Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
        {[
          { label: 'Avg. Review Time', value: totals.avgTime, icon: <Clock size={18} />, color: '#3b82f6' },
          { label: 'Total Tasks Done', value: totals.tasks.toLocaleString(), icon: <CheckCircle size={18} />, color: '#10b981' },
          { label: 'Team Accuracy', value: totals.accuracy, icon: <Target size={18} />, color: '#7c3aed' },
          { label: 'System Efficiency', value: '89%', icon: <BarChart3 size={18} />, color: '#f59e0b' }
        ].map((stat, i) => (
          <div key={i} className="card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
               <div style={{ padding: 8, background: '#f8fafc', borderRadius: 8, color: stat.color }}>{stat.icon}</div>
               <span style={{ fontSize: '1.2rem', fontWeight: 800 }}>{stat.value}</span>
            </div>
            <div className="hindi" style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>{t(stat.label)}</div>
          </div>
        ))}
      </div>

      {/* Admin Scorecaras */}
      <div className="card" style={{ padding: 0 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
               <th className="hindi" style={thStyle}>{t('Admin')}</th>
               <th className="hindi" style={thStyle}>{t('Role')}</th>
               <th className="hindi" style={thStyle}>{t('Tasks/Apps')}</th>
               <th className="hindi" style={thStyle}>{t('Avg Speed')}</th>
               <th className="hindi" style={thStyle}>{t('Accuracy')}</th>
               <th className="hindi" style={thStyle}>{t('Overall Score')}</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: 40, color: '#64748b' }}>{t('Calculating efficiency...')}</td></tr>
            ) : adminStats.length === 0 ? (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: 40, color: '#64748b' }}>{t('No activity logs found.')}</td></tr>
            ) : adminStats.map(admin => (
              <tr key={admin.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={tdStyle}>
                   <div style={{ fontWeight: 700 }}>{admin.name}</div>
                   <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{admin.id}</div>
                </td>
                <td style={tdStyle}>{t(admin.role)}</td>
                <td style={tdStyle}>{admin.apps}</td>
                <td style={tdStyle}>{admin.speed}</td>
                <td style={tdStyle}>{admin.accuracy}</td>
                <td style={tdStyle}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ flex: 1, height: 6, background: '#f1f5f9', borderRadius: 3, width: 80 }}>
                         <div style={{ height: '100%', width: `${admin.score}%`, background: admin.score > 90 ? '#10b981' : '#3b82f6', borderRadius: 3 }}></div>
                      </div>
                      <span style={{ fontWeight: 800, fontSize: '0.85rem' }}>{admin.score}</span>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  )
}

const thStyle = { padding: '16px 24px', fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.5 }
const tdStyle = { padding: '16px 24px', fontSize: '0.9rem', color: '#111' }
