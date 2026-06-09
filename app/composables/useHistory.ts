import { ref } from 'vue'

export interface SavedPlan {
  id: string
  title: string
  description: string
  markdown: string
  createdAt: string
  userId?: string // Optional: only set for cloud-synced plans
  isLocal?: boolean // Flag to identify local-only plans
}

const STORAGE_KEY = 'cia-saved-plans'

// Load from localStorage
const loadLocalPlans = (): SavedPlan[] => {
  if (typeof window === 'undefined') return []
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

const savedPlans = ref<SavedPlan[]>([])
const isCloudSynced = ref(false)
const isSyncing = ref(false)

// Initialize on client side
if (typeof window !== 'undefined') {
  savedPlans.value = loadLocalPlans()
}

export function useHistory() {
  const { supabase } = useSupabase()
  const { isAuthenticated, currentUser } = useAuth()

  // Persist to localStorage (always keep local cache)
  const persistLocal = () => {
    if (typeof window === 'undefined') return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedPlans.value))
  }

  // Fetch plans from Supabase
  const fetchCloudPlans = async (): Promise<SavedPlan[]> => {
    if (!supabase || !currentUser.value) return []

    try {
      const { data, error } = await supabase
        .from('saved_plans')
        .select('*')
        .eq('user_id', currentUser.value.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      return (data || []).map(plan => ({
        id: plan.id,
        title: plan.title,
        description: plan.description || '',
        markdown: plan.markdown,
        createdAt: plan.created_at,
        userId: plan.user_id,
        isLocal: false
      }))
    } catch (error) {
      console.error('Error fetching cloud plans:', error)
      return []
    }
  }

  // Save plan to Supabase
  const saveToCloud = async (plan: SavedPlan): Promise<boolean> => {
    if (!supabase || !currentUser.value) return false

    try {
      const { error } = await supabase
        .from('saved_plans')
        .insert({
          id: plan.id,
          user_id: currentUser.value.id,
          title: plan.title,
          description: plan.description,
          markdown: plan.markdown,
          created_at: plan.createdAt
        })

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error saving to cloud:', error)
      return false
    }
  }

  // Delete plan from Supabase
  const deleteFromCloud = async (id: string): Promise<boolean> => {
    if (!supabase || !currentUser.value) return false

    try {
      const { error } = await supabase
        .from('saved_plans')
        .delete()
        .eq('id', id)
        .eq('user_id', currentUser.value.id)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting from cloud:', error)
      return false
    }
  }

  // Sync local plans to cloud (migration on first sign-in)
  const migrateLocalToCloud = async () => {
    if (!supabase || !currentUser.value) return

    const localPlans = savedPlans.value.filter(p => p.isLocal !== false)
    
    for (const plan of localPlans) {
      const cloudPlan = { ...plan, userId: currentUser.value.id, isLocal: false }
      const success = await saveToCloud(cloudPlan)
      
      if (success) {
        // Update the plan in memory to mark as synced
        const index = savedPlans.value.findIndex(p => p.id === plan.id)
        if (index > -1) {
          savedPlans.value[index] = cloudPlan
        }
      }
    }
    
    persistLocal()
  }

  // Full sync: fetch cloud plans and merge with local
  const syncPlans = async () => {
    if (!isAuthenticated.value || !currentUser.value) {
      isCloudSynced.value = false
      return
    }

    isSyncing.value = true

    try {
      // First, migrate any local plans to cloud
      await migrateLocalToCloud()

      // Then fetch all cloud plans
      const cloudPlans = await fetchCloudPlans()
      
      // Replace local plans with cloud plans
      savedPlans.value = cloudPlans
      isCloudSynced.value = true
      persistLocal()
    } catch (error) {
      console.error('Sync error:', error)
    } finally {
      isSyncing.value = false
    }
  }

  // Save a new plan
  const savePlan = async (description: string, markdown: string): Promise<SavedPlan> => {
    // Generate title from first heading or first line
    const titleMatch = markdown.match(/^##?\s+(.+)$/m)
    const title = titleMatch?.[1]
      ? titleMatch[1].slice(0, 50) 
      : description.slice(0, 50) + (description.length > 50 ? '...' : '')

    const plan: SavedPlan = {
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      title,
      description: description.slice(0, 200),
      markdown,
      createdAt: new Date().toISOString(),
      userId: currentUser.value?.id,
      isLocal: !isAuthenticated.value
    }

    // Add to local state immediately (optimistic update)
    savedPlans.value.unshift(plan)
    persistLocal()

    // If authenticated, also save to cloud
    if (isAuthenticated.value && currentUser.value) {
      await saveToCloud(plan)
    }

    return plan
  }

  // Delete a plan
  const deletePlan = async (id: string) => {
    const index = savedPlans.value.findIndex(p => p.id === id)
    if (index > -1) {
      savedPlans.value.splice(index, 1)
      persistLocal()

      // If authenticated, also delete from cloud
      if (isAuthenticated.value) {
        await deleteFromCloud(id)
      }
    }
  }

  const getPlan = (id: string): SavedPlan | undefined => {
    return savedPlans.value.find(p => p.id === id)
  }

  const clearAllPlans = async () => {
    // Delete all from cloud first
    if (isAuthenticated.value && supabase && currentUser.value) {
      try {
        await supabase
          .from('saved_plans')
          .delete()
          .eq('user_id', currentUser.value.id)
      } catch (error) {
        console.error('Error clearing cloud plans:', error)
      }
    }

    savedPlans.value = []
    persistLocal()
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
    isCloudSynced,
    isSyncing,
    savePlan,
    deletePlan,
    getPlan,
    clearAllPlans,
    exportPlan,
    exportAllPlans,
    syncPlans,
    fetchCloudPlans
  }
}
