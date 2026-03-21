import { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAdmin } from '../../context/AdminContext';

export default function AdminNotificationBell() {
  const { admin } = useAdmin();
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!admin) return;
    fetchNotifications();

    // Real-time subscription removed to follow "Keep realtime ONLY in AdminChat" rule
    return () => {};
  }, [admin]);

  const fetchNotifications = async () => {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .or(`admin_id.eq.${admin.id},type.eq.broadcast`)
      .order('created_at', { ascending: false })
      .limit(10);

    if (data) {
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.is_read).length);
    }
  };

  const markAsRead = async (id) => {
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id);
    
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  return (
    <div className="admin-bell-container" style={{ position: 'relative' }}>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="bell-btn"
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, position: 'relative' }}
      >
        <Bell size={20} color="white" />
        {unreadCount > 0 && (
          <span style={{ position: 'absolute', top: 6, right: 6, background: '#EF4444', color: 'white', fontSize: 10, fontWeight: 700, padding: '2px 5px', borderRadius: 10, border: '2px solid #111827' }}>
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="bell-dropdown" style={{ position: 'absolute', top: '100%', right: 0, width: 320, background: 'white', borderRadius: 12, boxShadow: '0 10px 40px rgba(0,0,0,0.2)', zIndex: 1000, marginTop: 12, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F9FAFB' }}>
            <h4 style={{ margin: 0, fontSize: '0.9rem', color: '#111827', fontWeight: 700 }}>Notifications</h4>
            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer' }}><X size={16} /></button>
          </div>
          <div style={{ maxHeight: 360, overflowY: 'auto' }}>
            {notifications.length > 0 ? (
              notifications.map(n => (
                <div 
                  key={n.id} 
                  onClick={() => markAsRead(n.id)}
                  style={{ padding: '12px 20px', borderBottom: '1px solid #F3F4F6', cursor: 'pointer', background: n.is_read ? 'white' : '#FFF7ED', transition: 'all 0.2s' }}
                >
                  <div style={{ fontSize: '0.85rem', fontWeight: n.is_read ? 500 : 700, color: '#111827', marginBottom: 4 }}>{n.title}</div>
                  <div style={{ fontSize: '0.75rem', color: '#6B7280', lineHeight: 1.4 }}>{n.message}</div>
                  <div style={{ fontSize: '0.65rem', color: '#9CA3AF', marginTop: 6 }}>{new Date(n.created_at).toLocaleTimeString()}</div>
                </div>
              ))
            ) : (
              <div style={{ padding: 40, textAlign: 'center', color: '#9CA3AF', fontSize: '0.85rem' }}>No notifications</div>
            )}
          </div>
          <div style={{ padding: 12, textAlign: 'center', background: '#F9FAFB', borderTop: '1px solid #F3F4F6' }}>
            <button style={{ background: 'none', border: 'none', color: '#FF6B35', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer' }}>View All</button>
          </div>
        </div>
      )}
    </div>
  );
}
