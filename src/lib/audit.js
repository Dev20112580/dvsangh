import { supabase } from './supabase'

/**
 * Logs an administrative action to the audit trail.
 * @param {string} adminId - The DVS ID of the admin
 * @param {string} action - The action performed (e.g., 'APPROVED_SCHOLARSHIP')
 * @param {object} details - Any additional metadata
 */
export async function logAdminAction(adminId, action, details = {}) {
  try {
    const { error } = await supabase.from('admin_audit_logs').insert([{
      admin_id: adminId,
      action: action,
      details: details,
      ip_address: 'Logged via Frontend', // Ideally server-side or via custom hook
      timestamp: new Date().toISOString()
    }])
    if (error) console.error('Audit Log Error:', error)
  } catch (err) {
    console.error('Audit Log Failed:', err)
  }
}
