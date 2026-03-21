import { useEffect, useState, useRef } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import AdminLayout from '../../components/admin/AdminLayout'
import { 
  Send, Search, User, Clock, Plus, Hash, Lock, 
  Bell, MoreHorizontal, Phone, Video, Mail, 
  FileText, List, Smile, AtSign, Image as ImageIcon,
  Paperclip, ChevronDown, Download, X, Menu, MessageSquare
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
  const [showChannels, setShowChannels] = useState(false)
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
    if (error) console.error('Error sending message:', error.message)
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
      <div className="admin-chat-container" style={{ 
        height: 'calc(100vh - 140px)', 
        display: 'flex', 
        background: 'white', 
        borderRadius: 20, 
        border: '1px solid #e2e8f0', 
        overflow: 'hidden',
        position: 'relative'
      }}>
        
        {/* Left: Channels Sidebar */}
        <div className={`chat-sidebar ${showChannels ? 'open' : ''}`} style={{ 
          width: 260, 
          borderRight: '1px solid #f1f5f9', 
          display: 'flex', 
          flexDirection: 'column',
          background: 'white',
          zIndex: 10,
          transition: 'transform 0.3s ease'
        }}>
          <div style={{ padding: '24px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="hindi" style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', letterSpacing: 1, textTransform: 'uppercase' }}>{t('Channels')}</span>
            <button 
              className="mobile-only" 
              onClick={() => setShowChannels(false)}
              style={{ background: 'none', border: 'none', color: 'var(--gray-400)' }}
            >
              <X size={20} />
            </button>
          </div>
          <div style={{ padding: '12px 10px', flex: 1, overflowY: 'auto' }}>
            {channels.map(c => (
              <div 
                key={c.id} 
                onClick={() => {
                  if (!c.locked) {
                    setActiveChannel(c.id)
                    setShowChannels(false)
                  }
                }} 
                style={{ 
                  display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderRadius: 12, cursor: c.locked ? 'not-allowed' : 'pointer',
                  background: c.id === activeChannel ? 'var(--dvs-orange-bg)' : 'transparent',
                  color: c.id === activeChannel ? 'var(--dvs-orange)' : 'var(--gray-600)',
                  fontWeight: c.id === activeChannel ? 700 : 500,
                  fontSize: '0.9rem',
                  opacity: c.locked ? 0.5 : 1,
                  marginBottom: 4,
                  transition: 'all 0.2s'
                }}
              >
                {c.locked ? <Lock size={14} /> : <Hash size={18} color={c.id === activeChannel ? 'var(--dvs-orange)' : '#94a3b8'} />}
                <span style={{ flex: 1 }}>{c.name}</span>
                {c.id === 'urgent-alerts' && <span style={{ width: 8, height: 8, background: 'var(--danger)', borderRadius: '50%' }}></span>}
              </div>
            ))}
          </div>
        </div>

        {/* Middle: Chat Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
          {/* Chat Header */}
          <div style={{ height: 64, background: 'white', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
               <button 
                 className="mobile-only" 
                 onClick={() => setShowChannels(true)}
                 style={{ background: 'none', border: 'none', color: 'var(--gray-500)', padding: 0 }}
               >
                 <Menu size={20} />
               </button>
               <Hash size={20} color="#var(--dvs-orange)" />
               <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>{activeChannel}</h3>
            </div>
            <div style={{ display: 'flex', gap: 16, color: '#64748b' }}>
               <Search size={18} className="mobile-hide" /> 
               <Bell size={18} /> 
               <MoreHorizontal size={18} />
            </div>
          </div>

          {/* Messages List */}
          <div ref={scrollRef} className="messages-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
             {loading ? (
                <div style={{ textAlign: 'center', color: '#94a3b8', padding: 20 }}>{t('Syncing messages...')}</div>
             ) : messages.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#94a3b8', padding: 40, border: '1px dashed #e2e8f0', borderRadius: 16, margin: '20px auto', maxWidth: 300 }}>
                  <MessageSquare size={32} style={{ marginBottom: 12, opacity: 0.3 }} />
                  <div>{t('No messages yet. Start the conversation!')}</div>
                </div>
             ) : messages.map((m) => {
               const isMe = m.sender_id === user?.id
               return (
                <div key={m.id} style={{ 
                  alignSelf: isMe ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: isMe ? 'flex-end' : 'flex-start'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, padding: '0 4px' }}>
                     {!isMe && <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--dvs-orange)' }}>{m.sender_name}</span>}
                     <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>{new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div style={{ 
                     padding: '12px 16px', borderRadius: isMe ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                     background: isMe ? 'var(--dark)' : 'white',
                     color: isMe ? 'white' : '#1e293b',
                     boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
                     border: isMe ? 'none' : '1px solid #e2e8f0',
                     fontSize: '0.92rem',
                     lineHeight: 1.6
                  }}>
                    {m.content}
                  </div>
                </div>
               )
             })}
          </div>

          {/* Message Input */}
          <div style={{ padding: '16px 24px 24px' }}>
            <form onSubmit={handleSendMessage} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 20, padding: '8px 12px', display: 'flex', gap: 12, alignItems: 'flex-end', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
              <button type="button" style={{ background: 'none', border: 'none', color: 'var(--gray-400)', padding: 8 }}><Paperclip size={20} /></button>
              <textarea 
                value={message} 
                onChange={e => setMessage(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
                placeholder={`${t('Message #')}${activeChannel}`}
                style={{ flex: 1, border: 'none', resize: 'none', height: 44, padding: '10px 0', fontSize: '0.95rem', outline: 'none', background: 'none' }}
              />
              <button 
                type="submit" 
                disabled={!message.trim()} 
                style={{ 
                  width: 44, height: 44, 
                  background: message.trim() ? 'var(--dvs-orange)' : 'var(--gray-200)', 
                  color: 'white', border: 'none', borderRadius: 14, 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', 
                  cursor: 'pointer', transition: 'all 0.2s' 
                }}
              >
                 <Send size={18} fill={message.trim() ? 'white' : 'none'} />
              </button>
            </form>
          </div>
        </div>

        <style>{`
          @media (max-width: 768px) {
            .chat-sidebar {
              position: absolute;
              left: 0;
              top: 0;
              bottom: 0;
              transform: translateX(-100%);
              box-shadow: 20px 0 40px rgba(0,0,0,0.1);
            }
            .chat-sidebar.open {
              transform: translateX(0);
            }
            .admin-chat-container {
              height: calc(100vh - 80px) !important;
              border-radius: 0 !important;
              border: none !important;
            }
          }
          .messages-scrollbar::-webkit-scrollbar { width: 4px; }
          .messages-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        `}</style>
      </div>
    </AdminLayout>
  )
}
