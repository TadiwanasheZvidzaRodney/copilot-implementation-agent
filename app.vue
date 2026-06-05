<script setup lang="ts">
import { marked } from 'marked'

const projectDescription = ref('')
const generatedPlan = ref('')
const isLoading = ref(false)
const error = ref('')

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
  if (!projectDescription.value.trim()) return
  
  isLoading.value = true
  generatedPlan.value = ''
  error.value = ''

  try {
    const data = await $fetch('/api/plan', {
      method: 'POST',
      body: { projectDescription: projectDescription.value }
    })
    generatedPlan.value = data.markdown
  } catch (err: any) {
    console.error(err)
    error.value = err.data?.message || 'An error occurred while generating the plan. Please try again.'
  } finally {
    isLoading.value = false
  }
}

function clearPlan() {
  generatedPlan.value = ''
  error.value = ''
}

function copyToClipboard() {
  navigator.clipboard.writeText(generatedPlan.value)
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100">
    <!-- Background Pattern -->
    <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtNi42MjcgMC0xMiA1LjM3My0xMiAxMnM1LjM3MyAxMiAxMiAxMiAxMi01LjM3MyAxMi0xMi01LjM3My0xMi0xMi0xMnptMCAyYzUuNTIzIDAgMTAgNC40NzcgMTAgMTBzLTQuNDc3IDEwLTEwIDEwLTEwLTQuNDc3LTEwLTEwIDQuNDc3LTEwIDEwLTEweiIgZmlsbD0iIzMzNDA1NSIgZmlsbC1vcGFjaXR5PSIuMyIvPjwvZz48L3N2Zz4=')] opacity-20"></div>
    
    <div class="relative flex flex-col items-center p-4 md:p-8">
      <!-- Header -->
      <header class="w-full max-w-5xl mb-8 text-center">
        <div class="flex items-center justify-center gap-3 mb-4">
          <div class="w-12 h-12 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h1 class="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Copilot Implementation Agent
          </h1>
        </div>
        <p class="text-slate-400 text-lg max-w-2xl mx-auto">
          Transform your project ideas into structured, phased technical implementation plans powered by AI.
        </p>
      </header>

      <main class="w-full max-w-5xl space-y-6">
        <!-- Input Card -->
        <div class="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
          <div class="flex items-center gap-2 mb-4">
            <div class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
            <h2 class="text-sm font-semibold uppercase tracking-wider text-slate-400">Project Description</h2>
          </div>
          
          <textarea
            v-model="projectDescription"
            placeholder="Describe your project, app ideas, tech stack, or functional requirements here...

Example: 'Build a task management app with user authentication, real-time collaboration, and a drag-and-drop interface using Vue.js and Supabase'"
            class="w-full h-40 bg-slate-900/50 border border-slate-700/50 rounded-xl p-4 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 resize-none text-sm md:text-base transition-all duration-200"
          />
          
          <div class="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4">
            <p class="text-xs text-slate-500">
              💡 Be as detailed as possible for better results
            </p>
            <div class="flex gap-3">
              <button
                v-if="generatedPlan"
                @click="clearPlan"
                class="px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 bg-slate-700 hover:bg-slate-600 text-slate-300 border border-slate-600"
              >
                Clear
              </button>
              <button
                @click="generatePlan"
                :disabled="isLoading || !projectDescription.trim()"
                class="px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 flex items-center gap-2"
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

        <!-- Error Alert -->
        <div v-if="error" class="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 class="font-semibold text-red-400">Error</h3>
            <p class="text-red-300/80 text-sm">{{ error }}</p>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
          <div class="flex flex-col items-center justify-center gap-4">
            <div class="relative">
              <div class="w-16 h-16 border-4 border-slate-700 rounded-full"></div>
              <div class="absolute top-0 left-0 w-16 h-16 border-4 border-emerald-500 rounded-full animate-spin border-t-transparent"></div>
            </div>
            <div class="text-center">
              <p class="text-slate-300 font-medium">Architecting your implementation plan...</p>
              <p class="text-slate-500 text-sm mt-1">This may take a few moments</p>
            </div>
          </div>
        </div>

        <!-- Output Card -->
        <div v-if="generatedPlan && !isLoading" class="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden">
          <div class="flex justify-between items-center p-4 md:p-6 border-b border-slate-700/50 bg-slate-800/30">
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 rounded-full bg-cyan-400"></div>
              <h2 class="text-sm font-semibold uppercase tracking-wider text-cyan-400">Generated Implementation Plan</h2>
            </div>
            <button
              @click="copyToClipboard"
              class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 bg-slate-700 hover:bg-slate-600 text-slate-300 border border-slate-600 flex items-center gap-1.5"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy
            </button>
          </div>
          <div 
            class="prose prose-invert prose-slate max-w-none p-4 md:p-6 
                   prose-headings:text-slate-100 prose-headings:font-bold
                   prose-h2:text-2xl prose-h2:border-b prose-h2:border-slate-700 prose-h2:pb-2 prose-h2:mb-4
                   prose-h3:text-xl prose-h3:text-emerald-400
                   prose-p:text-slate-300 prose-p:leading-relaxed
                   prose-li:text-slate-300 prose-li:marker:text-emerald-500
                   prose-strong:text-slate-200
                   prose-code:text-cyan-400 prose-code:bg-slate-900/50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-normal prose-code:before:content-none prose-code:after:content-none
                   prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-700 prose-pre:rounded-xl
                   prose-a:text-emerald-400 prose-a:no-underline hover:prose-a:underline"
            v-html="renderedMarkdown"
          />
        </div>
      </main>

      <!-- Footer -->
      <footer class="w-full max-w-5xl mt-12 pt-8 border-t border-slate-800 text-center">
        <p class="text-slate-500 text-sm">
          Powered by <span class="text-emerald-400">Google Gemini AI</span> • Built with <span class="text-cyan-400">Nuxt 3</span>
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
  background: #1e293b;
}

::-webkit-scrollbar-thumb {
  background: #475569;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #64748b;
}

/* Checkbox styling for task lists */
.prose input[type="checkbox"] {
  @apply w-4 h-4 rounded border-slate-600 bg-slate-800 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-0 mr-2;
}
</style>
