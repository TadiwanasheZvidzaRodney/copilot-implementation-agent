<script setup lang="ts">
import type { SavedPlan } from '../composables/useHistory'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'select', plan: SavedPlan): void
}>()

const { savedPlans, deletePlan, exportPlan, clearAllPlans, exportAllPlans, isCloudSynced, isSyncing } = useHistory()
const { isAuthenticated, isConfigured } = useAuth()
const toast = useToast()

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const handleSelect = (plan: SavedPlan) => {
  emit('select', plan)
  emit('close')
}

const handleDelete = async (id: string, event: Event) => {
  event.stopPropagation()
  await deletePlan(id)
  toast.info('Deleted', 'Plan removed from history.')
}

const handleExport = (plan: SavedPlan, event: Event) => {
  event.stopPropagation()
  exportPlan(plan)
  toast.success('Exported', 'Plan downloaded as Markdown file.')
}

const handleClearAll = async () => {
  if (confirm('Are you sure you want to delete all saved plans?')) {
    await clearAllPlans()
    toast.info('Cleared', 'All plans have been deleted.')
  }
}

const handleExportAll = () => {
  if (savedPlans.value.length === 0) {
    toast.warning('No Plans', 'No plans to export.')
    return
  }
  exportAllPlans()
  toast.success('Exported', 'All plans downloaded as Markdown file.')
}
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
      class="fixed inset-0 bg-black/60 z-40"
      @click="emit('close')"
    />
  </Transition>

  <!-- Sidebar -->
  <Transition
    enter-active-class="transition-transform duration-300 ease-out"
    enter-from-class="-translate-x-full"
    enter-to-class="translate-x-0"
    leave-active-class="transition-transform duration-200 ease-in"
    leave-from-class="translate-x-0"
    leave-to-class="-translate-x-full"
  >
    <aside 
      v-if="isOpen"
      class="fixed left-0 top-0 h-full w-full sm:w-80 bg-neutral-900 border-r border-neutral-800 z-50 flex flex-col"
    >
      <!-- Header -->
      <div class="flex items-center justify-between p-4 border-b border-neutral-800">
        <div class="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 class="text-white font-semibold">History</h2>
        </div>
        <button 
          @click="emit('close')"
          class="p-1 text-gray-400 hover:text-white transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Actions -->
      <div class="flex gap-2 p-3 border-b border-neutral-800">
        <button
          @click="handleExportAll"
          class="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium bg-neutral-800 hover:bg-neutral-700 text-gray-300 rounded-lg transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export All
        </button>
        <button
          @click="handleClearAll"
          class="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium bg-neutral-800 hover:bg-red-900/50 text-gray-300 hover:text-red-300 rounded-lg transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Clear All
        </button>
      </div>

      <!-- Plans List -->
      <div class="flex-1 overflow-y-auto">
        <div v-if="savedPlans.length === 0" class="flex flex-col items-center justify-center h-full text-center p-6">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-neutral-700 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p class="text-gray-500 text-sm">No saved plans yet</p>
          <p class="text-gray-600 text-xs mt-1">Generated plans will appear here</p>
        </div>

        <div v-else class="p-2 space-y-2">
          <div
            v-for="plan in savedPlans"
            :key="plan.id"
            @click="handleSelect(plan)"
            class="group p-3 bg-neutral-800/50 hover:bg-neutral-800 rounded-xl cursor-pointer transition-colors border border-transparent hover:border-neutral-700"
          >
            <div class="flex items-start justify-between gap-2">
              <h3 class="text-white text-sm font-medium line-clamp-1 flex-1">
                {{ plan.title }}
              </h3>
              <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  @click="handleExport(plan, $event)"
                  class="p-1 text-gray-500 hover:text-white transition-colors"
                  title="Export as MD"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </button>
                <button
                  @click="handleDelete(plan.id, $event)"
                  class="p-1 text-gray-500 hover:text-red-400 transition-colors"
                  title="Delete"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
            <p class="text-gray-500 text-xs mt-1 line-clamp-2">
              {{ plan.description }}
            </p>
            <p class="text-gray-600 text-xs mt-2">
              {{ formatDate(plan.createdAt) }}
            </p>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="p-3 border-t border-neutral-800">
        <!-- Sync Status -->
        <div v-if="isSyncing" class="flex items-center justify-center gap-2 text-gray-400 text-xs mb-2">
          <svg class="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
          Syncing...
        </div>
        <div v-else-if="isAuthenticated && isCloudSynced" class="flex items-center justify-center gap-1.5 text-gray-400 text-xs mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          Synced to cloud
        </div>
        <div v-else-if="isConfigured && !isAuthenticated" class="flex items-center justify-center gap-1.5 text-gray-500 text-xs mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Sign in to sync
        </div>
        
        <p class="text-gray-600 text-xs text-center">
          {{ savedPlans.length }} saved plan{{ savedPlans.length === 1 ? '' : 's' }}
        </p>
      </div>
    </aside>
  </Transition>
</template>
