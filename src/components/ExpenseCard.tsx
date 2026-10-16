// src/components/ExpenseCard.tsx
import React from 'react'
import type { ExpenseCardProps, Category } from '../types'
import {
  Utensils,
  Car,
  ShoppingBag,
  HeartPulse,
  GraduationCap,
  Tag,
  Trash2,
  Edit3,
  Calendar,
  FileText
} from 'lucide-react'

// Category icon helper
const getCategoryIcon = (category: Category) => {
  switch (category) {
    case 'Food':
      return <Utensils className="w-4 h-4" />
    case 'Transport':
      return <Car className="w-4 h-4" />
    case 'Shopping':
      return <ShoppingBag className="w-4 h-4" />
    case 'Health':
      return <HeartPulse className="w-4 h-4" />
    case 'Education':
      return <GraduationCap className="w-4 h-4" />
    case 'Other':
    default:
      return <Tag className="w-4 h-4" />
  }
}

// Category badge color class
const getCategoryClass = (category: Category): string => {
  switch (category) {
    case 'Food':
      return 'badge-food'
    case 'Transport':
      return 'badge-transport'
    case 'Shopping':
      return 'badge-shopping'
    case 'Health':
      return 'badge-health'
    case 'Education':
      return 'badge-education'
    case 'Other':
    default:
      return 'badge-other'
  }
}

export const ExpenseCard: React.FC<ExpenseCardProps> = ({
  expense,
  onDelete,
  onEdit,
  isEditing = false,
}) => {
  return (
    <div className={`expense-card group ${isEditing ? 'card-editing-active' : ''}`}>
      <div className="expense-card-header">
        <div className="expense-card-main-info">
          <div className="flex items-center gap-2">
            <span className={`category-badge ${getCategoryClass(expense.category)}`}>
              {getCategoryIcon(expense.category)}
              <span>{expense.category}</span>
            </span>
            {isEditing && <span className="editing-pill">Editing Now</span>}
          </div>
          <h3 className="expense-title">{expense.title}</h3>
        </div>
        <div className="expense-amount-tag">
          ₹{expense.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
      </div>

      <div className="expense-card-meta">
        <div className="meta-item">
          <Calendar className="w-3.5 h-3.5" />
          <span>{expense.date}</span>
        </div>
        {expense.note && (
          <div className="meta-item note-item" title={expense.note}>
            <FileText className="w-3.5 h-3.5" />
            <span className="truncate">{expense.note}</span>
          </div>
        )}
      </div>

      <div className="expense-card-actions">
        {onEdit && (
          <button
            type="button"
            className="card-action-btn edit-btn"
            onClick={() => onEdit(expense)}
            title="Edit this expense"
            aria-label={`Edit ${expense.title}`}
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit</span>
          </button>
        )}

        <button
          type="button"
          className="card-action-btn delete-btn"
          onClick={() => onDelete(expense.id)}
          title="Delete this expense"
          aria-label={`Delete ${expense.title}`}
        >
          <Trash2 className="w-4 h-4" />
          <span>Delete</span>
        </button>
      </div>
    </div>
  )
}

export default ExpenseCard
