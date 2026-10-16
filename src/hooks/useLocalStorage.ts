// src/hooks/useLocalStorage.ts
import { useState, useCallback } from 'react'

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

  // Use functional state updater with useCallback for reliable state synchronization
  const setValue = useCallback(
    (value: T | ((prev: T) => T)): void => {
      try {
        setStored(prevStored => {
          const valueToStore =
            value instanceof Function ? value(prevStored) : value
          try {
            localStorage.setItem(key, JSON.stringify(valueToStore))
          } catch (error) {
            console.warn(`Error writing to localStorage key "${key}":`, error)
          }
          return valueToStore
        })
      } catch (error) {
        console.warn(`Error in useLocalStorage setValue for "${key}":`, error)
      }
    },
    [key]
  )

  return [stored, setValue]
}

export default useLocalStorage
