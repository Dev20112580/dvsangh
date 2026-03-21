/* eslint-disable */
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vfgapmdjblusfsjmxgde.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmZ2FwbWRqYmx1c2Zzam14Z2RlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2MzQzMjEsImV4cCI6MjA4OTIxMDMyMX0.S3lZZAtyZn-TJ7aaLKK6ZEMiK2mY2L2mqSDYOAF4-js'
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testSignIn() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'sumit@dvs.com',
    password: 'dvsadmin123'
  })
  
  if (error) {
    console.error("Login failed:", error.message)
    process.exit(1)
  }
  
  console.log("Login success!", data.user.id)
  
  const { data: admin, error: dbError } = await supabase.from('admin_accounts')
    .select('*').eq('user_id', data.user.id).single()
    
  if (dbError) {
    console.error("DB Query fail:", dbError.message)
  } else {
    console.log("Admin account found:", admin.admin_id)
  }
}

testSignIn()
