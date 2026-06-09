import { createClient, SupabaseClient } from '@supabase/supabase-js'

let supabaseClient: SupabaseClient | null = null
let isClientConfigured = false

export function useSupabase() {
  const config = useRuntimeConfig()
  
  const supabaseUrl = config.public.supabaseUrl as string
  const supabaseAnonKey = config.public.supabaseAnonKey as string
  
  // Check if properly configured (not placeholder values)
  const hasValidConfig = !!(
    supabaseUrl && 
    supabaseAnonKey && 
    supabaseUrl !== 'your_supabase_project_url' &&
    supabaseUrl.includes('supabase')
  )
  
  // Initialize Supabase client (singleton pattern)
  if (!supabaseClient && hasValidConfig) {
    supabaseClient = createClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true
        }
      }
    )
    isClientConfigured = true
  }

  // Use a ref for reactivity across SSR/client
  const isConfigured = ref(isClientConfigured || hasValidConfig)

  return {
    supabase: supabaseClient,
    isConfigured
  }
}
