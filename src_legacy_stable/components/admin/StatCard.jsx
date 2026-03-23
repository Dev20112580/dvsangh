import React from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

export default function StatCard({ icon, label, value, trend, trendUp, bgColor }) {
  return (
    <div style={{ 
      background: 'white', 
      borderRadius: 16, 
      padding: '24px', 
      border: '1px solid #e2e8f0', 
      display: 'flex', 
      flexDirection: 'column', 
      gap: 16,
      transition: 'all 0.3s ease',
      cursor: 'default'
    }}
    onMouseOver={e => e.currentTarget.style.transform = 'translateY(-4px)'}
    onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ 
          width: 48, 
          height: 48, 
          background: bgColor || '#f1f5f9', 
          borderRadius: 12, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}>
          {icon}
        </div>
        {trend && (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 4, 
            fontSize: '0.75rem', 
            fontWeight: 700, 
            color: trendUp ? '#10b981' : '#ef4444',
            background: trendUp ? '#ecfdf5' : '#fef2f2',
            padding: '4px 8px',
            borderRadius: 20
          }}>
            {trendUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {trend}
          </div>
        )}
      </div>
      <div>
        <div className="hindi" style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</div>
        <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1e293b', marginTop: 4 }}>{value}</div>
      </div>
    </div>
  )
}
