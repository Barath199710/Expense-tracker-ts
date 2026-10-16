// src/components/ExpenseEditModal.tsx
import React, { useState, useEffect } from 'react'
import type { Expense, EditModalProps, Category, ExpenseFormData, FormErrors } from '../types'
import { X, Check, IndianRupee, Calendar, Tag, FileText } from 'lucide-react'

const CATEGORIES: Category[] = [
  'Food',
  'Transport',
  'Shopping',
  'Health',
  'Education',
  'Other',
]

export const ExpenseEditModal: React.FC<EditModalProps> = ({
  expense,
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<ExpenseFormData>({
    title: '',
    amount: '',
    category: 'Food',
    date: '',
    note: '',
  })
  const [errors, setErrors] = useState<FormErrors<ExpenseFormData>>({})

  useEffect(() => {
    if (expense) {
      setFormData({
        title: expense.title,
        amount: expense.amount.toString(),
        category: expense.category,
        date: expense.date,
        note: expense.note ?? '',
      })
      setErrors({})
    }
  }, [expense, isOpen])

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen || !expense) return null

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))

    if (errors[name as keyof ExpenseFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }))
    }
  }

  const validate = (): boolean => {
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
      newErrors.amount = 'Amount must be greater than 0'
    }

    if (!formData.date) {
      newErrors.date = 'Date is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault()

    if (!validate()) return

    const updatedData: Omit<Expense, 'id'> = {
      title: formData.title.trim(),
      amount: parseFloat(formData.amount),
      category: formData.category,
      date: formData.date,
      note: formData.note.trim() ? formData.note.trim() : undefined,
    }

    onSave(expense.id, updatedData)
    onClose()
  }

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-container" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="flex items-center gap-2">
            <h3 className="modal-title">✏️ Edit Expense</h3>
            <span className="modal-badge">ID #{expense.id}</span>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close edit dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body" noValidate>
          {/* Title */}
          <div className="form-group">
            <label htmlFor="modal-title" className="form-label">
              Title / Description <span className="required-star">*</span>
            </label>
            <input
              id="modal-title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Supermarket Grocery"
              className={`form-input ${errors.title ? 'input-error' : ''}`}
              autoFocus
            />
            {errors.title && <span className="error-message">{errors.title}</span>}
          </div>

          {/* Amount & Category */}
          <div className="form-row-2">
            <div className="form-group">
              <label htmlFor="modal-amount" className="form-label">
                Amount (₹) <span className="required-star">*</span>
              </label>
              <div className="input-with-icon">
                <span className="input-icon-left">
                  <IndianRupee className="w-4 h-4 text-slate-400" />
                </span>
                <input
                  id="modal-amount"
                  name="amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={formData.amount}
                  onChange={handleChange}
                  className={`form-input pl-9 ${errors.amount ? 'input-error' : ''}`}
                />
              </div>
              {errors.amount && <span className="error-message">{errors.amount}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="modal-category" className="form-label">
                Category <span className="required-star">*</span>
              </label>
              <div className="input-with-icon">
                <span className="input-icon-left">
                  <Tag className="w-4 h-4 text-slate-400" />
                </span>
                <select
                  id="modal-category"
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

          {/* Date */}
          <div className="form-group">
            <label htmlFor="modal-date" className="form-label">
              Date <span className="required-star">*</span>
            </label>
            <div className="input-with-icon">
              <span className="input-icon-left">
                <Calendar className="w-4 h-4 text-slate-400" />
              </span>
              <input
                id="modal-date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                className={`form-input pl-9 ${errors.date ? 'input-error' : ''}`}
              />
            </div>
            {errors.date && <span className="error-message">{errors.date}</span>}
          </div>

          {/* Note */}
          <div className="form-group">
            <label htmlFor="modal-note" className="form-label">
              Note <span className="optional-tag">(Optional)</span>
            </label>
            <div className="input-with-icon">
              <span className="input-icon-left top-3">
                <FileText className="w-4 h-4 text-slate-400" />
              </span>
              <textarea
                id="modal-note"
                name="note"
                rows={2}
                value={formData.note}
                onChange={handleChange}
                placeholder="Add optional notes..."
                className="form-textarea pl-9"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              <Check className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ExpenseEditModal
