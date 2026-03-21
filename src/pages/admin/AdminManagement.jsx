import { useEffect, useState } from 'react'
import { AdminLayout } from './Dashboard'
import { 
  Shield, UserPlus, Key, Mail, Phone, Trash2, 
  Edit, CheckCircle, X, AlertCircle, Save 
} from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'
import { supabase } from '../../lib/supabase'

export default function AdminManagement() {
  const { t } = useLanguage()
  const [admins, setAdmins] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingAdmin, setEditingAdmin] = useState(null)
  
  async function fetchAdmins() {
    setLoading(true)
    const { data, error } = await supabase
      .from('admin_accounts')
      .select('*')
      .order('level', { ascending: true })
    
    if (error) console.error('Fetch error:', error)
    else setAdmins(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchAdmins()
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)

    if (editingAdmin) {
      const { error } = await supabase
        .from('admin_accounts')
        .update({
          full_name: formData.full_name,
          designation: formData.designation,
          level: formData.level,
          is_active: formData.is_active
        })
        .eq('id', editingAdmin.id)
      
      if (error) alert(error.message)
      else {
        setShowModal(false)
        fetchAdmins()
      }
    } else {
      // Calling the NEW 'invite-admin' Edge Function
      const { data, error } = await supabase.functions.invoke('invite-admin', {
        body: formData
      })
      
      if (error || (data && data.error)) {
        alert(error?.message || data?.error)
      } else {
        setShowModal(false)
        fetchAdmins()
        alert(t('Invitation sent successfully!'))
      }
    }
    setLoading(false)
  }

  async function handleDelete(id) {
    if (!confirm(t('Are you sure you want to remove this admin?'))) return
    
    const { error } = await supabase
      .from('admin_accounts')
      .delete()
      .eq('id', id)
    
    if (error) alert(error.message)
    else fetchAdmins()
  }

  const openModal = (admin = null) => {
    if (admin) {
      setEditingAdmin(admin)
      setFormData({
        full_name: admin.full_name,
        designation: admin.designation,
        level: admin.level,
        admin_id: admin.admin_id,
        email: admin.email || '',
        is_active: admin.is_active
      })
    } else {
      setEditingAdmin(null)
      setFormData({
        full_name: '',
        designation: '',
        level: 'L3',
        admin_id: `DVS-A${Math.floor(Math.random() * 900) + 100}`,
        email: '',
        is_active: true
      })
    }
    setShowModal(true)
  }

  const stats = {
    l1: admins.filter(a => a.level === 'L1').length,
    l2: admins.filter(a => a.level === 'L2').length,
    l3: admins.filter(a => a.level?.startsWith('L3')).length
  }

  return (
    <AdminLayout title={t("Admin Hierarchy")}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 className="hindi" style={{ fontSize: '1.5rem', fontWeight: 800 }}>{t('Manage Admin Roles')}</h2>
          <p className="hindi" style={{ color: '#64748b', fontSize: '0.9rem' }}>{t('Founder Control Over All Administrative Accounts')}</p>
        </div>
        <button onClick={() => openModal()} className="btn btn-primary hindi" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <UserPlus size={18} /> {t('Add New Admin')}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 32 }}>
        <div style={{ background: '#eff6ff', borderRadius: 12, padding: 20, border: '1px solid #bfdbfe' }}>
           <div className="hindi" style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1e40af' }}>{t('Level 1: Founder')}</div>
           <div style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: 8 }}>{stats.l1}</div>
        </div>
        <div style={{ background: '#f0fdf4', borderRadius: 12, padding: 20, border: '1px solid #bbf7d0' }}>
           <div className="hindi" style={{ fontSize: '0.75rem', fontWeight: 700, color: '#166534' }}>{t('Level 2: High Access')}</div>
           <div style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: 8 }}>{stats.l2}</div>
        </div>
        <div style={{ background: '#f8fafc', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0' }}>
           <div className="hindi" style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>{t('Level 3: Medium Access')}</div>
           <div style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: 8 }}>{stats.l3}</div>
        </div>
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center' }}>
            <div className="skeleton" style={{ height: 200 }} />
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>{t('Admin Name')}</th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>{t('Admin ID')}</th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>{t('Role')}</th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>{t('Status')}</th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>{t('Actions')}</th>
              </tr>
            </thead>
            <tbody>
              {admins.map(admin => (
                <tr key={admin.id} style={{ borderBottom: '1px solid #f1f5f9', opacity: admin.is_active ? 1 : 0.6 }}>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem' }}>
                        {admin.full_name ? admin.full_name[0] : '?'}
                      </div>
                      <div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{admin.full_name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{admin.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px 24px', fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>{admin.admin_id}</td>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <div style={{ display: 'inline-block', width: 'fit-content', padding: '2px 8px', borderRadius: 4, background: '#e2e8f0', fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase' }}>{admin.level}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{admin.designation}</div>
                    </div>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: admin.is_active ? '#10b981' : '#64748b', fontSize: '0.75rem', fontWeight: 700 }}>
                      {admin.is_active ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                      {admin.is_active ? t('ACTIVE') : t('INACTIVE')}
                    </div>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => openModal(admin)} style={{ padding: 6, border: 'none', background: 'none', color: '#64748b', cursor: 'pointer' }} title={t('Edit')}><Edit size={16} /></button>
                      {admin.level !== 'L1' && (
                        <button onClick={() => handleDelete(admin.id)} style={{ padding: 6, border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer' }} title={t('Delete')}><Trash2 size={16} /></button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
          <div style={{ background: 'white', borderRadius: 16, width: '100%', maxWidth: 500, overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ padding: '24px 32px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <h3 className="hindi" style={{ fontSize: '1.1rem', fontWeight: 800 }}>{editingAdmin ? t('Edit Admin') : t('Add New Admin')}</h3>
               <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSubmit} style={{ padding: 32 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
                <div>
                  <label className="hindi" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', marginBottom: 8 }}>{t('Full Name')}</label>
                  <input required className="form-control" value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} placeholder="e.g. Prashant Kumar" />
                </div>
                <div>
                  <label className="hindi" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', marginBottom: 8 }}>{t('Admin ID')}</label>
                  <input required className="form-control" value={formData.admin_id} readOnly={editingAdmin} onChange={e => setFormData({...formData, admin_id: e.target.value})} />
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label className="hindi" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', marginBottom: 8 }}>{t('Email Address')}</label>
                <input required type="email" className="form-control" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="admin@dvs.ngo" />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
                <div>
                  <label className="hindi" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', marginBottom: 8 }}>{t('Designation')}</label>
                  <input required className="form-control" value={formData.designation} onChange={e => setFormData({...formData, designation: e.target.value})} placeholder="e.g. Vice President" />
                </div>
                <div>
                  <label className="hindi" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', marginBottom: 8 }}>{t('Hierarchy Level')}</label>
                  <select className="form-control" value={formData.level} onChange={e => setFormData({...formData, level: e.target.value})}>
                    <option value="L1">L1 - Founder</option>
                    <option value="L2">L2 - VP/Secretary</option>
                    <option value="L3a">L3a - Assistant Sec</option>
                    <option value="L3b">L3b - Treasurer</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
                <input type="checkbox" id="is_active" checked={formData.is_active} onChange={e => setFormData({...formData, is_active: e.target.checked})} style={{ width: 18, height: 18 }} />
                <label htmlFor="is_active" className="hindi" style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>{t('Account Active')}</label>
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '12px', borderRadius: 8, border: '1px solid #e2e8f0', background: 'white', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer' }}>{t('Cancel')}</button>
                <button type="submit" disabled={loading} style={{ flex: 2, padding: '12px', borderRadius: 8, border: 'none', background: '#A1401D', color: 'white', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  {loading ? t('Saving...') : <><Save size={18} /> {t('Save Admin')}</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
