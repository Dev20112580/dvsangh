import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Send, User, Bot, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { askGuru } from '../lib/pico';

const SYSTEM_PROMPT = `You are Guru Bot, official AI assistant of Dronacharya Vidyarthi Sangh (DVS) — NGO in Dumka, Jharkhand. You help rural students with scholarships, UPSC/JPSC coaching, digital literacy, sports programs, and volunteering.
Facts: Founder: Sumit Kumar Pandit | Contact: 9241859951 | dvs.ngo.official@gmail.com | Address: Jairuwa Khilkanali, Masalia, Dumka — 814166
Website Sections:
- Home: Overview of DVS
- About: Vision, Mission, Founder's Message
- Programs: 7 focus areas (Education, Girls, Digital, Sports, Competitive Exams, Health, Social)
- Scholarship: Eligibility and Application form
- Gallery: Photos of DVS events
- News: Latest updates and announcements
- Donate: Support DVS with 80G tax benefits
- Contact: Reach out to us
Rules: (1) Match user language Hindi/English (2) Max 2–3 paragraphs (3) TEXT ONLY — no images ever (4) If unsure: tell them to call 9241859951 (5) Be warm and encouraging.`;

export default function GuruBot() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [messages, setMessages] = React.useState<{ role: 'user' | 'bot'; text: string }[]>([
    { role: 'bot', text: 'नमस्ते! मैं गुरु बॉट हूँ। मैं आपकी कैसे मदद कर सकता हूँ? (Hello! I am Guru Bot. How can I help you today?)' }
  ]);
  const [input, setInput] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const botResponse = await askGuru(userMessage);
      setMessages(prev => [...prev, { role: 'bot', text: botResponse }]);
    } catch (error) {
      console.error('Guru Bot Error:', error);
      setMessages(prev => [...prev, { role: 'bot', text: "Something went wrong. Please try again later or call our helpline." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickReplies = [
    { label: '🎓 छात्रवृत्ति', text: 'छात्रवृत्ति के बारे में बताओ — process, eligibility, documents needed' },
    { label: '📚 UPSC Tips', text: 'UPSC ki taiyari ke liye tips do — study plan, resources, strategy' },
    { label: '🤝 Join DVS', text: 'DVS se kaise judein? Volunteer, student, ya donor kaise banein?' },
    { label: '💛 Donate', text: 'Donation kaise karein? Tax benefit kya milega? 80G kya hai?' },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* FAB */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-dvs-orange text-white rounded-full shadow-lg flex items-center justify-center relative group"
      >
        <div className="absolute inset-0 bg-dvs-orange rounded-full animate-ping opacity-20 group-hover:hidden" />
        {isOpen ? <X size={32} /> : <MessageCircle size={32} />}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute bottom-20 right-0 w-[375px] h-[545px] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-gray-100"
          >
            {/* Header */}
            <div className="bg-[#1a1a2e] p-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-dvs-orange rounded-full flex items-center justify-center">
                  <Bot size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Guru Bot</h3>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-[10px] text-white/60">Online • DVS AI</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setMessages([{
                    role: 'bot',
                    text: 'नमस्ते! मैं गुरु बॉट हूँ। मैं आपकी कैसे मदद कर सकता हूँ? (Hello! I am Guru Bot. How can I help you today?)'
                  }])}
                  className="text-white/60 hover:text-white transition-colors"
                  title="Clear Chat"
                >
                  <X size={16} />
                </button>
                <button onClick={() => setIsOpen(false)} className="text-white/60 hover:text-white">
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-light-gray-bg">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${
                    msg.role === 'user' 
                      ? 'bg-dvs-orange text-white rounded-tr-none' 
                      : 'bg-white text-dark-text shadow-sm border border-gray-100 rounded-tl-none'
                  }`}>
                    {msg.role === 'bot' ? (
                      <div className="markdown-body prose prose-sm max-w-none">
                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                      </div>
                    ) : (
                      msg.text
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-gray-100">
                    <Loader2 size={20} className="animate-spin text-dvs-orange" />
                  </div>
                </div>
              )}
            </div>

            {/* Quick Replies */}
            <div className="p-2 bg-white border-t border-gray-100 overflow-x-auto whitespace-nowrap scrollbar-hide">
              <div className="flex gap-2">
                {quickReplies.map((reply) => (
                  <button
                    key={reply.label}
                    onClick={() => {
                      setInput(reply.text);
                      // handleSend(); // We'll let the user see it first
                    }}
                    className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-xs font-semibold text-dark-text hover:bg-dvs-orange hover:text-white hover:border-dvs-orange transition-all"
                  >
                    {reply.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-gray-100 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your message..."
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-dvs-orange"
              />
              <button
                onClick={handleSend}
                disabled={isLoading}
                className="w-10 h-10 bg-dvs-orange text-white rounded-xl flex items-center justify-center hover:bg-opacity-90 transition-all disabled:opacity-50"
              >
                <Send size={20} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
