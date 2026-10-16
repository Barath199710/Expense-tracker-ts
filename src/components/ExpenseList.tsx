// src/components/ExpenseList.tsx
import React from 'react'
import type { ExpenseListProps } from '../types'
import ExpenseCard from './ExpenseCard'
import { Receipt, Inbox } from 'lucide-react'

export const ExpenseList: React.FC<ExpenseListProps> = ({
  expenses,
  onDelete,
  onEdit,
  editingExpenseId = null,
}) => {
  if (expenses.length === 0) {
    return (
      <div className="expense-empty-state">
        <div className="empty-icon-wrapper">
          <Inbox className="w-12 h-12 text-slate-400" />
        </div>
        <h3 className="empty-title">No expenses found</h3>
        <p className="empty-description">
          No records match your current filter and search criteria. Add a new expense or clear your filters to view records.
        </p>
      </div>
    )
  }

  return (
    <div className="expense-list-section">
      <div className="expense-list-header">
        <div className="flex items-center gap-2">
          <Receipt className="w-5 h-5 text-indigo-500" />
          <h2 className="list-title">Expense Records</h2>
        </div>
        <span className="count-badge">
          {expenses.length} {expenses.length === 1 ? 'Record' : 'Records'}
        </span>
      </div>

      <div className="expense-cards-grid">
        {expenses.map(expense => (
          <ExpenseCard
            key={expense.id}
            expense={expense}
            onDelete={onDelete}
            onEdit={onEdit}
            isEditing={expense.id === editingExpenseId}
          />
        ))}
      </div>
    </div>
  )
}

export default ExpenseList
