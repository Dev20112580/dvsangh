import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { AdminLayout } from './Dashboard'
import { 
  Search, Shield, Eye, MoreHorizontal, UserCheck, 
  MapPin, Clock, Filter, AlertCircle, Download,
  UserX, Mail, Building
} from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'

export default function AdminUsers() {
  const { t, language } = useLanguage()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('All')

  async function fetchUsers() {
    const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false }).limit(50)
    setUsers(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchUsers() }, [])

  const filtered = users.filter(u => {
    const matchSearch = !search || u.full_name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase())
    const matchRole = roleFilter === 'All' || u.role === roleFilter.toLowerCase()
    return matchSearch && matchRole
  })

  const handleExport = () => {
    const headers = ['DVS ID', 'Full Name', 'Email', 'Role', 'District', 'Joined Date'];
    const rows = filtered.map(u => [
      u.id,
      u.full_name || 'Incomplete Profile',
      u.email,
      u.role || 'Unassigned',
      u.district || 'Not specified',
      new Date(u.created_at).toLocaleDateString()
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `dvs_users_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const getRoleStyle = (role) => {
    switch(role) {
      case 'student': return { bg: '#fef08a', color: '#854d0e', icon: <UserCheck size={14} />, label: t('Student') } 
      case 'volunteer': return { bg: '#bbf7d0', color: '#166534', icon: <Building size={14} />, label: t('Volunteer') } 
      case 'donor': return { bg: '#ffedd5', color: '#c2410c', icon: <Shield size={14} />, label: t('Donor') } 
      default: return { bg: '#e2e8f0', color: '#475569', icon: <UserCheck size={14} />, label: t(role || 'Unassigned') }
    }
  }

  return (
    <AdminLayout title={t("Identity & Access")}>
      
      {/* Top Action Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
         <div>
            <div className="hindi" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111' }}>{t('User Directory')}</div>
            <div className="hindi" style={{ fontSize: '0.8rem', color: '#64748b', marginTop: 4 }}>{t('Manage')} {users.length} {t('registered accounts and access levels.')}</div>
         </div>
         <div style={{ display: 'flex', gap: 12 }}>
            <button 
              onClick={handleExport}
              className="hindi" 
              style={{ padding: '8px 16px', background: 'white', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: '0.8rem', fontWeight: 600, color: '#475569', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
            >
              <Download size={16} /> {t('Export CSV')}
            </button>
            <button className="hindi" style={{ padding: '8px 16px', background: '#111', border: 'none', borderRadius: 8, fontSize: '0.8rem', fontWeight: 600, color: 'white', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <Shield size={16} /> {t('Access Logs')}
            </button>
         </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Total Users', value: '4,285', color: '#A1401D' },
          { label: 'Active Students', value: '3,102', color: '#854d0e' },
          { label: 'Volunteers', value: '840', color: '#166534' },
          { label: 'Pending Verification', value: '42', color: '#dc2626' }
        ].map((stat, i) => (
          <div key={i} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: 20 }}>
            <div className="hindi" style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>{t(stat.label)}</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: stat.color, marginTop: 8 }}>{stat.value}</div>
          </div>
        ))}
      </div>

      <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        
        {/* Filter Bar */}
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', gap: 16, alignItems: 'center', background: '#f8fafc', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', width: 280 }}>
            <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              className="hindi"
              placeholder={t('Search by name, email...')}
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', padding: '10px 16px 10px 40px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: '0.85rem', outline: 'none' }}
            />
          </div>
          
          <select 
            className="hindi" 
            value={roleFilter} 
            onChange={e => setRoleFilter(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: '0.8rem', background: 'white' }}
          >
            <option value="All">{t('All Roles')}</option>
            <option value="Student">{t('Student')}</option>
            <option value="Volunteer">{t('Volunteer')}</option>
            <option value="Donor">{t('Donor')}</option>
          </select>

          <select 
            className="hindi" 
            style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: '0.8rem', background: 'white' }}
          >
            <option value="">{t('All Districts')}</option>
            {['Ranchi', 'Koderma', 'Hazaribagh', 'Giridih'].map(d => <option key={d} value={d}>{d}</option>)}
          </select>

          <select 
            className="hindi" 
            style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: '0.8rem', background: 'white' }}
          >
            <option value="">{t('All Levels')}</option>
            {['Explorer', 'Leader', 'Guardian'].map(l => <option key={l} value={l}>{t(l)}</option>)}
          </select>

          <div style={{ flex: 1 }}></div>
          
          <button className="hindi" style={{ background: 'transparent', border: 'none', color: '#64748b', display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
             <Filter size={16} /> {t('More Filters')}
          </button>
        </div>

        {/* User Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'white' }}>
                <th className="hindi" style={{ padding: '16px 24px', fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, borderBottom: '1px solid #f1f5f9' }}>{t('User Profile')}</th>
                <th className="hindi" style={{ padding: '16px 24px', fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, borderBottom: '1px solid #f1f5f9' }}>{t('Role / Status')}</th>
                <th className="hindi" style={{ padding: '16px 24px', fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, borderBottom: '1px solid #f1f5f9' }}>{t('Location')}</th>
                <th className="hindi" style={{ padding: '16px 24px', fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, borderBottom: '1px solid #f1f5f9' }}>{t('Joined Date')}</th>
                <th className="hindi" style={{ padding: '16px 24px', fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, borderBottom: '1px solid #f1f5f9' }}>{t('Actions')}</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="hindi" style={{ padding: 40, textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem' }}>{t('Loading identities...')}</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="hindi" style={{ padding: 40, textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem' }}>{t('No users found matching your criteria.')}</td></tr>
              ) : (
                filtered.map(u => {
                  const roleStyle = getRoleStyle(u.role)
                  return (
                    <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9', background: 'white', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'} onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                      <td style={{ padding: '16px 24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                           <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#fff7ed', color: '#A1401D', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem' }}>
                             {u.full_name?.charAt(0) || '?'}
                           </div>
                           <div>
                             <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#111' }}>{u.full_name || t('Incomplete Profile')}</div>
                             <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                               <Mail size={12} /> {u.email}
                             </div>
                           </div>
                        </div>
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                         <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: roleStyle.bg, color: roleStyle.color, padding: '4px 10px', borderRadius: 6, fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                           {roleStyle.icon}
                           {roleStyle.label}
                         </div>
                         <div className="hindi" style={{ fontSize: '0.75rem', color: '#22c55e', display: 'flex', alignItems: 'center', gap: 4, marginTop: 6, fontWeight: 600 }}>
                           <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }}></div>
                           {t('Verified')}
                         </div>
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                         <div className="hindi" style={{ fontSize: '0.8rem', color: '#334155', display: 'flex', alignItems: 'center', gap: 6 }}>
                            <MapPin size={14} color="#94a3b8" />
                            {t(u.district || 'Not specified')}
                         </div>
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                         <div style={{ fontSize: '0.8rem', color: '#334155', display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Clock size={14} color="#94a3b8" />
                            {new Date(u.created_at).toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                         </div>
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                         <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <button style={{ background: 'transparent', border: '1px solid #e2e8f0', borderRadius: 6, padding: 6, color: '#64748b', display: 'flex', cursor: 'pointer' }}><Eye size={16} /></button>
                            <button style={{ background: 'transparent', border: 'none', color: '#cbd5e1', display: 'flex', cursor: 'pointer' }}><MoreHorizontal size={18} /></button>
                         </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */ }
        <div style={{ padding: '16px 24px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white' }}>
          <span className="hindi" style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>{t('Showing')} 1 - {filtered.length} {t('of')} {filtered.length} {t('identities')}</span>
          <div style={{ display: 'flex', gap: 8 }}>
             <button className="hindi" style={{ padding: '6px 14px', background: 'white', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: '0.75rem', fontWeight: 600, color: '#475569', cursor: 'not-allowed', opacity: 0.5 }}>{t('Previous')}</button>
             <button className="hindi" style={{ padding: '6px 14px', background: 'white', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: '0.75rem', fontWeight: 600, color: '#475569', cursor: 'pointer' }}>{t('Next')}</button>
          </div>
        </div>

      </div>
    </AdminLayout>
  )
}
