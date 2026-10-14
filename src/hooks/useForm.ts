// src/hooks/useForm.ts
import { useState, useCallback } from 'react'
import type { FormErrors } from '../types'

/**
 * Generic useForm hook for handling typed form state, validation, and inputs.
 * Demonstrates generics, keyof constraints, and indexed access types.
 */
export function useForm<T extends Record<string, unknown>>(
  initialValues: T,
  validateFn?: (values: T) => FormErrors<T>
) {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<FormErrors<T>>({})
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({})

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void => {
      const { name, value } = e.target
      setValues(prev => ({
        ...prev,
        [name]: value,
      }))

      // Clear error for field when user starts typing
      if (errors[name as keyof T]) {
        setErrors(prev => ({
          ...prev,
          [name]: undefined,
        }))
      }
    },
    [errors]
  )

  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void => {
    const { name } = e.target
    setTouched(prev => ({
      ...prev,
      [name]: true,
    }))
  }, [])

  const setFieldValue = useCallback(<K extends keyof T>(field: K, value: T[K]): void => {
    setValues(prev => ({
      ...prev,
      [field]: value,
    }))
  }, [])

  const resetForm = useCallback((newValues?: T): void => {
    setValues(newValues ?? initialValues)
    setErrors({})
    setTouched({})
  }, [initialValues])

  const validate = useCallback((): boolean => {
    if (!validateFn) return true
    const validationErrors = validateFn(values)
    setErrors(validationErrors)
    // Form is valid if there are no error messages
    return Object.keys(validationErrors).length === 0
  }, [validateFn, values])

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    setFieldValue,
    setValues,
    resetForm,
    validate,
  }
}

export default useForm
