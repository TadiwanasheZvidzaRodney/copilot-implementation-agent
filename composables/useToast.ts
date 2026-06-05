import { ref } from 'vue'

export interface Toast {
  id: number
  type: 'success' | 'error' | 'info' | 'warning'
  title: string
  message?: string
  duration?: number
}

const toasts = ref<Toast[]>([])
let toastId = 0

export function useToast() {
  const add = (toast: Omit<Toast, 'id'>) => {
    const id = ++toastId
    const duration = toast.duration ?? 5000

    toasts.value.push({ ...toast, id })

    if (duration > 0) {
      setTimeout(() => {
        remove(id)
      }, duration)
    }

    return id
  }

  const remove = (id: number) => {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  const success = (title: string, message?: string) => {
    return add({ type: 'success', title, message })
  }

  const error = (title: string, message?: string) => {
    return add({ type: 'error', title, message, duration: 8000 })
  }

  const info = (title: string, message?: string) => {
    return add({ type: 'info', title, message })
  }

  const warning = (title: string, message?: string) => {
    return add({ type: 'warning', title, message, duration: 6000 })
  }

  return {
    toasts,
    add,
    remove,
    success,
    error,
    info,
    warning
  }
}
