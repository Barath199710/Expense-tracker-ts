// src/components/ExpenseChart.tsx
import React, { useMemo } from 'react'
import type { Expense, Category, CategoryChartData } from '../types'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie,
  Legend,
} from 'recharts'
import { PieChart as PieIcon, BarChart3 } from 'lucide-react'

interface ExpenseChartProps {
  expenses: Expense[]
}

const CATEGORY_COLORS: Record<Category, string> = {
  Food: '#f59e0b',       // Amber
  Transport: '#3b82f6',  // Blue
  Shopping: '#ec4899',   // Pink
  Health: '#10b981',     // Emerald
  Education: '#8b5cf6',  // Purple
  Other: '#64748b',      // Slate
}

export const ExpenseChart: React.FC<ExpenseChartProps> = ({ expenses }) => {
  const [chartView, setChartView] = React.useState<'bar' | 'pie'>('bar')

  // Typed aggregation for chart data
  const chartData: CategoryChartData[] = useMemo(() => {
    const map: Record<Category, { amount: number; count: number }> = {
      Food: { amount: 0, count: 0 },
      Transport: { amount: 0, count: 0 },
      Shopping: { amount: 0, count: 0 },
      Health: { amount: 0, count: 0 },
      Education: { amount: 0, count: 0 },
      Other: { amount: 0, count: 0 },
    }

    expenses.forEach(e => {
      if (map[e.category]) {
        map[e.category].amount += e.amount
        map[e.category].count += 1
      }
    })

    return (Object.keys(map) as Category[])
      .map(cat => ({
        category: cat,
        amount: Number(map[cat].amount.toFixed(2)),
        count: map[cat].count,
        fill: CATEGORY_COLORS[cat],
      }))
      .filter(item => item.amount > 0)
  }, [expenses])

  if (chartData.length === 0) {
    return null
  }

  return (
    <div className="chart-card">
      <div className="chart-header">
        <div className="flex items-center gap-2">
          {chartView === 'bar' ? (
            <BarChart3 className="w-5 h-5 text-indigo-500" />
          ) : (
            <PieIcon className="w-5 h-5 text-indigo-500" />
          )}
          <h3 className="chart-title">Spending Breakdown by Category</h3>
        </div>

        <div className="chart-view-toggle">
          <button
            type="button"
            className={`toggle-btn ${chartView === 'bar' ? 'active' : ''}`}
            onClick={() => setChartView('bar')}
          >
            Bar
          </button>
          <button
            type="button"
            className={`toggle-btn ${chartView === 'pie' ? 'active' : ''}`}
            onClick={() => setChartView('pie')}
          >
            Pie
          </button>
        </div>
      </div>

      <div className="chart-content">
        <ResponsiveContainer width="100%" height={260}>
          {chartView === 'bar' ? (
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
              <XAxis dataKey="category" stroke="currentColor" fontSize={12} tickLine={false} />
              <YAxis
                stroke="currentColor"
                fontSize={12}
                tickFormatter={(val: number) => `₹${val}`}
                tickLine={false}
              />
              <Tooltip
                formatter={(val: unknown) => [
                  `₹${Number(val).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
                  'Spent',
                ]}
                contentStyle={{
                  backgroundColor: 'var(--card-bg)',
                  borderColor: 'var(--border-color)',
                  borderRadius: '8px',
                  color: 'var(--text-primary)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                }}
              />
              <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                {chartData.map(entry => (
                  <Cell key={`cell-${entry.category}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          ) : (
            <PieChart>
              <Pie
                data={chartData}
                dataKey="amount"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={80}
                innerRadius={45}
                paddingAngle={4}
              >
                {chartData.map(entry => (
                  <Cell key={`cell-pie-${entry.category}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                formatter={(val: unknown) => [
                  `₹${Number(val).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
                  'Total',
                ]}
                contentStyle={{
                  backgroundColor: 'var(--card-bg)',
                  borderColor: 'var(--border-color)',
                  borderRadius: '8px',
                  color: 'var(--text-primary)',
                }}
              />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default ExpenseChart
