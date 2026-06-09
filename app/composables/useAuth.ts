import { ref, computed } from 'vue'
import type { User, Session } from '@supabase/supabase-js'

const currentUser = ref<User | null>(null)
const currentSession = ref<Session | null>(null)
const isLoading = ref(true)
const isInitialized = ref(false)

export function useAuth() {
  const { supabase, isConfigured } = useSupabase()
  const toast = useToast()

  const isAuthenticated = computed(() => !!currentUser.value)
  
  const userEmail = computed(() => currentUser.value?.email || '')
  
  const userAvatar = computed(() => {
    return currentUser.value?.user_metadata?.avatar_url || 
           currentUser.value?.user_metadata?.picture || 
           null
  })

  const userName = computed(() => {
    return currentUser.value?.user_metadata?.full_name ||
           currentUser.value?.user_metadata?.name ||
           currentUser.value?.email?.split('@')[0] ||
           'User'
  })

  // Initialize auth state
  const initAuth = async () => {
    if (!supabase || isInitialized.value) return
    
    isLoading.value = true
    
    try {
      // Get current session
      const { data: { session } } = await supabase.auth.getSession()
      currentSession.value = session
      currentUser.value = session?.user || null

      // Listen for auth changes
      supabase.auth.onAuthStateChange(async (event, session) => {
        currentSession.value = session
        currentUser.value = session?.user || null
        
        if (event === 'SIGNED_IN') {
          toast.success('Welcome!', `Signed in as ${session?.user?.email}`)
        } else if (event === 'SIGNED_OUT') {
          toast.info('Signed out', 'Your local plans are still saved.')
        }
      })
      
      isInitialized.value = true
    } catch (error) {
      console.error('Auth initialization error:', error)
    } finally {
      isLoading.value = false
    }
  }

  // Sign in with OAuth provider
  const signInWithProvider = async (provider: 'google' | 'github') => {
    if (!supabase) {
      toast.error('Not configured', 'Supabase is not configured.')
      return
    }

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: typeof window !== 'undefined' ? window.location.origin : undefined
        }
      })

      if (error) throw error
    } catch (error: any) {
      console.error('Sign in error:', error)
      toast.error('Sign in failed', error.message || 'Could not sign in.')
    }
  }

  // Sign in with email (magic link)
  const signInWithEmail = async (email: string) => {
    if (!supabase) {
      toast.error('Not configured', 'Supabase is not configured.')
      return false
    }

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: typeof window !== 'undefined' ? window.location.origin : undefined
        }
      })

      if (error) throw error
      
      toast.success('Check your email', 'We sent you a magic link to sign in.')
      return true
    } catch (error: any) {
      console.error('Email sign in error:', error)
      toast.error('Sign in failed', error.message || 'Could not send magic link.')
      return false
    }
  }

  // Sign out
  const signOut = async () => {
    if (!supabase) return

    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      currentUser.value = null
      currentSession.value = null
    } catch (error: any) {
      console.error('Sign out error:', error)
      toast.error('Sign out failed', error.message || 'Could not sign out.')
    }
  }

  return {
    currentUser,
    currentSession,
    isAuthenticated,
    isLoading,
    isConfigured,
    userEmail,
    userAvatar,
    userName,
    initAuth,
    signInWithProvider,
    signInWithEmail,
    signOut
  }
}
