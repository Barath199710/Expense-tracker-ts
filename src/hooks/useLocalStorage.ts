// src/hooks/useLocalStorage.ts
import { useState } from 'react'

/**
 * Generic custom hook for persisting state in localStorage with full type safety.
 * @template T - The type of data stored in localStorage
 * @param key - The localStorage lookup key
 * @param initialValue - Fallback value if key doesn't exist
 * @returns A tuple of [storedValue, setValue]
 */
function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const [stored, setStored] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : initialValue
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  const setValue = (value: T | ((prev: T) => T)): void => {
    try {
      const valueToStore = value instanceof Function ? value(stored) : value
      setStored(valueToStore)
      localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.warn(`Error writing to localStorage key "${key}":`, error)
    }
  }

  return [stored, setValue]
}

export default useLocalStorage
