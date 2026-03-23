import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AdminAuthContext = createContext({})

export const useAdminAuth = () => useContext(AdminAuthContext)

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) fetchAdminProfile(session.user.id)
      else setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) fetchAdminProfile(session.user.id)
      else { setAdmin(null); setLoading(false) }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function fetchAdminProfile(userId) {
    const { data, error } = await supabase
      .from('admin_accounts')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (data) {
      // Map existing DB levels to explicit Phase 2 levels
      let refinedLevel = 'L3'
      if (data.level === 'super_admin') refinedLevel = 'L1'
      else if (data.level === 'high_access') refinedLevel = 'L2'
      else if (data.level === 'medium_access') {
          if (data.designation.toLowerCase().includes('treasurer')) refinedLevel = 'L3b'
          else refinedLevel = 'L3a'
      }
      
      setAdmin({ ...data, refinedLevel })
    } else {
      setAdmin(null)
    }
    setLoading(false)
  }

  return (
    <AdminAuthContext.Provider value={{ admin, loading, setAdmin }}>
      {children}
    </AdminAuthContext.Provider>
  )
}
