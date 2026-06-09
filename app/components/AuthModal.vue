<script setup lang="ts">
const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const { signInWithProvider, signInWithEmail, isLoading } = useAuth()

const email = ref('')
const isEmailSent = ref(false)
const isSubmitting = ref(false)

const handleEmailSubmit = async () => {
  if (!email.value.trim()) return
  
  isSubmitting.value = true
  const success = await signInWithEmail(email.value)
  isSubmitting.value = false
  
  if (success) {
    isEmailSent.value = true
  }
}

const handleProviderSignIn = (provider: 'google' | 'github') => {
  signInWithProvider(provider)
  emit('close')
}

const resetModal = () => {
  email.value = ''
  isEmailSent.value = false
}

watch(() => props.isOpen, (open) => {
  if (!open) {
    setTimeout(resetModal, 300)
  }
})
</script>

<template>
  <!-- Backdrop -->
  <Transition
    enter-active-class="transition-opacity duration-300"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity duration-200"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div 
      v-if="isOpen" 
      class="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
      @click.self="emit('close')"
    >
      <!-- Modal -->
      <Transition
        enter-active-class="transition-all duration-300"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition-all duration-200"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div 
          v-if="isOpen"
          class="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-sm p-6 shadow-2xl"
        >
          <!-- Header -->
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-bold text-white">Sign In</h2>
            <button 
              @click="emit('close')"
              class="p-1 text-gray-400 hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Email sent confirmation -->
          <div v-if="isEmailSent" class="text-center py-4">
            <div class="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 class="text-white font-semibold mb-2">Check your email</h3>
            <p class="text-gray-400 text-sm mb-4">
              We sent a magic link to<br />
              <span class="text-white">{{ email }}</span>
            </p>
            <button
              @click="isEmailSent = false"
              class="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Use a different email
            </button>
          </div>

          <!-- Sign in options -->
          <div v-else>
            <p class="text-gray-400 text-sm mb-6 text-center">
              Sign in to sync your plans across devices
            </p>

            <!-- OAuth Providers -->
            <div class="space-y-3 mb-6">
              <button
                @click="handleProviderSignIn('google')"
                class="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white hover:bg-gray-100 text-black font-medium rounded-xl transition-colors"
              >
                <svg class="h-5 w-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>

              <button
                @click="handleProviderSignIn('github')"
                class="w-full flex items-center justify-center gap-3 px-4 py-3 bg-neutral-800 hover:bg-neutral-700 text-white font-medium rounded-xl border border-neutral-700 transition-colors"
              >
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                Continue with GitHub
              </button>
            </div>

            <!-- Divider -->
            <div class="flex items-center gap-4 mb-6">
              <div class="flex-1 h-px bg-neutral-800"></div>
              <span class="text-gray-500 text-xs uppercase">or</span>
              <div class="flex-1 h-px bg-neutral-800"></div>
            </div>

            <!-- Email -->
            <form @submit.prevent="handleEmailSubmit">
              <input
                v-model="email"
                type="email"
                placeholder="Enter your email"
                class="w-full px-4 py-3 bg-black border border-neutral-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/30 mb-3"
                required
              />
              <button
                type="submit"
                :disabled="isSubmitting || !email.trim()"
                class="w-full px-4 py-3 bg-white hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-black font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <svg v-if="isSubmitting" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ isSubmitting ? 'Sending...' : 'Send Magic Link' }}
              </button>
            </form>

            <!-- Footer -->
            <p class="text-gray-500 text-xs text-center mt-6">
              By signing in, you agree to sync your plans to the cloud.
            </p>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>
