import { ref, watch } from 'vue'

export interface SavedPlan {
  id: string
  title: string
  description: string
  markdown: string
  createdAt: string
}

const STORAGE_KEY = 'cia-saved-plans'

// Load from localStorage
const loadPlans = (): SavedPlan[] => {
  if (typeof window === 'undefined') return []
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

const savedPlans = ref<SavedPlan[]>([])

// Initialize on client side
if (typeof window !== 'undefined') {
  savedPlans.value = loadPlans()
}

export function useHistory() {
  // Save to localStorage whenever plans change
  const persist = () => {
    if (typeof window === 'undefined') return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedPlans.value))
  }

  const savePlan = (description: string, markdown: string): SavedPlan => {
    // Generate title from first heading or first line
    const titleMatch = markdown.match(/^##?\s+(.+)$/m)
    const title = titleMatch?.[1]
      ? titleMatch[1].slice(0, 50) 
      : description.slice(0, 50) + (description.length > 50 ? '...' : '')

    const plan: SavedPlan = {
      id: Date.now().toString(),
      title,
      description: description.slice(0, 200),
      markdown,
      createdAt: new Date().toISOString()
    }

    savedPlans.value.unshift(plan) // Add to beginning
    persist()
    return plan
  }

  const deletePlan = (id: string) => {
    const index = savedPlans.value.findIndex(p => p.id === id)
    if (index > -1) {
      savedPlans.value.splice(index, 1)
      persist()
    }
  }

  const getPlan = (id: string): SavedPlan | undefined => {
    return savedPlans.value.find(p => p.id === id)
  }

  const clearAllPlans = () => {
    savedPlans.value = []
    persist()
  }

  const exportPlan = (plan: SavedPlan) => {
    const blob = new Blob([plan.markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${plan.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  const exportAllPlans = () => {
    const allContent = savedPlans.value
      .map(p => `# ${p.title}\n\n${p.markdown}\n\n---\n`)
      .join('\n')
    const blob = new Blob([allContent], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'all-implementation-plans.md'
    a.click()
    URL.revokeObjectURL(url)
  }

  return {
    savedPlans,
    savePlan,
    deletePlan,
    getPlan,
    clearAllPlans,
    exportPlan,
    exportAllPlans
  }
}
