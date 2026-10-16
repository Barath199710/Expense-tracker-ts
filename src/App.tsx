// src/App.tsx
import { useState, useMemo, useCallback } from "react";
import type { Expense, FilterType, SortField, SortOrder } from "./types";
import useLocalStorage from "./hooks/useLocalStorage";
import useToast from "./hooks/useToast";
import { useTheme } from "./context/ThemeContext";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import FilterBar from "./components/FilterBar";
import SummaryStats from "./components/SummaryStats";
import ToastContainer from "./components/ToastContainer";
import ExpenseChart from "./components/ExpenseChart";
import ExpenseEditModal from "./components/ExpenseEditModal";
import { exportExpensesToCsv } from "./utils/csvExport";
import { fetchSampleExpenses, syncExpensesToCloud } from "./services/api";
import {
  Sun,
  Moon,
  CloudUpload,
  Database,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";

// Default seed data for new users
const DEFAULT_INITIAL_EXPENSES: Expense[] = [
  {
    id: 1,
    title: "Supermarket Groceries",
    amount: 1450.0,
    category: "Food",
    date: "2026-10-12",
    note: "Fresh fruits, vegetables, and milk",
  },
  {
    id: 2,
    title: "Metro Rail Monthly Pass",
    amount: 850.0,
    category: "Transport",
    date: "2026-10-10",
    note: "Office daily commute",
  },
  {
    id: 3,
    title: "React & TypeScript Pro Course",
    amount: 1999.0,
    category: "Education",
    date: "2026-10-08",
    note: "Advanced enterprise type-safety training",
  },
  {
    id: 4,
    title: "Ergonomic Desk Chair Cushion",
    amount: 1290.0,
    category: "Shopping",
    date: "2026-10-06",
    note: "Workspace comfort upgrade",
  },
];

export function App() {
  // 1. Generic Persistent State
  const [expenses, setExpenses] = useLocalStorage<Expense[]>(
    "expenses-ts-data",
    DEFAULT_INITIAL_EXPENSES,
  );

  // 2. Typed UI state
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedTimeFilter, setSelectedTimeFilter] =
    useState<FilterType>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // 3. Custom Hooks
  const { theme, toggleTheme } = useTheme();
  const { toasts, addToast, removeToast } = useToast();

  // 4. Expense Handlers
  const handleAddOrUpdateExpense = useCallback(
    (expenseData: Omit<Expense, "id">): void => {
      if (editingExpense) {
        // Typed edit update
        setExpenses((prev) =>
          prev.map((item) =>
            item.id === editingExpense.id ? { id: item.id, ...expenseData } : item,
          ),
        );
        addToast(
          `Expense "${expenseData.title}" updated successfully!`,
          "success",
        );
        setEditingExpense(null);
        setIsEditModalOpen(false);
      } else {
        // Typed add new expense
        const newExpense: Expense = {
          id: Date.now(),
          ...expenseData,
        };
        setExpenses((prev) => [newExpense, ...prev]);
        addToast(`Expense "${expenseData.title}" recorded!`, "success");
      }
    },
    [editingExpense, setExpenses, addToast],
  );

  const handleDeleteExpense = useCallback(
    (id: number): void => {
      const target = expenses.find((e) => e.id === id);
      setExpenses((prev) => prev.filter((e) => e.id !== id));
      if (editingExpense?.id === id) {
        setEditingExpense(null);
        setIsEditModalOpen(false);
      }
      addToast(`Expense ${target ? `"${target.title}"` : ""} deleted`, "info");
    },
    [expenses, editingExpense, setExpenses, addToast],
  );

  const handleEditExpense = useCallback((expense: Expense): void => {
    setEditingExpense(expense);
    setIsEditModalOpen(true);
    // Instant modal editing directly in place - no jumping or scrolling away!
  }, []);

  const handleSaveFromModal = useCallback(
    (id: number, updatedData: Omit<Expense, "id">): void => {
      setExpenses((prev) =>
        prev.map((item) => (item.id === id ? { id, ...updatedData } : item))
      );
      addToast(`Expense "${updatedData.title}" updated successfully!`, "success");
      setEditingExpense(null);
      setIsEditModalOpen(false);
    },
    [setExpenses, addToast]
  );

  const handleCancelEdit = useCallback((): void => {
    setEditingExpense(null);
    setIsEditModalOpen(false);
  }, []);

  const handleClearAllExpenses = useCallback((): void => {
    if (
      window.confirm("Are you sure you want to delete all recorded expenses?")
    ) {
      setExpenses([]);
      setEditingExpense(null);
      addToast("All expenses cleared from storage", "warning");
    }
  }, [setExpenses, addToast]);

  // 5. Typed Axios API Calls
  const handleLoadSampleData = async (): Promise<void> => {
    setIsSyncing(true);
    try {
      const response = await fetchSampleExpenses();
      if (response.success) {
        setExpenses(response.data);
        addToast("Loaded sample data via typed Axios response!", "success");
      }
    } catch {
      addToast("Failed to load sample data", "error");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleCloudSync = async (): Promise<void> => {
    setIsSyncing(true);
    try {
      const response = await syncExpensesToCloud(expenses);
      if (response.success) {
        addToast(response.message, "success");
      }
    } catch {
      addToast("Sync to cloud failed", "error");
    } finally {
      setIsSyncing(false);
    }
  };

  // 6. CSV Export Handler
  const handleExportCsv = useCallback((): void => {
    if (expenses.length === 0) {
      addToast("No expense records to export", "warning");
      return;
    }
    exportExpensesToCsv(
      expenses,
      `expenses_${new Date().toISOString().slice(0, 10)}.csv`,
    );
    addToast("Expenses exported to CSV successfully!", "success");
  }, [expenses, addToast]);

  // 7. Time Filter Helper
  const isWithinTimePeriod = (dateStr: string, filter: FilterType): boolean => {
    if (filter === "all") return true;

    const expenseDate = new Date(dateStr);
    const now = new Date();

    if (filter === "month") {
      return (
        expenseDate.getFullYear() === now.getFullYear() &&
        expenseDate.getMonth() === now.getMonth()
      );
    }

    if (filter === "week") {
      const oneWeekAgo = new Date(now);
      oneWeekAgo.setDate(now.getDate() - 7);
      return expenseDate >= oneWeekAgo && expenseDate <= now;
    }

    return true;
  };

  // 8. Typed Comparator Function
  const compareExpenses = (
    a: Expense,
    b: Expense,
    field: SortField,
    order: SortOrder,
  ): number => {
    let result = 0;
    switch (field) {
      case "amount":
        result = a.amount - b.amount;
        break;
      case "date":
        result = new Date(a.date).getTime() - new Date(b.date).getTime();
        break;
      case "title":
        result = a.title.localeCompare(b.title);
        break;
      case "category":
        result = a.category.localeCompare(b.category);
        break;
    }
    return order === "asc" ? result : -result;
  };

  // 9. Filtered and Sorted Expenses
  const filteredAndSortedExpenses = useMemo(() => {
    return expenses
      .filter((item) => {
        // Category filter
        const matchCategory =
          selectedCategory === "all" || item.category === selectedCategory;

        // Time period filter
        const matchTime = isWithinTimePeriod(item.date, selectedTimeFilter);

        // Search text filter
        const query = searchTerm.toLowerCase().trim();
        const matchSearch =
          query === "" ||
          item.title.toLowerCase().includes(query) ||
          (item.note ? item.note.toLowerCase().includes(query) : false);

        return matchCategory && matchTime && matchSearch;
      })
      .sort((a, b) => compareExpenses(a, b, sortField, sortOrder));
  }, [
    expenses,
    selectedCategory,
    selectedTimeFilter,
    searchTerm,
    sortField,
    sortOrder,
  ]);

  return (
    <div className="app-container">
      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Main Top Header */}
      <header className="app-header">
        <div className="header-left">
          <div className="header-badge">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Track your expenses</span>
          </div>
          <h1 className="header-title">
            ExpenseTracker<span className="text-indigo-400"></span>
          </h1>
          <p className="header-desc">
            Type-safe personal expense management built with static typing,
            interfaces & generic hooks.
          </p>
        </div>

        <div className="header-actions">
          {/* Theme Toggle */}
          <button
            type="button"
            className="action-icon-btn"
            onClick={toggleTheme}
            title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5 text-amber-400" />
            ) : (
              <Moon className="w-5 h-5 text-indigo-600" />
            )}
          </button>

          {/* Axios Cloud Sync Button */}
          <button
            type="button"
            className="header-btn"
            onClick={handleCloudSync}
            disabled={isSyncing}
            title="Typed Axios POST: Sync to cloud storage"
          >
            <CloudUpload className="w-4 h-4" />
            <span>{isSyncing ? "Syncing..." : "Cloud Sync"}</span>
          </button>

          {/* Axios Sample Data Button */}
          <button
            type="button"
            className="header-btn"
            onClick={handleLoadSampleData}
            disabled={isSyncing}
            title="Typed Axios GET: Fetch sample records"
          >
            <Database className="w-4 h-4" />
            <span>Sample Data</span>
          </button>

          {/* Reset / Clear Data */}
          <button
            type="button"
            className="header-btn btn-danger-soft"
            onClick={handleClearAllExpenses}
            title="Reset and clear all saved expenses"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Clear All</span>
          </button>
        </div>
      </header>

      {/* Summary Statistics Section */}
      <section className="section-container" aria-label="Summary Statistics">
        <SummaryStats expenses={expenses} />
      </section>

      {/* Spending Analytics Chart (Recharts) */}
      <section className="section-container" aria-label="Visual Analytics">
        <ExpenseChart expenses={expenses} />
      </section>

      {/* Main Grid: Form (Left) & Filtered Records (Right) */}
      <main className="main-content-layout">
        {/* Left Column: Form */}
        <div className="form-column">
          <ExpenseForm
            onSubmit={handleAddOrUpdateExpense}
            editingExpense={editingExpense}
            onCancelEdit={handleCancelEdit}
          />
        </div>

        {/* Right Column: Filter Bar & Records List */}
        <div className="records-column">
          <FilterBar
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            selectedTimeFilter={selectedTimeFilter}
            onSelectTimeFilter={setSelectedTimeFilter}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            sortField={sortField}
            onSortFieldChange={setSortField}
            sortOrder={sortOrder}
            onToggleSortOrder={() =>
              setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
            }
            onExportCsv={handleExportCsv}
          />

          <ExpenseList
            expenses={filteredAndSortedExpenses}
            onDelete={handleDeleteExpense}
            onEdit={handleEditExpense}
            editingExpenseId={editingExpense?.id}
          />
        </div>
      </main>

      {/* Interactive In-Place Edit Modal (Zero jumping/scrolling) */}
      <ExpenseEditModal
        expense={editingExpense}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingExpense(null);
        }}
        onSave={handleSaveFromModal}
      />

      {/* Footer */}
      <footer className="app-footer">
        <p>
          EDABIP Task 21 · Production-Ready TypeScript Architecture · Zero
          runtime errors · Clean static typing
        </p>
      </footer>
    </div>
  );
}

export default App;
