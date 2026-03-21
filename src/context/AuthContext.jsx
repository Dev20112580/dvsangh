import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      else setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      else { setProfile(null); setLoading(false) }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function fetchProfile(userId) {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single()
    if (data) {
      setProfile(data)
      
      // Daily Login Points Logic
      const lastLogin = data.last_login_at ? new Date(data.last_login_at) : null
      const today = new Date()
      const isNewDay = !lastLogin || lastLogin.toDateString() !== today.toDateString()

      if (isNewDay) {
        // Award 5 points for daily login
        await supabase.from('gamification_points').insert([
          { user_id: userId, action: 'daily_login', points: 5, description: 'Daily Login Bonus' }
        ])
        
        // Update last_login_at
        await supabase.from('profiles').update({ last_login_at: today.toISOString() }).eq('id', userId)
      }
    }
    setLoading(false)
  }

  async function signUp(email, password, metadata) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: metadata }
    })
    return { data, error }
  }

  async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    return { data, error }
  }

  async function verifyOTP(email, token, type = 'signup') {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type
    })
    return { data, error }
  }

  async function signOut() {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, signUp, signIn, signOut, verifyOTP }}>
      {children}
    </AuthContext.Provider>
  )
}
