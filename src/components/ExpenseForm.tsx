// src/components/ExpenseForm.tsx
import React, { useEffect, useState } from 'react'
import type { Expense, ExpenseFormProps, Category, ExpenseFormData, FormErrors } from '../types'
import { PlusCircle, Check, X, IndianRupee, Calendar, Tag, FileText } from 'lucide-react'

const CATEGORIES: Category[] = [
  'Food',
  'Transport',
  'Shopping',
  'Health',
  'Education',
  'Other',
]

const getTodayDateString = (): string => {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const defaultFormData: ExpenseFormData = {
  title: '',
  amount: '',
  category: 'Food',
  date: getTodayDateString(),
  note: '',
}

export const ExpenseForm: React.FC<ExpenseFormProps> = ({
  onSubmit,
  editingExpense,
  onCancelEdit,
}) => {
  const [formData, setFormData] = useState<ExpenseFormData>(defaultFormData)
  const [errors, setErrors] = useState<FormErrors<ExpenseFormData>>({})

  // Update form data if editingExpense changes
  useEffect(() => {
    if (editingExpense) {
      setFormData({
        title: editingExpense.title,
        amount: editingExpense.amount.toString(),
        category: editingExpense.category,
        date: editingExpense.date,
        note: editingExpense.note ?? '',
      })
      setErrors({})
    } else {
      setFormData(defaultFormData)
      setErrors({})
    }
  }, [editingExpense])

  // Typed input change handler
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))

    // Clear field-specific error as user types
    if (errors[name as keyof ExpenseFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }))
    }
  }

  // Type-safe validation function
  const validateForm = (): boolean => {
    const newErrors: FormErrors<ExpenseFormData> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    } else if (formData.title.trim().length < 2) {
      newErrors.title = 'Title must be at least 2 characters'
    }

    const parsedAmount = parseFloat(formData.amount)
    if (!formData.amount.trim()) {
      newErrors.amount = 'Amount is required'
    } else if (isNaN(parsedAmount) || parsedAmount <= 0) {
      newErrors.amount = 'Amount must be a positive number greater than 0'
    }

    if (!formData.date) {
      newErrors.date = 'Date is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Typed form submit handler
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    const payload: Omit<Expense, 'id'> = {
      title: formData.title.trim(),
      amount: parseFloat(formData.amount),
      category: formData.category,
      date: formData.date,
      note: formData.note.trim() ? formData.note.trim() : undefined,
    }

    onSubmit(payload)
    setFormData(defaultFormData)
  }

  return (
    <div className="expense-form-card">
      <div className="form-header">
        <h2 className="form-title">
          {editingExpense ? '✏️ Edit Expense' : '➕ Add New Expense'}
        </h2>
        <p className="form-subtitle">
          {editingExpense
            ? `Updating expense ID #${editingExpense.id}`
            : 'Track your spending with strict TypeScript type safety'}
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="form-body">
        {/* Title Input */}
        <div className="form-group">
          <label htmlFor="title" className="form-label">
            Title / Description <span className="required-star">*</span>
          </label>
          <div className="input-with-icon">
            <input
              id="title"
              name="title"
              type="text"
              placeholder="e.g. Weekly Groceries, Bus Pass"
              value={formData.title}
              onChange={handleChange}
              className={`form-input ${errors.title ? 'input-error' : ''}`}
            />
          </div>
          {errors.title && <span className="error-message">{errors.title}</span>}
        </div>

        {/* Amount & Category in Grid */}
        <div className="form-row-2">
          {/* Amount Input */}
          <div className="form-group">
            <label htmlFor="amount" className="form-label">
              Amount (₹) <span className="required-star">*</span>
            </label>
            <div className="input-with-icon">
              <span className="input-icon-left">
                <IndianRupee className="w-4 h-4 text-slate-400" />
              </span>
              <input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={formData.amount}
                onChange={handleChange}
                className={`form-input pl-9 ${errors.amount ? 'input-error' : ''}`}
              />
            </div>
            {errors.amount && <span className="error-message">{errors.amount}</span>}
          </div>

          {/* Category Dropdown */}
          <div className="form-group">
            <label htmlFor="category" className="form-label">
              Category <span className="required-star">*</span>
            </label>
            <div className="input-with-icon">
              <span className="input-icon-left">
                <Tag className="w-4 h-4 text-slate-400" />
              </span>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="form-select pl-9"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Date Input */}
        <div className="form-group">
          <label htmlFor="date" className="form-label">
            Date <span className="required-star">*</span>
          </label>
          <div className="input-with-icon">
            <span className="input-icon-left">
              <Calendar className="w-4 h-4 text-slate-400" />
            </span>
            <input
              id="date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              className={`form-input pl-9 ${errors.date ? 'input-error' : ''}`}
            />
          </div>
          {errors.date && <span className="error-message">{errors.date}</span>}
        </div>

        {/* Note / Remarks (Optional) */}
        <div className="form-group">
          <label htmlFor="note" className="form-label">
            Note <span className="optional-tag">(Optional)</span>
          </label>
          <div className="input-with-icon">
            <span className="input-icon-left top-3">
              <FileText className="w-4 h-4 text-slate-400" />
            </span>
            <textarea
              id="note"
              name="note"
              rows={2}
              placeholder="Add additional context or transaction details..."
              value={formData.note}
              onChange={handleChange}
              className="form-textarea pl-9"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="form-actions">
          <button type="submit" className="btn-primary">
            {editingExpense ? (
              <>
                <Check className="w-4 h-4" />
                <span>Update Expense</span>
              </>
            ) : (
              <>
                <PlusCircle className="w-4 h-4" />
                <span>Add Expense</span>
              </>
            )}
          </button>

          {editingExpense && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="btn-secondary"
            >
              <X className="w-4 h-4" />
              <span>Cancel</span>
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

export default ExpenseForm
