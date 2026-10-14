// src/components/SummaryStats.tsx
import React, { useMemo } from 'react'
import type { Expense, Category, SummaryStatsProps } from '../types'
import { Wallet, TrendingUp, Award, Hash } from 'lucide-react'

// Typed calculation helper functions
export function calculateTotalSpent(expenses: Expense[]): number {
  return expenses.reduce((sum, item) => sum + item.amount, 0)
}

export function getHighestExpense(expenses: Expense[]): Expense | null {
  if (expenses.length === 0) return null
  return expenses.reduce((highest, current) => {
    return current.amount > highest.amount ? current : highest
  }, expenses[0])
}

export function getMostUsedCategory(
  expenses: Expense[]
): { category: Category | 'None'; count: number } {
  if (expenses.length === 0) return { category: 'None', count: 0 }

  const counts = expenses.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + 1
    return acc
  }, {} as Record<Category, number>)

  let maxCategory: Category | 'None' = 'None'
  let maxCount = 0

  for (const [cat, count] of Object.entries(counts) as [Category, number][]) {
    if (count > maxCount) {
      maxCount = count
      maxCategory = cat
    }
  }

  return { category: maxCategory, count: maxCount }
}

export function getTotalByCategory(
  expenses: Expense[],
  category: string
): number {
  return expenses
    .filter(e => e.category === category)
    .reduce((sum, e) => sum + e.amount, 0)
}

export const SummaryStats: React.FC<SummaryStatsProps> = ({ expenses }) => {
  const totalSpent = useMemo(() => calculateTotalSpent(expenses), [expenses])
  const highestExpense = useMemo(() => getHighestExpense(expenses), [expenses])
  const mostUsed = useMemo(() => getMostUsedCategory(expenses), [expenses])

  return (
    <div className="stats-grid">
      {/* Total Spent Card */}
      <div className="stat-card">
        <div className="stat-icon-wrapper bg-indigo-500/10 text-indigo-500">
          <Wallet className="w-5 h-5" />
        </div>
        <div className="stat-content">
          <span className="stat-label">Total Spent</span>
          <h3 className="stat-value">
            ₹{totalSpent.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h3>
          <span className="stat-subtext">Across {expenses.length} total entries</span>
        </div>
      </div>

      {/* Highest Expense Card */}
      <div className="stat-card">
        <div className="stat-icon-wrapper bg-rose-500/10 text-rose-500">
          <TrendingUp className="w-5 h-5" />
        </div>
        <div className="stat-content">
          <span className="stat-label">Highest Expense</span>
          <h3 className="stat-value">
            {highestExpense ? (
              `₹${highestExpense.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
            ) : (
              '₹0.00'
            )}
          </h3>
          <span className="stat-subtext truncate" title={highestExpense?.title ?? 'No expenses yet'}>
            {highestExpense ? highestExpense.title : 'No records logged'}
          </span>
        </div>
      </div>

      {/* Most Used Category Card */}
      <div className="stat-card">
        <div className="stat-icon-wrapper bg-amber-500/10 text-amber-500">
          <Award className="w-5 h-5" />
        </div>
        <div className="stat-content">
          <span className="stat-label">Top Category</span>
          <h3 className="stat-value">{mostUsed.category}</h3>
          <span className="stat-subtext">
            {mostUsed.count > 0 ? `${mostUsed.count} transactions recorded` : 'No transactions'}
          </span>
        </div>
      </div>

      {/* Transaction Count Card */}
      <div className="stat-card">
        <div className="stat-icon-wrapper bg-emerald-500/10 text-emerald-500">
          <Hash className="w-5 h-5" />
        </div>
        <div className="stat-content">
          <span className="stat-label">Average / Entry</span>
          <h3 className="stat-value">
            ₹
            {expenses.length > 0
              ? (totalSpent / expenses.length).toLocaleString('en-IN', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              : '0.00'}
          </h3>
          <span className="stat-subtext">{expenses.length} tracked entries</span>
        </div>
      </div>
    </div>
  )
}

export default SummaryStats
