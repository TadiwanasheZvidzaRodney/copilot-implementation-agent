import { createClient, SupabaseClient } from '@supabase/supabase-js'

let supabaseClient: SupabaseClient | null = null

export function useSupabase() {
  const config = useRuntimeConfig()
  
  const supabaseUrl = config.public.supabaseUrl as string
  const supabaseAnonKey = config.public.supabaseAnonKey as string
  
  // Initialize Supabase client (singleton pattern)
  if (!supabaseClient && supabaseUrl && supabaseAnonKey) {
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
  }

  const isConfigured = computed(() => {
    return !!(supabaseUrl && supabaseAnonKey && supabaseUrl !== 'your_supabase_project_url')
  })

  return {
    supabase: supabaseClient,
    isConfigured
  }
}
