import { useState } from 'react'
import { MessageCircle, X, Send, Sparkles, User, Bot, Award } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import { askGuru } from '../lib/pico'

export default function GuruBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { id: 1, text: 'Namaste! I am DVS Guru. How can I help you today?', sender: 'bot' }
  ])
  const [input, setInput] = useState('')
  const { t } = useLanguage()

  const [isTyping, setIsTyping] = useState(false)
  const [activeFlow, setActiveFlow] = useState(null) // 'eligibility' or 'studyplan'
  const [flowStep, setFlowStep] = useState(0)
  const [formData, setFormData] = useState({})

  const handleSend = async (textInput = input) => {
    if (!textInput.trim()) return
    const userMsgId = Date.now()
    const newMsgs = [...messages, { id: userMsgId, text: textInput, sender: 'user' }]
    setMessages(newMsgs)
    setInput('')
    setIsTyping(true)

    try {
      if (activeFlow === 'eligibility') {
        handleEligibilityFlow(textInput)
        setIsTyping(false)
        return
      }
      if (activeFlow === 'studyplan') {
        handleStudyPlanFlow(textInput)
        setIsTyping(false)
        return
      }

      const lowerInput = textInput.toLowerCase()
      if (lowerInput.includes('eligibility') || lowerInput.includes('scholarship check')) {
        startEligibilityFlow()
        setIsTyping(false)
        return
      }
      if (lowerInput.includes('study plan') || lowerInput.includes('schedule')) {
        startStudyPlanFlow()
        setIsTyping(false)
        return
      }

      const data = await askGuru(textInput)
      if (data.status === 'success') {
        let finalReply = data.text
        setMessages(m => [...m, { id: Date.now() + 2, text: finalReply, sender: 'bot' }])
      } else {
        setMessages(m => [...m, { id: Date.now() + 2, text: 'Namaste! Abhi main thoda busy hoon. Kripya thodi der baad phirse puche.', sender: 'bot' }])
      }
    } catch (err) {
      setMessages(m => [...m, { id: Date.now() + 2, text: 'Connection issue. Please try again.', sender: 'bot' }])
    }
    
    setIsTyping(false)
  }

  const clearChat = () => {
    setMessages([{ id: 1, text: 'Namaste! I am DVS Guru. How can I help you today?', sender: 'bot' }])
    setActiveFlow(null)
    setFlowStep(0)
    setFormData({})
  }

  const startEligibilityFlow = () => {
    setActiveFlow('eligibility')
    setFlowStep(1)
    setMessages(prev => [...prev, { id: Date.now(), text: t('Let\'s check your scholarship eligibility. First, do you live in a rural or urban area?'), sender: 'bot', options: ['Rural', 'Urban'] }])
  }

  const handleEligibilityFlow = (input) => {
    const step = flowStep
    if (step === 1) {
      setFormData({ ...formData, area: input })
      setMessages(prev => [...prev, { id: Date.now(), text: t('What is your family\'s annual income? (in ₹)'), sender: 'bot' }])
      setFlowStep(2)
    } else if (step === 2) {
      setFormData({ ...formData, income: parseInt(input) })
      setMessages(prev => [...prev, { id: Date.now(), text: t('What was your percentage in the last exam?'), sender: 'bot' }])
      setFlowStep(3)
    } else if (step === 3) {
      const percentage = parseFloat(input)
      const income = formData.income
      const isRural = formData.area === 'Rural'
      
      let eligible = false
      if (isRural && income < 250000 && percentage > 60) eligible = true
      if (!isRural && income < 150000 && percentage > 75) eligible = true

      const result = eligible 
        ? t('Congratulations! Based on your details, you are ELIGIBLE for DVS Scholarships. Please apply via the Student Portal.') 
        : t('Hmm, you might not meet the standard criteria right now, but DVS also helps with mentoring. Keep studying hard!')
      
      setMessages(prev => [...prev, { id: Date.now(), text: result, sender: 'bot' }])
      setActiveFlow(null)
    }
  }

  const startStudyPlanFlow = () => {
    setActiveFlow('studyplan')
    setFlowStep(1)
    setMessages(prev => [...prev, { id: Date.now(), text: t('I can help you create a custom study plan. Which exam are you preparing for?'), sender: 'bot', options: ['UPSC', 'JPSC', 'SSC', 'Other'] }])
  }

  const handleStudyPlanFlow = (input) => {
    const step = flowStep
    if (step === 1) {
      setFormData({ ...formData, target: input })
      setMessages(prev => [...prev, { id: Date.now(), text: t('How many hours per day can you dedicate to study?'), sender: 'bot', options: ['2-4h', '4-6h', '8h+'] }])
      setFlowStep(2)
    } else if (step === 2) {
      setFormData({ ...formData, hours: input })
      setMessages(prev => [...prev, { id: Date.now(), text: t('Which subject do you find most difficult?'), sender: 'bot' }])
      setFlowStep(3)
    } else if (step === 3) {
      setMessages(prev => [...prev, { id: Date.now(), text: t('Generating your plan...'), sender: 'bot' }])
      setTimeout(async () => {
        const prompt = `Generate a short ${formData.hours} study plan for ${formData.target} focusing extra on ${input}. Keep it in Hinglish.`
        const data = await askGuru(prompt)
        setMessages(prev => [...prev, { id: Date.now(), text: data.text, sender: 'bot' }])
        setActiveFlow(null)
      }, 1000)
    }
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={!isOpen ? "pulse-animation" : ""}
        style={{
          position: 'fixed', bottom: 30, right: 30, width: 68, height: 68,
          background: 'linear-gradient(135deg, #FF6B35 0%, #E55A25 100%)',
          borderRadius: '24px', color: 'white', border: 'none', cursor: 'pointer',
          boxShadow: '0 12px 30px rgba(255, 107, 53, 0.4)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          transform: isOpen ? 'rotate(90deg) scale(0.9)' : 'scale(1)',
        }}
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={32} />}
      </button>

      {isOpen && (
        <div style={{
          position: 'fixed', bottom: 110, right: 30, width: 380, height: 580,
          background: 'rgba(255, 255, 255, 0.95)', 
          backdropFilter: 'blur(12px)',
          borderRadius: 32, 
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', 
          zIndex: 1000,
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
          animation: 'slideUp 0.4s ease-out'
        }}>
            <div style={{ 
              background: '#0F172A', 
              padding: '28px 24px', 
              color: 'white', 
              borderBottom: '4px solid #FF6B35',
              position: 'relative'
            }}>
               <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                     <div style={{ 
                       width: 48, height: 48, 
                       background: 'linear-gradient(135deg, #FF6B35 0%, #E24A00 100%)', 
                       borderRadius: 16, 
                       display: 'flex', alignItems: 'center', justifyContent: 'center', 
                       boxShadow: '0 8px 16px rgba(255, 107, 53, 0.2)'
                     }}>
                        <Sparkles size={24} color="white" fill="white" />
                     </div>
                     <div>
                        <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 900, letterSpacing: '-0.02em' }}>DVS Guru AI</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600 }}>
                           <div className="status-dot"></div>
                           {t('Always active for help')}
                        </div>
                     </div>
                  </div>
                  <button 
                    onClick={clearChat}
                    style={{ background: 'transparent', border: 'none', color: '#64748B', cursor: 'pointer', padding: 8, borderRadius: 8 }}
                    title="Clear Chat"
                  >
                    <X size={18} />
                  </button>
               </div>
            </div>

            <div style={{ 
              flex: 1, 
              padding: '24px 20px', 
              overflowY: 'auto', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 20, 
              background: 'linear-gradient(180deg, #F8FAFC 0%, #F1F5F9 100%)',
              scrollbarWidth: 'none'
            }}>
               <div style={{ 
                 background: 'rgba(255, 107, 53, 0.05)', 
                 border: '1px dashed rgba(255, 107, 53, 0.3)', 
                 padding: '16px 20px', 
                 borderRadius: 20, 
                 fontSize: '0.85rem', 
                 color: '#A1401D', 
                 lineHeight: 1.6,
                 display: 'flex',
                 gap: 12
               }}>
                  <div style={{ color: '#FF6B35', flexShrink: 0 }}><Sparkles size={16} /></div>
                  <p className="hindi" style={{ margin: 0 }}>
                    {t('Namaste! I am DVS Guru. How can I help you today?')} {t('I can help you with Scholarships, UPSC coaching, and more.')}
                  </p>
               </div>
               
               {messages.map(msg => (
                 <div key={msg.id} style={{ 
                   display: 'flex', 
                   justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                   alignItems: 'flex-end',
                   gap: 8
                 }}>
                    {msg.sender === 'bot' && (
                      <div style={{ width: 28, height: 28, background: '#1E293B', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FF6B35', flexShrink: 0, marginBottom: 4 }}>
                         <Bot size={16} />
                      </div>
                    )}
                    <div style={{ 
                      maxWidth: '85%', 
                      padding: '14px 18px', 
                      borderRadius: 22,
                      background: msg.sender === 'user' ? '#FF6B35' : 'white',
                      color: msg.sender === 'user' ? 'white' : '#1E293B',
                      fontSize: '0.92rem', 
                      fontWeight: msg.sender === 'user' ? 600 : 500,
                      boxShadow: msg.sender === 'user' ? '0 8px 20px -6px rgba(255, 107, 53, 0.4)' : '0 4px 15px rgba(0,0,0,0.03)',
                      borderTopRightRadius: msg.sender === 'user' ? 4 : 22,
                      borderTopLeftRadius: msg.sender === 'bot' ? 4 : 22,
                      lineHeight: 1.5
                    }}>
                        {t(msg.text).split('\n').map((line, i) => <div key={i}>{line}</div>)}
                        {msg.options && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
                             {msg.options.map(opt => (
                               <button 
                                 key={opt}
                                 onClick={() => handleSend(opt)}
                                 style={{ padding: '6px 12px', borderRadius: 10, background: '#f1f5f9', border: '1px solid #e2e8f0', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', color: '#1e293b' }}
                               >
                                 {t(opt)}
                               </button>
                             ))}
                          </div>
                        )}
                    </div>
                 </div>
               ))}
               {isTyping && (
                 <div style={{ display: 'flex', gap: 6, padding: '16px 20px', background: 'white', borderRadius: 20, width: 'fit-content', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                    <div className="typing-dot"></div>
                    <div className="typing-dot" style={{ animationDelay: '0.2s' }}></div>
                    <div className="typing-dot" style={{ animationDelay: '0.4s' }}></div>
                 </div>
               )}
            </div>

            <div style={{ padding: '12px 20px', display: 'flex', flexWrap: 'wrap', gap: 10, background: '#F8FAFC' }}>
               {['Eligibility', 'Study Plan', 'Join DVS', 'Donate'].map(pill => (
                 <button 
                  key={pill} 
                  onClick={() => handleSend(pill)} 
                  className="guru-pill"
                 >
                   {t(pill)}
                 </button>
               ))}
            </div>

            <div style={{ padding: '20px 24px 28px', background: '#F8FAFC', borderTop: '1px solid #E2E8F0', display: 'flex', gap: 12, alignItems: 'center' }}>
               <div style={{ flex: 1, position: 'relative' }}>
                  <input 
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && handleSend()}
                    placeholder={t('Ask anything...')}
                    style={{ 
                      width: '100%', 
                      padding: '14px 20px', 
                      borderRadius: 16, 
                      border: '2px solid #E2E8F0', 
                      outline: 'none', 
                      fontSize: '0.95rem',
                      fontWeight: 500,
                      transition: 'all 0.3s',
                      backgroundColor: 'white'
                    }}
                    className="guru-input"
                  />
               </div>
               <button 
                 onClick={() => handleSend()}
                 style={{ 
                   width: 52, height: 52, 
                   background: '#FF6B35', 
                   color: 'white', 
                   border: 'none', 
                   borderRadius: 16, 
                   cursor: 'pointer', 
                   display: 'flex', alignItems: 'center', justifyContent: 'center',
                   boxShadow: '0 8px 20px -4px rgba(255, 107, 53, 0.4)',
                   transition: 'all 0.3s'
                 }}
                 className="guru-send-btn"
               >
                 <Send size={22} />
               </button>
            </div>
        </div>
      )}
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .pulse-animation {
          animation: pulseShadow 2s infinite;
        }
        @keyframes pulseShadow {
          0% { box-shadow: 0 0 0 0 rgba(255, 107, 53, 0.7); }
          70% { box-shadow: 0 0 0 15px rgba(255, 107, 53, 0); }
          100% { box-shadow: 0 0 0 0 rgba(255, 107, 53, 0); }
        }
        .status-dot {
          width: 8px; height: 8px; background: #10B981; borderRadius: 50%;
          box-shadow: 0 0 0 rgba(16, 185, 129, 0.4);
          animation: dotPulse 1.5s infinite;
        }
        @keyframes dotPulse {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
          70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }
        .typing-dot {
          width: 6px; height: 6px; background: #64748B; border-radius: 50%;
          animation: bounce 0.6s infinite alternate;
        }
        @keyframes bounce { to { transform: translateY(-4px); } }
        .guru-pill {
          padding: 8px 16px; border-radius: 12px; border: 1px solid #E2E8F0; 
          background: white; font-size: 0.8rem; font-weight: 700; cursor: pointer; color: #475569;
          transition: all 0.2s;
        }
        .guru-pill:hover {
          background: #FF6B35; color: white; border-color: #FF6B35; transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(255, 107, 53, 0.2);
        }
        .guru-input:focus {
          border-color: #FF6B35;
          box-shadow: 0 0 0 4px rgba(255, 107, 53, 0.1);
        }
        .guru-send-btn:hover {
          background: #E24A00;
          transform: translateY(-2px) scale(1.05);
        }
        .guru-send-btn:active { transform: translateY(0) scale(0.95); }
      `}</style>
    </>
  )
}
