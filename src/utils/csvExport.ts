// src/utils/csvExport.ts
import type { Expense } from '../types'

/**
 * Converts an array of typed Expense items into a clean CSV string
 * and triggers a file download in the browser.
 */
export function exportExpensesToCsv(expenses: Expense[], filename = 'expenses.csv'): void {
  if (expenses.length === 0) {
    return
  }

  // Headers
  const headers: (keyof Expense)[] = ['id', 'title', 'amount', 'category', 'date', 'note']
  const headerRow = headers.map(h => `"${h.toUpperCase()}"`).join(',')

  // Data rows
  const rows = expenses.map(expense => {
    return [
      expense.id,
      `"${expense.title.replace(/"/g, '""')}"`,
      expense.amount.toFixed(2),
      `"${expense.category}"`,
      `"${expense.date}"`,
      `"${(expense.note ?? '').replace(/"/g, '""')}"`,
    ].join(',')
  })

  const csvContent = [headerRow, ...rows].join('\r\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
