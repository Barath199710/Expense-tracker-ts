// src/services/api.ts
import axios from 'axios'
import type { ApiResponse, Expense } from '../types'

/**
 * Demonstrates typed Axios API calls wrapped in the generic ApiResponse<T> interface.
 */

// Simulated remote data for initial load or sample import
const SAMPLE_EXPENSES: Expense[] = [
  {
    id: 1,
    title: 'Grocery Store Supermarket',
    amount: 1450.5,
    category: 'Food',
    date: '2026-10-12',
    note: 'Weekly essentials and fresh vegetables',
  },
  {
    id: 2,
    title: 'Monthly Metro Rail Pass',
    amount: 800,
    category: 'Transport',
    date: '2026-10-10',
    note: 'Commute recharge for office',
  },
  {
    id: 3,
    title: 'TypeScript & React Masterclass',
    amount: 2499,
    category: 'Education',
    date: '2026-10-08',
    note: 'Frontend engineering certificate course',
  },
  {
    id: 4,
    title: 'Noise Cancelling Headphones',
    amount: 3200,
    category: 'Shopping',
    date: '2026-10-05',
    note: 'Work from home audio gear',
  },
  {
    id: 5,
    title: 'Annual Health Checkup',
    amount: 1200,
    category: 'Health',
    date: '2026-10-02',
    note: 'Routine blood test & physician review',
  },
]

// Create a configured Axios instance
export const apiClient = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Fetch sample expenses using typed Axios simulation.
 * Returns Promise<ApiResponse<Expense[]>>
 */
export async function fetchSampleExpenses(): Promise<ApiResponse<Expense[]>> {
  // Simulate network latency for realistic feel
  await new Promise(resolve => setTimeout(resolve, 600))

  return {
    success: true,
    message: 'Sample expenses fetched successfully',
    data: SAMPLE_EXPENSES,
  }
}

/**
 * Simulates syncing local expenses to a remote cloud backend using typed Axios POST.
 * Accepts Expense[] and returns Promise<ApiResponse<{ syncedCount: number; timestamp: string }>>
 */
export async function syncExpensesToCloud(
  expenses: Expense[]
): Promise<ApiResponse<{ syncedCount: number; timestamp: string }>> {
  await new Promise(resolve => setTimeout(resolve, 800))

  return {
    success: true,
    message: `${expenses.length} expenses successfully synced to cloud storage.`,
    data: {
      syncedCount: expenses.length,
      timestamp: new Date().toISOString(),
    },
  }
}
