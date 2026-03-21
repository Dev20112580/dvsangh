import { useState, useEffect } from 'react'
import { Download, X, Sparkles } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const { t } = useLanguage()

  useEffect(() => {
    const handler = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault()
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e)
      // Show the customized prompt after some time
      setTimeout(() => setShowPrompt(true), 5000)
    }

    window.addEventListener('beforeinstallprompt', handler)

    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return
    
    // Show the install prompt
    deferredPrompt.prompt()
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice
    console.log(`User response to the install prompt: ${outcome}`)
    
    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null)
    setShowPrompt(false)
  }

  if (!showPrompt) return null

  return (
    <div style={{
      position: 'fixed',
      bottom: 110,
      left: 30,
      background: 'white',
      padding: '20px 24px',
      borderRadius: '24px',
      boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
      zIndex: 1001,
      display: 'flex',
      alignItems: 'center',
      gap: 20,
      border: '1px solid #e2e8f0',
      animation: 'slideInLeft 0.5s ease-out'
    }}>
      <div style={{
        width: 48,
        height: 48,
        background: 'var(--dvs-orange-bg)',
        borderRadius: 12,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--dvs-orange)'
      }}>
        <Sparkles size={24} />
      </div>
      <div>
        <h4 className="hindi" style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800 }}>{t('Install DVS App')}</h4>
        <p className="hindi" style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>{t('Use DVS offline and get faster access.')}</p>
      </div>
      <div style={{ display: 'flex', gap: 12 }}>
        <button 
          onClick={handleInstallClick}
          className="btn btn-sm btn-primary"
          style={{ padding: '8px 16px', borderRadius: 10 }}
        >
          {t('Install Now')}
        </button>
        <button 
          onClick={() => setShowPrompt(false)}
          style={{ padding: 8, background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
        >
          <X size={18} />
        </button>
      </div>
      <style>{`
        @keyframes slideInLeft {
          from { transform: translateX(-50px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
