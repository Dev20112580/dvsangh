import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import AdminLayout from '../../components/admin/AdminLayout'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/LanguageContext'
import { 
  Plus, Search, Filter, Download, PieChart, 
  DollarSign, ShoppingCart, Wrench, Fuel, Utensils,
  TrendingUp
} from 'lucide-react'

export default function Expenses() {
  const { profile } = useAuth()
  const { t, language } = useLanguage()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  async function fetchExpenses() {
    setLoading(true)
    const { data: res, error } = await supabase
      .from('expenses')
      .select('*')
      .order('date', { ascending: false })

    if (error) console.error('Error fetching expenses:', error)
    else setData(res || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchExpenses()
  }, [])

  const getCategoryIcon = (cat) => {
    switch (cat?.toLowerCase()) {
      case 'travel': return <Fuel size={16} />
      case 'food': return <Utensils size={16} />
      case 'supplies': return <ShoppingCart size={16} />
      case 'maintenance': return <Wrench size={16} />
      default: return <DollarSign size={16} />
    }
  }

  return (
    <AdminLayout title={t("Expenses")} adminInfo={profile}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
        <div>
           <h1 className="hindi" style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111', marginBottom: 8 }}>{t('Operational Expenses')}</h1>
           <p className="hindi" style={{ color: '#6b7280', fontSize: '0.9rem' }}>{t('Track and categorize all NGO operational expenditures.')}</p>
        </div>
        <button className="btn btn-primary">
           <Plus size={18} /> {t('Record New Expense')}
        </button>
      </div>

      {/* Overview Cards */}
      <div style={{ display: 'flex', gap: 20, marginBottom: 32 }}>
         <div style={{ flex: 2, background: 'white', padding: 24, borderRadius: 16, border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 20 }}>{t('Spending by Category')}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
               {['Travel', 'Supplies', 'Food', 'Other'].map((cat, i) => (
                 <div key={i} style={{ padding: 16, background: '#f8fafc', borderRadius: 12, textAlign: 'center' }}>
                    <div style={{ color: '#64748b', marginBottom: 8 }}>{getCategoryIcon(cat)}</div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 4 }}>{t(cat)}</div>
                    <div style={{ fontWeight: 800, color: '#111' }}>₹{data.filter(e => e.category?.toLowerCase() === cat.toLowerCase()).reduce((sum, e) => sum + e.amount, 0).toLocaleString()}</div>
                 </div>
               ))}
            </div>
         </div>
         <div style={{ flex: 1, background: '#111827', padding: 24, borderRadius: 16, color: 'white' }}>
            <PieChart size={24} style={{ marginBottom: 16, opacity: 0.5 }} />
            <div style={{ fontSize: '0.85rem', fontWeight: 600, opacity: 0.7, marginBottom: 4 }}>{t('Total Monthly Outflow')}</div>
            <div style={{ fontSize: '1.85rem', fontWeight: 900 }}>₹{data.reduce((sum, e) => sum + (e.amount || 0), 0).toLocaleString()}</div>
            <div style={{ marginTop: 20, fontSize: '0.8rem', color: '#10B981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
               <TrendingUp size={14} /> +12.5% {t('vs last month')}
            </div>
         </div>
      </div>

      {/* Table Area */}
      <div style={{ background: 'white', borderRadius: 20, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
         <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>{t('Recent Transactions')}</h3>
            <button style={{ padding: '8px 12px', background: 'none', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
               <Download size={14} /> {t('CSV')}
            </button>
         </div>
         <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
               <tr style={{ background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
                  <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>{t('Date')}</th>
                  <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>{t('Description')}</th>
                  <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>{t('Category')}</th>
                  <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>{t('Amount')}</th>
                  <th style={{ padding: '16px 24px', textAlign: 'right', fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>{t('Status')}</th>
               </tr>
            </thead>
            <tbody>
               {loading ? (
                 <tr><td colSpan="5" style={{ padding: 40, textAlign: 'center' }}>{t('Syncing expenses...')}</td></tr>
               ) : data.length === 0 ? (
                 <tr><td colSpan="5" style={{ padding: 40, textAlign: 'center' }}>{t('No expenses recorded this month.')}</td></tr>
               ) : (
                 data.map(item => (
                   <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '16px 24px', fontSize: '0.9rem', color: '#64748b' }}>{new Date(item.date).toLocaleDateString()}</td>
                      <td style={{ padding: '16px 24px', fontWeight: 700, color: '#1e293b' }}>{item.description}</td>
                      <td style={{ padding: '16px 24px' }}>
                         <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', fontWeight: 600, color: '#475569' }}>
                            {getCategoryIcon(item.category)} {t(item.category)}
                         </div>
                      </td>
                      <td style={{ padding: '16px 24px', fontWeight: 800, color: '#991B1B' }}>- ₹{item.amount?.toLocaleString()}</td>
                      <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                         <span style={{ fontSize: '0.7rem', fontWeight: 800, padding: '4px 8px', background: '#f0fdf4', color: '#16a34a', borderRadius: 4 }}>PAID</span>
                      </td>
                   </tr>
                 ))
               )}
            </tbody>
         </table>
      </div>
    </AdminLayout>
  )
}
