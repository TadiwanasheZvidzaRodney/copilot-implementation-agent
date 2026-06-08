<script setup lang="ts">
const { toasts, remove } = useToast()

const iconMap = {
  success: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>`,
  error: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>`,
  warning: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>`,
  info: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`
}

const styleMap = {
  success: 'bg-neutral-900 border-white/30 text-white',
  error: 'bg-neutral-900 border-white/30 text-white',
  warning: 'bg-neutral-900 border-white/30 text-white',
  info: 'bg-neutral-900 border-white/30 text-white'
}

const iconStyleMap = {
  success: 'text-white',
  error: 'text-white',
  warning: 'text-white',
  info: 'text-white'
}
</script>

<template>
  <Teleport to="body">
    <div class="fixed top-4 left-4 right-4 sm:left-auto sm:right-4 z-50 flex flex-col gap-2 sm:gap-3 sm:max-w-sm sm:w-full pointer-events-none">
      <TransitionGroup
        enter-active-class="transform ease-out duration-300 transition"
        enter-from-class="translate-y-[-100%] sm:translate-y-0 sm:translate-x-full opacity-0"
        enter-to-class="translate-y-0 sm:translate-x-0 opacity-100"
        leave-active-class="transition ease-in duration-200"
        leave-from-class="translate-y-0 sm:translate-x-0 opacity-100"
        leave-to-class="translate-y-[-100%] sm:translate-y-0 sm:translate-x-full opacity-0"
      >
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="[
            'pointer-events-auto rounded-xl border p-3 sm:p-4 shadow-2xl backdrop-blur-sm',
            styleMap[toast.type]
          ]"
        >
          <div class="flex items-start gap-2 sm:gap-3">
            <div 
              :class="['flex-shrink-0', iconStyleMap[toast.type]]"
              v-html="iconMap[toast.type]"
            />
            <div class="flex-1 min-w-0">
              <p class="font-semibold text-sm text-white">{{ toast.title }}</p>
              <p v-if="toast.message" class="mt-0.5 sm:mt-1 text-xs text-gray-400 line-clamp-2 sm:line-clamp-3">{{ toast.message }}</p>
            </div>
            <button
              @click="remove(toast.id)"
              class="flex-shrink-0 text-gray-500 hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>
