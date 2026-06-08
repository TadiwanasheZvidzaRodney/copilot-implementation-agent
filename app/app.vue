<script setup lang="ts">
import { marked } from 'marked'

const projectDescription = ref('')
const generatedPlan = ref('')
const isLoading = ref(false)

const toast = useToast()

// Configure marked for safe rendering
marked.setOptions({
  breaks: true,
  gfm: true
})

const renderedMarkdown = computed(() => {
  if (!generatedPlan.value) return ''
  return marked(generatedPlan.value)
})

async function generatePlan() {
  if (!projectDescription.value.trim()) {
    toast.warning('Missing Input', 'Please enter a project description.')
    return
  }
  
  isLoading.value = true
  generatedPlan.value = ''

  try {
    const data = await $fetch('/api/plan', {
      method: 'POST',
      body: { projectDescription: projectDescription.value }
    })
    generatedPlan.value = data.markdown
    toast.success('Plan Generated!', 'Your implementation plan is ready.')
  } catch (err: any) {
    console.error(err)
    const errorMessage = err.data?.message || err.message || 'An error occurred'
    
    // Handle specific error types
    if (errorMessage.includes('429') || errorMessage.includes('quota') || errorMessage.includes('rate')) {
      toast.warning('Rate Limit Reached', 'API quota exceeded. Please wait a moment and try again.')
    } else if (errorMessage.includes('403') || errorMessage.includes('authentication') || errorMessage.includes('API Key')) {
      toast.error('Authentication Error', 'Invalid API key. Please check your configuration.')
    } else {
      toast.error('Generation Failed', errorMessage)
    }
  } finally {
    isLoading.value = false
  }
}

function clearPlan() {
  generatedPlan.value = ''
  toast.info('Cleared', 'Ready for a new project description.')
}

function copyToClipboard() {
  navigator.clipboard.writeText(generatedPlan.value)
  toast.success('Copied!', 'Plan copied to clipboard.')
}
</script>

<template>
  <div class="min-h-screen bg-black text-white">
    <!-- Toast Notifications -->
    <ToastContainer />
    
    <!-- Background Pattern -->
    <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtNi42MjcgMC0xMiA1LjM3My0xMiAxMnM1LjM3MyAxMiAxMiAxMiAxMi01LjM3MyAxMi0xMi01LjM3My0xMi0xMi0xMnptMCAyYzUuNTIzIDAgMTAgNC40NzcgMTAgMTBzLTQuNDc3IDEwLTEwIDEwLTEwLTQuNDc3LTEwLTEwIDQuNDc3LTEwIDEwLTEweiIgZmlsbD0iIzIyMjIyMiIgZmlsbC1vcGFjaXR5PSIuMyIvPjwvZz48L3N2Zz4=')] opacity-20"></div>
    
    <div class="relative flex flex-col items-center p-4 md:p-8">
      <!-- Header -->
      <header class="w-full max-w-5xl mb-8 text-center">
        <div class="flex flex-col items-center gap-4 mb-4">
          <img src="/logo-white.svg" alt="Copilot Implementation Agent Logo" class="w-32 h-auto" />
          <h1 class="text-3xl md:text-4xl font-bold tracking-tight text-white">
            Copilot Implementation Agent
          </h1>
        </div>
        <p class="text-gray-400 text-lg max-w-2xl mx-auto">
          Transform your project ideas into structured, phased technical implementation plans powered by AI.
        </p>
      </header>

      <main class="w-full max-w-5xl space-y-6">
        <!-- Input Card -->
        <div class="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl">
          <div class="flex items-center gap-2 mb-4">
            <div class="w-2 h-2 rounded-full bg-white animate-pulse"></div>
            <h2 class="text-sm font-semibold uppercase tracking-wider text-gray-400">Project Description</h2>
          </div>
          
          <textarea
            v-model="projectDescription"
            placeholder="Describe your project, app ideas, tech stack, or functional requirements here...

