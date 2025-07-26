import { ref } from 'vue'

/**
 * Composable for handling errors and notifications
 */
export function useNotifications() {
  const notifications = ref<Array<{
    id: string
    type: 'success' | 'error' | 'warning' | 'info'
    message: string
    timeout?: number
  }>>([])

  const addNotification = (
    type: 'success' | 'error' | 'warning' | 'info',
    message: string,
    timeout = 5000
  ) => {
    const id = Date.now().toString()
    notifications.value.push({ id, type, message, timeout })

    if (timeout > 0) {
      setTimeout(() => {
        removeNotification(id)
      }, timeout)
    }
  }

  const removeNotification = (id: string) => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }

  const clearAll = () => {
    notifications.value = []
  }

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll
  }
}

/**
 * Composable for safe local storage operations
 */
export function useLocalStorage() {
  const safeGetItem = <T>(key: string, defaultValue: T | null = null): T | null => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.warn(`Error reading from localStorage key "${key}":`, error)
      return defaultValue
    }
  }

  const safeSetItem = (key: string, value: unknown) => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (error) {
      console.warn(`Error writing to localStorage key "${key}":`, error)
      return false
    }
  }

  const safeRemoveItem = (key: string) => {
    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error)
      return false
    }
  }

  return {
    safeGetItem,
    safeSetItem,
    safeRemoveItem
  }
}
