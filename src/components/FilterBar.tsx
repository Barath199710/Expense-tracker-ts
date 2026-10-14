// src/components/FilterBar.tsx
import React from 'react'
import type { FilterBarProps, Category, FilterType, SortField } from '../types'
import {
  Search,
  ArrowUpDown,
  Download,
  CalendarDays,
  Filter
} from 'lucide-react'

const CATEGORIES: (Category | 'All')[] = [
  'All',
  'Food',
  'Transport',
  'Shopping',
  'Health',
  'Education',
  'Other',
]

const TIME_FILTERS: { label: string; value: FilterType }[] = [
  { label: 'All Time', value: 'all' },
  { label: 'This Week', value: 'week' },
  { label: 'This Month', value: 'month' },
]

const SORT_FIELDS: { label: string; value: SortField }[] = [
  { label: 'Date', value: 'date' },
  { label: 'Amount', value: 'amount' },
  { label: 'Title', value: 'title' },
  { label: 'Category', value: 'category' },
]

export const FilterBar: React.FC<FilterBarProps> = ({
  selectedCategory,
  onSelectCategory,
  selectedTimeFilter,
  onSelectTimeFilter,
  searchTerm,
  onSearchChange,
  sortField,
  onSortFieldChange,
  sortOrder,
  onToggleSortOrder,
  onExportCsv,
}) => {
  // Typed search input change handler
  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
    onSearchChange(e.target.value)
  }

  // Typed sort field change handler
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    onSortFieldChange(e.target.value as SortField)
  }

  return (
    <div className="filter-bar-container">
      {/* Top row: Search input, Sort options, and CSV Export button */}
      <div className="filter-top-row">
        {/* Search Input */}
        <div className="search-box">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search by title or note..."
            value={searchTerm}
            onChange={handleSearchInput}
            className="search-input"
          />
        </div>

        {/* Sort Controls */}
        <div className="sort-controls">
          <label htmlFor="sortField" className="sort-label">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span>Sort by:</span>
          </label>
          <select
            id="sortField"
            value={sortField}
            onChange={handleSortChange}
            className="sort-select"
          >
            {SORT_FIELDS.map(f => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>

          <button
            type="button"
            className="sort-order-btn"
            onClick={onToggleSortOrder}
            title={`Current order: ${sortOrder === 'asc' ? 'Ascending' : 'Descending'}. Click to toggle.`}
            aria-label="Toggle sort order"
          >
            {sortOrder === 'asc' ? '↑ Asc' : '↓ Desc'}
          </button>
        </div>

        {/* Export CSV Button */}
        <button
          type="button"
          onClick={onExportCsv}
          className="btn-export-csv"
          title="Export filtered expenses to CSV file"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Middle row: Time Period Pills */}
      <div className="filter-pills-row">
        <div className="filter-group-header">
          <CalendarDays className="w-4 h-4 text-slate-400" />
          <span>Period:</span>
        </div>
        <div className="pill-group">
          {TIME_FILTERS.map(t => (
            <button
              key={t.value}
              type="button"
              className={`filter-pill ${selectedTimeFilter === t.value ? 'pill-active' : ''}`}
              onClick={() => onSelectTimeFilter(t.value)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom row: Category Filter Pills */}
      <div className="filter-pills-row">
        <div className="filter-group-header">
          <Filter className="w-4 h-4 text-slate-400" />
          <span>Category:</span>
        </div>
        <div className="pill-group flex-wrap">
          {CATEGORIES.map(category => {
            const isSelected =
              category === 'All'
                ? selectedCategory === 'all' || selectedCategory === 'All'
                : selectedCategory === category

            return (
              <button
                key={category}
                type="button"
                className={`filter-pill ${isSelected ? 'pill-active' : ''}`}
                onClick={() => onSelectCategory(category === 'All' ? 'all' : category)}
              >
                {category}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default FilterBar
