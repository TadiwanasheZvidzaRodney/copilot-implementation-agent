<script setup lang="ts">
const { isAuthenticated, isConfigured, userAvatar, userName, userEmail, signOut, isLoading } = useAuth()

const isDropdownOpen = ref(false)
const isAuthModalOpen = ref(false)

const handleSignOut = async () => {
  isDropdownOpen.value = false
  await signOut()
}

// Close dropdown when clicking outside
const dropdownRef = ref<HTMLElement | null>(null)

onMounted(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
      isDropdownOpen.value = false
    }
  }
  document.addEventListener('click', handleClickOutside)
  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
  })
})
</script>

<template>
  <div ref="dropdownRef" class="relative">
    <!-- Not configured state - hide completely -->
    <template v-if="!isConfigured">
      <!-- Supabase not configured, no auth button shown -->
    </template>

    <!-- Loading state -->
    <template v-else-if="isLoading">
      <div class="w-9 h-9 bg-neutral-800 rounded-full animate-pulse"></div>
    </template>

    <!-- Authenticated state -->
    <template v-else-if="isAuthenticated">
      <button
        @click="isDropdownOpen = !isDropdownOpen"
        class="flex items-center gap-2 p-1 rounded-full hover:bg-neutral-800 transition-colors"
      >
        <div class="w-8 h-8 rounded-full bg-neutral-700 overflow-hidden flex items-center justify-center">
          <img 
            v-if="userAvatar" 
            :src="userAvatar" 
            :alt="userName"
            class="w-full h-full object-cover"
          />
          <span v-else class="text-white text-sm font-medium">
            {{ userName.charAt(0).toUpperCase() }}
          </span>
        </div>
      </button>

      <!-- Dropdown Menu -->
      <Transition
        enter-active-class="transition ease-out duration-100"
        enter-from-class="transform opacity-0 scale-95"
        enter-to-class="transform opacity-100 scale-100"
        leave-active-class="transition ease-in duration-75"
        leave-from-class="transform opacity-100 scale-100"
        leave-to-class="transform opacity-0 scale-95"
      >
        <div 
          v-if="isDropdownOpen"
          class="absolute right-0 mt-2 w-56 bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl overflow-hidden z-50"
        >
          <div class="p-3 border-b border-neutral-800">
            <p class="text-white text-sm font-medium truncate">{{ userName }}</p>
            <p class="text-gray-500 text-xs truncate">{{ userEmail }}</p>
          </div>
          <div class="p-2">
            <div class="flex items-center gap-2 px-3 py-2 text-gray-400 text-xs">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              Plans synced to cloud
            </div>
            <button
              @click="handleSignOut"
              class="w-full flex items-center gap-2 px-3 py-2 text-gray-300 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      </Transition>
    </template>

    <!-- Guest state - Show sign in button -->
    <template v-else>
      <button
        @click="isAuthModalOpen = true"
        class="flex items-center justify-center gap-2 p-2 sm:px-3 sm:py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-xl transition-colors text-sm text-white min-w-[36px]"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <span class="hidden sm:inline">Sign In</span>
      </button>
    </template>

    <!-- Auth Modal -->
    <AuthModal 
      :is-open="isAuthModalOpen"
      @close="isAuthModalOpen = false"
    />
  </div>
</template>
