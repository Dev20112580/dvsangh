import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import AdminLayout from '../../components/admin/AdminLayout'
import { 
  Zap, Plus, Trash2, Play, Settings, AlertCircle, 
  MessageSquare, Mail, Database, CheckCircle
} from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'

export default function AdminWorkflows() {
  const { t } = useLanguage()
  const [rules, setRules] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRules()
  }, [])

  async function fetchRules() {
    setLoading(true)
    const { data, error } = await supabase
      .from('workflow_rules')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (data) setRules(data)
    setLoading(false)
  }

  const handleToggle = async (id, currentStatus) => {
    const { error } = await supabase
      .from('workflow_rules')
      .update({ is_active: !currentStatus })
      .eq('id', id)
    
    if (!error) fetchRules()
  }

  const handleDelete = async (id) => {
    if (!confirm(t('Are you sure you want to delete this rule?'))) return
    const { error } = await supabase
      .from('workflow_rules')
      .delete()
      .eq('id', id)
    
    if (!error) fetchRules()
  }

  return (
    <AdminLayout title={t("Workflow Engine")}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 className="hindi" style={{ fontSize: '1.5rem', fontWeight: 800 }}>{t('Rule Builder')}</h2>
          <p className="hindi" style={{ color: '#64748b', fontSize: '0.9rem' }}>{t('Automate Repetitive Tasks with IF-THEN Logic')}</p>
        </div>
        <button 
          onClick={() => alert(t('New Rule Creator coming soon in Phase 15'))}
          className="btn btn-primary hindi" 
          style={{ display: 'flex', alignItems: 'center', gap: 8 }}
        >
          <Plus size={18} /> {t('Create New Rule')}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
        {[
          { label: 'Rules Active', value: rules.filter(r => r.is_active).length, icon: <Zap size={18} />, color: '#7c3aed' },
          { label: 'Actions Today', value: rules.reduce((acc, r) => acc + (r.executions_count || 0), 0), icon: <Play size={18} />, color: '#10b981' },
          { label: 'Optimization %', value: '64%', icon: <Settings size={18} />, color: '#3b82f6' },
          { label: 'Errors Logged', value: '0', icon: <AlertCircle size={18} />, color: '#ef4444' }
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

      <div className="card">
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #f1f5f9', background: '#f8fafc', fontWeight: 700 }}>{t('Active Workflow Rules')}</div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
           {loading ? (
             <div style={{ padding: 40, textAlign: 'center', color: '#64748b' }}>{t('Loading rules...')}</div>
           ) : rules.length === 0 ? (
             <div style={{ padding: 40, textAlign: 'center', color: '#64748b' }}>{t('No workflow rules found. Create one to start automating.')}</div>
           ) : rules.map(rule => (
             <div key={rule.id} style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '20px 24px', borderBottom: '1px solid #f1f5f9' }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: rule.is_active ? '#f0fdf4' : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: rule.is_active ? '#10b981' : '#94a3b8' }}>
                   <Zap size={20} />
                </div>
                <div style={{ flex: 1 }}>
                   <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{rule.name}</div>
                   <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 4 }}>
                      <span style={{ fontWeight: 800, color: '#111' }}>IF</span> {JSON.stringify(rule.condition_config)} <span style={{ fontWeight: 800, color: '#111' }}>THEN</span> {JSON.stringify(rule.action_config)}
                   </div>
                </div>
                <div style={{ textAlign: 'center', minWidth: 100 }}>
                   <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{t('Executed')}</div>
                   <div style={{ fontWeight: 800 }}>{rule.executions_count || 0}</div>
                </div>
                <div>
                   <button 
                     onClick={() => handleToggle(rule.id, rule.is_active)}
                     style={{ 
                        padding: '4px 10px', borderRadius: 6, fontSize: '0.65rem', fontWeight: 700, border: 'none', cursor: 'pointer',
                        background: rule.is_active ? '#dcfce7' : '#f1f5f9',
                        color: rule.is_active ? '#166534' : '#475569'
                     }}
                   >
                     {rule.is_active ? t('Active') : t('Inactive')}
                   </button>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                   <button style={{ padding: 6, border: 'none', background: 'none', color: '#64748b', cursor: 'pointer' }}><Play size={16} /></button>
                   <button 
                     onClick={() => handleDelete(rule.id)}
                     style={{ padding: 6, border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer' }}
                   >
                     <Trash2 size={16} />
                   </button>
                </div>
             </div>
           ))}
        </div>
      </div>
    </AdminLayout>
  )
}
