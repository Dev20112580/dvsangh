import { supabase } from '../supabaseClient'

export const useGamification = () => {
  const awardPoints = async (userId, action, points, description = '') => {
    if (!userId) return { error: 'No user ID provided' }

    try {
      // 1. Insert into gamification_points (Trigger handles profile update)
      const { data, error } = await supabase
        .from('gamification_points')
        .insert([
          { 
            user_id: userId, 
            action, 
            points, 
            description 
          }
        ])

      if (error) throw error

      return { success: true, data }
    } catch (error) {
      console.error('Error awarding points:', error)
      return { error }
    }
  }

  const getUserPoints = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('total_points, current_level')
        .eq('id', userId)
        .single()

      if (error) throw error
      return { data }
    } catch (error) {
      console.error('Error fetching points:', error)
      return { error }
    }
  }

  return { awardPoints, getUserPoints }
}
