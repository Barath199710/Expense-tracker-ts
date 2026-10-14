// src/types/index.ts
// Centralized Type & Interface definitions for Expense Tracker

// 1. Category Union Type
export type Category =
  | 'Food'
  | 'Transport'
  | 'Shopping'
  | 'Health'
  | 'Education'
  | 'Other'

// 2. Filter Types for time period filtering
export type FilterType = 'all' | 'week' | 'month'

// 3. Sorting options
export type SortField = 'date' | 'amount' | 'title' | 'category'
export type SortOrder = 'asc' | 'desc'

// 4. Core Expense Interface
export interface Expense {
  id: number
  title: string
  amount: number
  category: Category // Enforces only valid Category strings
  date: string       // YYYY-MM-DD
  note?: string      // Optional note property indicated by '?'
}

// 5. Form Input Data Type
export interface ExpenseFormData {
  title: string
  amount: string
  category: Category
  date: string
  note: string
}

// 6. Generic Form Errors Map
export type FormErrors<T> = Partial<Record<keyof T, string>>

// 7. Toast Notification Types
export type ToastType = 'success' | 'info' | 'warning' | 'error'

export interface ToastMessage {
  id: string
  type: ToastType
  message: string
}

// 8. Theme Types
export type Theme = 'light' | 'dark'

export interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

// 9. Summary Statistics Data
export interface SummaryStatsData {
  totalSpent: number
  highestExpense: Expense | null
  mostUsedCategory: Category | 'None'
  expenseCount: number
}

// 10. Generic API Response Wrapper (Demonstrating Generics & Axios)
export interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
}

// 11. Chart Visualization Data Type
export interface CategoryChartData {
  category: Category
  amount: number
  count: number
  fill: string
}

// 12. Component Props Interfaces
export interface ExpenseCardProps {
  expense: Expense
  onDelete: (id: number) => void
  onEdit?: (expense: Expense) => void
}

export interface ExpenseListProps {
  expenses: Expense[]
  onDelete: (id: number) => void
  onEdit: (expense: Expense) => void
}

export interface ExpenseFormProps {
  onSubmit: (expenseData: Omit<Expense, 'id'>) => void
  editingExpense: Expense | null
  onCancelEdit: () => void
}

export interface FilterBarProps {
  selectedCategory: string
  onSelectCategory: (category: string) => void
  selectedTimeFilter: FilterType
  onSelectTimeFilter: (filter: FilterType) => void
  searchTerm: string
  onSearchChange: (search: string) => void
  sortField: SortField
  onSortFieldChange: (field: SortField) => void
  sortOrder: SortOrder
  onToggleSortOrder: () => void
  onExportCsv: () => void
}

export interface SummaryStatsProps {
  expenses: Expense[]
}

export interface ToastContainerProps {
  toasts: ToastMessage[]
  onDismiss: (id: string) => void
}
