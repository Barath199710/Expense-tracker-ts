// src/hooks/useToast.ts
import { useState, useCallback } from 'react'
import type { ToastMessage, ToastType } from '../types'

export interface UseToastReturn {
  toasts: ToastMessage[]
  addToast: (message: string, type?: ToastType) => void
  removeToast: (id: string) => void
}

export function useToast(): UseToastReturn {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const removeToast = useCallback((id: string): void => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const addToast = useCallback((message: string, type: ToastType = 'info'): void => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 7)
    const newToast: ToastMessage = { id, type, message }

    setToasts(prev => [...prev, newToast])

    setTimeout(() => {
      removeToast(id)
    }, 4000)
  }, [removeToast])

  return { toasts, addToast, removeToast }
}

export default useToast
