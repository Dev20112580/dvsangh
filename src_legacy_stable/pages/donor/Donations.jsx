import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import { Home, Heart, BarChart2, User, Download, Calendar, CheckCircle } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'
import { jsPDF } from 'jspdf'

export default function DonorDonations() {
  const { user, profile } = useAuth()
  const { t, language } = useLanguage()
  const [donations, setDonations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) fetchDonations()
  }, [user])

  async function fetchDonations() {
    setLoading(true)
    const { data } = await supabase
      .from('donations')
      .select('*')
      .eq('donor_id', user.id)
      .eq('payment_status', 'completed')
      .order('created_at', { ascending: false })
    setDonations(data || [])
    setLoading(false)
  }

  const handleDownload80G = (donation) => {
    const doc = new jsPDF()
    
    // Header
    doc.setFillColor(161, 64, 29) // DVS Orange
    doc.rect(0, 0, 210, 40, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(22)
    doc.text('DRONACHARYA VIDYARTHI SANGH', 105, 20, { align: 'center' })
    doc.setFontSize(10)
    doc.text('Empowering Rural Education Through Community Action', 105, 30, { align: 'center' })

    // Title
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(16)
    doc.text('80G TAX EXEMPTION CERTIFICATE', 105, 60, { align: 'center' })
    
    // Content Box
    doc.setDrawColor(200, 200, 200)
    doc.rect(20, 70, 170, 150)
    
    doc.setFontSize(12)
    doc.text(`Certificate No: DVS/80G/${donation.id.slice(0,8).toUpperCase()}`, 30, 90)
    doc.text(`Date of Issue: ${new Date().toLocaleDateString()}`, 30, 100)
    
    doc.setFont(undefined, 'bold')
    doc.text('DONOR DETAILS:', 30, 120)
    doc.setFont(undefined, 'normal')
    doc.text(`Name: ${profile?.full_name || user.email}`, 30, 130)
    doc.text(`PAN: ${donation.donor_pan || 'XXXXXXXXXX'}`, 30, 140)
    
    doc.setFont(undefined, 'bold')
    doc.text('DONATION DETAILS:', 30, 160)
    doc.setFont(undefined, 'normal')
    doc.text(`Amount: INR ${donation.amount.toLocaleString('en-IN')}`, 30, 170)
    doc.text(`Purpose: ${t(donation.donation_category || 'General Support')}`, 30, 180)
    doc.text(`Date of Donation: ${new Date(donation.created_at).toLocaleDateString()}`, 30, 190)
    
    doc.setFontSize(10)
    doc.setTextColor(100, 100, 100)
    const disclaimer = "This is a computer-generated certificate and does not require a physical signature. Under section 80G of the Income Tax Act, this donation is eligible for tax deduction."
    doc.text(doc.splitTextToSize(disclaimer, 150), 30, 210)
    
    // Footer
    doc.setTextColor(161, 64, 29)
    doc.setFontSize(12)
    doc.text('Thank you for your generous support!', 105, 240, { align: 'center' })
    doc.setFontSize(8)
    doc.text('www.dvs-india.org | contact@dvs-india.org', 105, 250, { align: 'center' })

    doc.save(`80G_Certificate_${donation.id.slice(0,8)}.pdf`)
  }

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <nav className="sidebar-nav" style={{ paddingTop: 24 }}>
          <NavLink to="/dashboard/donor"><Home size={18} /> {t('Dashboard')}</NavLink>
          <NavLink to="/donor/donations"><Heart size={18} /> {t('Donations')}</NavLink>
          <NavLink to="/donor/impact"><BarChart2 size={18} /> {t('Impact')}</NavLink>
          <NavLink to="/donor/profile"><User size={18} /> {t('Profile')}</NavLink>
        </nav>
      </aside>
      <main className="dashboard-content">
        <div className="dashboard-header"><h1 className="hindi">💝 {t('My Donations')}</h1></div>
        {loading ? <div className="skeleton" style={{ height: 200, borderRadius: 'var(--radius-lg)' }} /> : donations.length > 0 ? (
          <div className="table-container">
            <table>
              <thead><tr><th>{t('Receipt')}</th><th>{t('Amount')}</th><th>{t('Category')}</th><th>{t('Status')}</th><th>{t('Date')}</th><th>80G</th></tr></thead>
              <tbody>
                {donations.map(d => (
                  <tr key={d.id}>
                    <td><strong>{d.receipt_number || '-'}</strong></td>
                    <td>₹{d.amount?.toLocaleString(language === 'hi' ? 'hi-IN' : 'en-IN')}</td>
                    <td><span className="badge badge-orange">{t(d.donation_category || 'general')}</span></td>
                    <td><span className={`badge ${d.payment_status === 'completed' ? 'badge-success' : 'badge-warning'}`}>{t(d.payment_status)}</span></td>
                    <td>{new Date(d.created_at).toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN')}</td>
                    <td>{d.certificate_generated ? <button onClick={() => handleDownload80G(d)} className="btn btn-sm btn-secondary"><Download size={12} /> {t('Download')}</button> : <span style={{ color: 'var(--gray-400)', fontSize: '0.8rem' }}>{t('Pending')}</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="card" style={{ textAlign: 'center', padding: 48 }}>
            <Heart size={48} color="var(--gray-300)" style={{ margin: '0 auto' }} />
            <p className="hindi" style={{ marginTop: 12, color: 'var(--gray-500)' }}>{t('Not applied yet')}</p>
            <NavLink to="/donate" className="btn btn-primary mt-2">💝 {t('Donate Now')}</NavLink>
          </div>
        )}
      </main>
    </div>
  )
}
