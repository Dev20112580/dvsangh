import { useEffect, useState, useRef } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import { AdminLayout } from './Dashboard'
import { 
  Send, Search, User, Clock, Plus, Hash, Lock, 
  Bell, MoreHorizontal, Phone, Video, Mail, 
  FileText, List, Smile, AtSign, Image as ImageIcon,
  Paperclip, ChevronDown, Download, X
} from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'

export default function AdminChat() {
  const { t, language } = useLanguage()
  const { user, profile } = useAuth()
  const [adminInfo, setAdminInfo] = useState(null)
  const [activeChannel, setActiveChannel] = useState('admin-team')
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const scrollRef = useRef(null)

  useEffect(() => {
    if (user) {
      supabase.from('admin_accounts').select('*').eq('user_id', user.id).single()
        .then(({ data }) => setAdminInfo(data))
    }
  }, [user])

  useEffect(() => {
    fetchMessages()
    
    // Subscribe to realtime updates
    const channel = supabase
      .channel('admin_chat')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'admin_messages',
        filter: `channel=eq.${activeChannel}`
      }, payload => {
        setMessages(prev => [...prev, payload.new])
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [activeChannel])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  async function fetchMessages() {
    setLoading(true)
    const { data } = await supabase
      .from('admin_messages')
      .select('*')
      .eq('channel', activeChannel)
      .order('created_at', { ascending: true })
      .limit(50)
    
    setMessages(data || [])
    setLoading(false)
  }

  async function handleSendMessage(e) {
    if (e) e.preventDefault()
    if (!message.trim() || !user) return

    const newMessage = {
      channel: activeChannel,
      sender_id: user.id,
      sender_name: profile?.full_name || user.email.split('@')[0],
      content: message
    }

    setMessage('')
    const { error } = await supabase.from('admin_messages').insert([newMessage])
    if (error) alert(error.message)
  }

  const channels = [
    { id: 'admin-team', name: 'admin-team', color: '#1d4ed8' },
    { id: 'scholarships', name: 'scholarships', color: '#dc2626' },
    { id: 'finance', name: 'finance', locked: !['L1', 'L3b'].includes(adminInfo?.level) },
    { id: 'events', name: 'events', color: '#7c3aed' },
    { id: 'urgent-alerts', name: 'urgent-alerts', color: '#dc2626' },
  ]

  return (
    <AdminLayout title={t("Messages")} adminInfo={adminInfo}>
      <div style={{ height: 'calc(100vh - 120px)', display: 'flex', background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        
        {/* Left: Channels */}
        <div style={{ width: 260, borderRight: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '24px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="hindi" style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', letterSpacing: 1, textTransform: 'uppercase' }}>{t('Channels')}</span>
            <Plus size={16} color="#64748b" style={{ cursor: 'pointer' }} />
          </div>
          <div style={{ padding: '12px 10px', flex: 1, overflowY: 'auto' }}>
            {channels.map(c => (
              <div key={c.id} onClick={() => !c.locked && setActiveChannel(c.id)} style={{ 
                display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, cursor: c.locked ? 'not-allowed' : 'pointer',
                background: c.id === activeChannel ? '#f1f5f9' : 'transparent',
                color: c.id === activeChannel ? '#111' : '#64748b',
                fontWeight: c.id === activeChannel ? 700 : 500,
                fontSize: '0.88rem',
                opacity: c.locked ? 0.5 : 1
              }}>
                {c.locked ? <Lock size={14} /> : <Hash size={16} color={c.color || '#94a3b8'} />}
                <span style={{ flex: 1 }}>{c.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Middle: Chat Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
          {/* Chat Header */}
          <div style={{ height: 64, background: 'white', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
               <Hash size={20} color="#94a3b8" />
               <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>{activeChannel}</h3>
            </div>
            <div style={{ display: 'flex', gap: 18, color: '#64748b' }}>
               <Search size={18} /> <Bell size={18} /> <MoreHorizontal size={18} />
            </div>
          </div>

          {/* Messages List */}
          <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 16 }}>
             {loading ? (
                <div style={{ textAlign: 'center', color: '#94a3b8', padding: 20 }}>{t('Syncing messages...')}</div>
             ) : messages.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#94a3b8', padding: 40 }}>{t('No messages yet. Start the conversation!')}</div>
             ) : messages.map((m) => (
               <div key={m.id} style={{ 
                 alignSelf: m.sender_id === user?.id ? 'flex-end' : 'flex-start',
                 maxWidth: '70%',
                 display: 'flex',
                 flexDirection: 'column',
                 alignItems: m.sender_id === user?.id ? 'flex-end' : 'flex-start'
               }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>{m.sender_name}</span>
                    <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>{new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                 </div>
                 <div style={{ 
                    padding: '12px 16px', borderRadius: 16,
                    background: m.sender_id === user?.id ? '#1d4ed8' : 'white',
                    color: m.sender_id === user?.id ? 'white' : '#1e293b',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                    border: m.sender_id === user?.id ? 'none' : '1px solid #e2e8f0',
                    fontSize: '0.9rem',
                    lineHeight: 1.5
                 }}>
                   {m.content}
                 </div>
               </div>
             ))}
          </div>

          {/* Message Input */}
          <div style={{ padding: '20px 32px 32px' }}>
            <form onSubmit={handleSendMessage} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 16, padding: '12px 16px', display: 'flex', gap: 12, alignItems: 'flex-end', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
              <textarea 
                value={message} 
                onChange={e => setMessage(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
                placeholder={`${t('Message #')}${activeChannel}`}
                style={{ flex: 1, border: 'none', resize: 'none', height: 44, padding: '10px 0', fontSize: '0.9rem', outline: 'none' }}
              />
              <button type="submit" disabled={!message.trim()} style={{ width: 44, height: 44, background: '#1d4ed8', color: 'white', border: 'none', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', opacity: message.trim() ? 1 : 0.5 }}>
                 <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
