import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'

const LockdownContext = createContext()

export function LockdownProvider({ children }) {
  const { user } = useAuth()
  const [isLockdown, setIsLockdown] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLockdown()
    
    // Subscribe to real-time changes
    const subscription = supabase
      .channel('system_config_changes')
      .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'system_config',
        filter: 'key=eq.emergency_lockdown'
      }, payload => {
        setIsLockdown(payload.new.value === true || payload.new.value === 'true')
      })
      .subscribe()

    return () => {
      supabase.removeChannel(subscription)
    }
  }, [])

  async function fetchLockdown() {
    const { data, error } = await supabase
      .from('system_config')
      .select('value')
      .eq('key', 'emergency_lockdown')
      .single()
    
    if (data) {
      setIsLockdown(data.value === true || data.value === 'true')
    }
    setLoading(false)
  }

  const toggleLockdown = async (status) => {
    const { error } = await supabase
      .from('system_config')
      .update({ value: status, updated_at: new Date() })
      .eq('key', 'emergency_lockdown')
    
    if (error) {
      console.error('Lockdown toggle failed:', error)
      alert('Failed to update global lockdown state: ' + error.message)
    } else {
      // Log Action
      if (user) {
        await supabase.from('system_logs').insert([{
          admin_id: user.id,
          action: status === true ? 'lockdown_enabled' : 'lockdown_disabled',
          entity_type: 'system',
          entity_id: 'emergency_lockdown',
          metadata: { value: status }
        }])
      }
    }
  }

  return (
    <LockdownContext.Provider value={{ isLockdown, toggleLockdown, loading }}>
      {children}
    </LockdownContext.Provider>
  )
}

export const useLockdown = () => useContext(LockdownContext)