Example: 'Build a task management app with user authentication, real-time collaboration, and a drag-and-drop interface using Vue.js and Supabase'"
            class="w-full h-40 bg-black border border-neutral-800 rounded-xl p-4 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 resize-none text-sm md:text-base transition-all duration-200"
          />
          
          <div class="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4">
            <p class="text-xs text-gray-500">
              💡 Be as detailed as possible for better results
            </p>
            <div class="flex gap-3">
              <button
                v-if="generatedPlan"
                @click="clearPlan"
                class="px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 bg-neutral-800 hover:bg-neutral-700 text-gray-300 border border-neutral-700"
              >
                Clear
              </button>
              <button
                @click="generatePlan"
                :disabled="isLoading || !projectDescription.trim()"
                class="px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 bg-white hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-black shadow-lg shadow-white/10 hover:shadow-white/20 flex items-center gap-2"
              >
                <svg v-if="isLoading" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                {{ isLoading ? 'Generating Plan...' : 'Generate Plan' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 shadow-2xl">
          <div class="flex flex-col items-center justify-center gap-4">
            <div class="relative">
              <div class="w-16 h-16 border-4 border-neutral-800 rounded-full"></div>
              <div class="absolute top-0 left-0 w-16 h-16 border-4 border-white rounded-full animate-spin border-t-transparent"></div>
            </div>
            <div class="text-center">
              <p class="text-white font-medium">Architecting your implementation plan...</p>
              <p class="text-gray-500 text-sm mt-1">This may take a few moments</p>
            </div>
          </div>
        </div>

        <!-- Output Card -->
        <div v-if="generatedPlan && !isLoading" class="bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden">
          <div class="flex justify-between items-center p-4 md:p-6 border-b border-neutral-800 bg-neutral-900/50">
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 rounded-full bg-white"></div>
              <h2 class="text-sm font-semibold uppercase tracking-wider text-gray-400">Generated Implementation Plan</h2>
            </div>
            <button
              @click="copyToClipboard"
              class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 bg-neutral-800 hover:bg-neutral-700 text-gray-300 border border-neutral-700 flex items-center gap-1.5"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy
            </button>
          </div>
          <div 
            class="prose prose-invert max-w-none p-4 md:p-6 
                   prose-headings:text-white prose-headings:font-bold
                   prose-h2:text-2xl prose-h2:border-b prose-h2:border-neutral-800 prose-h2:pb-2 prose-h2:mb-4
                   prose-h3:text-xl prose-h3:text-gray-300
                   prose-p:text-gray-400 prose-p:leading-relaxed
                   prose-li:text-gray-400 prose-li:marker:text-white
                   prose-strong:text-white
                   prose-code:text-gray-300 prose-code:bg-neutral-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-normal prose-code:before:content-none prose-code:after:content-none
                   prose-pre:bg-black prose-pre:border prose-pre:border-neutral-800 prose-pre:rounded-xl
                   prose-a:text-white prose-a:underline hover:prose-a:text-gray-300"
            v-html="renderedMarkdown"
          />
        </div>
      </main>

      <!-- Footer -->
      <footer class="w-full max-w-5xl mt-12 pt-8 border-t border-neutral-800 text-center">
        <p class="text-gray-500 text-sm">
          Powered by <span class="text-white">Hugging Face AI</span> • Built with <span class="text-white">❤️</span> by <a href="https://www.linkedin.com/in/tadiwanashe-zvidza-48583424b/" target="_blank" rel="noopener noreferrer" class="text-white hover:underline">Tadiwanashe</a>
        </p>
      </footer>
    </div>
  </div>
</template>

<style>
/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #000000;
}

::-webkit-scrollbar-thumb {
  background: #333333;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555555;
}

/* Checkbox styling for task lists */
.prose input[type="checkbox"] {
  width: 1rem;
  height: 1rem;
  border-radius: 0.25rem;
  border-color: #404040;
  background-color: #171717;
  color: #ffffff;
  margin-right: 0.5rem;
}
</style>
