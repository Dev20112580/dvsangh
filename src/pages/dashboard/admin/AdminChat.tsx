import React, { useState, useEffect, useRef } from 'react';
import { Hash, MessageCircle, Send, Users, Search, MoreVertical, Loader2 } from 'lucide-react';
import { supabase } from '../../../supabase';

export default function AdminChat({ adminLevel }: { adminLevel: string }) {
  const [channels, setChannels] = useState<any[]>([]);
  const [activeChannel, setActiveChannel] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [currentAdmin, setCurrentAdmin] = useState<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (activeChannel) {
      fetchMessages(activeChannel);
      
      // Subscribe to Realtime
      const channel = supabase
        .channel(`room-${activeChannel}`)
        .on('postgres_changes', { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'admin_messages',
          filter: `channel_id=eq.${activeChannel}`
        }, (payload) => {
          setMessages(prev => [...prev, payload.new]);
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [activeChannel]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  async function fetchInitialData() {
    try {
      setLoading(true);
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase.from('admin_users').select('*').eq('id', user.id).single();
        setCurrentAdmin(profile);
      }

      // Fetch Channels
      const { data: chanData } = await supabase
        .from('chat_channels')
        .select('*');
      
      const filtered = (chanData || []).filter(ch => 
        !ch.allowed_roles || ch.allowed_roles.includes(adminLevel)
      );
      
      setChannels(filtered);
      if (filtered.length > 0) setActiveChannel(filtered[0].id);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchMessages(channelId: string) {
    const { data } = await supabase
      .from('admin_messages')
      .select('*')
      .eq('channel_id', channelId)
      .order('created_at', { ascending: true })
      .limit(50);
    setMessages(data || []);
  }

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!newMessage.trim() || !activeChannel || !currentAdmin) return;

    const messageToSend = {
      channel_id: activeChannel,
      sender_id: currentAdmin.id,
      sender_name: currentAdmin.full_name || 'Admin',
      content: newMessage.trim()
    };

    setNewMessage('');
    const { error } = await supabase.from('admin_messages').insert([messageToSend]);
    if (error) alert(error.message);
  }

  const activeChannelName = channels.find(c => c.id === activeChannel)?.name || 'general';

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row h-[600px] overflow-hidden">
      {/* Sidebar Channels */}
      <div className="w-full md:w-64 border-r border-gray-100 flex flex-col">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h4 className="font-bold text-dark-text">Admin Chat</h4>
          <button className="text-gray-400 hover:text-dvs-orange"><Search size={18} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          <p className="text-[10px] font-bold text-medium-gray uppercase px-3 py-2">Channels</p>
          {loading ? (
             <div className="p-4 flex justify-center"><Loader2 size={16} className="animate-spin text-gray-300" /></div>
          ) : channels.map(ch => (
            <button 
              key={ch.id} 
              onClick={() => setActiveChannel(ch.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-colors ${activeChannel === ch.id ? 'bg-orange-50 text-dvs-orange' : 'text-medium-gray hover:bg-gray-50'}`}
            >
              <div className="flex items-center gap-2">
                <Hash size={16} className={activeChannel === ch.id ? 'text-dvs-orange' : 'text-gray-400'} />
                {ch.name}
              </div>
            </button>
          ))}
          
          <p className="text-[10px] font-bold text-medium-gray uppercase px-3 py-2 mt-4">Direct Messages</p>
          <div className="px-3 text-[10px] text-gray-400 italic">Coming soon</div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-50/30">
        <div className="p-4 bg-white border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Hash size={20} className="text-dvs-orange" />
            <div>
              <h4 className="font-bold text-dark-text text-sm">#{activeChannelName}</h4>
              <p className="text-[10px] text-green-500 font-bold uppercase">Live Connection Active</p>
            </div>
          </div>
          <button className="text-gray-400 hover:text-dark-text"><MoreVertical size={20} /></button>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map(msg => (
            <div key={msg.id} className={`flex flex-col ${msg.sender_id === currentAdmin?.id ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.sender_id === currentAdmin?.id ? 'bg-dvs-orange text-white rounded-tr-none' : 'bg-white border border-gray-100 text-dark-text rounded-tl-none shadow-sm'}`}>
                {msg.sender_id !== currentAdmin?.id && <p className="text-[10px] font-bold mb-1 opacity-70 uppercase tracking-wider">{msg.sender_name}</p>}
                <p>{msg.content}</p>
              </div>
              <span className="text-[10px] text-medium-gray mt-1 px-1">{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          ))}
        </div>

        <div className="p-4 bg-white border-t border-gray-100">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-2 focus-within:border-dvs-orange transition-colors">
            <input 
              type="text" 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={`Message #${activeChannelName}...`} 
              className="flex-1 bg-transparent text-sm py-2 focus:outline-none"
            />
            <button type="submit" className="text-dvs-orange hover:scale-110 transition-transform"><Send size={20} /></button>
          </form>
        </div>
      </div>
    </div>
  );
}
