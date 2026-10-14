# Task 21 – Introduction to TypeScript in React
## Personal Expense Tracker (TypeScript + React 19)

A production-ready, fully type-safe Personal Expense Tracker built using **React 19**, **Vite**, and **TypeScript 5.x**. Built with zero `.jsx` or `.js` files in `src/`, completely centralized type definitions, generic custom hooks, and strict compile-time verification.

---

## 🚀 Quick Start

```bash
# Navigate to project
cd C:\Project\expense-tracker-ts

# Install dependencies
npm install

# Start development server
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 📁 Component & Project Architecture

All files in `src/` are strictly `.ts` and `.tsx`:

```
src/
├── types/
│   └── index.ts            ← Centralized interfaces, union types, and generics
├── context/
│   └── ThemeContext.tsx    ← Typed Dark/Light mode context & provider
├── hooks/
│   ├── useLocalStorage.ts  ← Generic type-safe localStorage persistence hook
│   ├── useToast.ts         ← Typed toast notification manager hook
│   └── useForm.ts          ← Generic typed form & validation hook
├── components/
│   ├── ExpenseForm.tsx     ← Typed input events, validation, and edit state
│   ├── ExpenseCard.tsx     ← Typed props, category badges, edit/delete actions
│   ├── ExpenseList.tsx     ← Typed list grid with empty-state handling
│   ├── FilterBar.tsx       ← Typed category/time filters, sorting & CSV export
│   ├── SummaryStats.tsx    ← Typed pure metric calculation functions
│   ├── ExpenseChart.tsx    ← Typed category breakdown chart (Recharts)
│   └── ToastContainer.tsx  ← Typed toast notification container
├── services/
│   └── api.ts              ← Typed Axios client with generic ApiResponse<T>
├── utils/
│   └── csvExport.ts        ← Typed CSV conversion & download utility
├── App.tsx                 ← Main application coordinator
├── main.tsx                ← Application root wrapped in ThemeProvider
└── index.css               ← Enterprise responsive light/dark theme styling
```

---

## 🛡️ Zero `.jsx` / `.js` Verification

Run the following command in PowerShell to confirm zero `.jsx` or `.js` files exist in `src/`:

```powershell
Get-ChildItem -Path "src" -Recurse -Include *.js, *.jsx
```
*Result: 0 files found.*

---

## 📝 Task 21 Technical Write-up

### 1. Difference between an `interface` and a `type` in TypeScript? When do you use each?

| Feature | `interface` | `type` (Type Alias) |
| :--- | :--- | :--- |
| **Primary Purpose** | Defines the shape of an object or contract for classes. | Can alias any type: primitives, unions, tuples, intersections, functions, objects. |
| **Declaration Merging** | **Supported**: Multiple declarations with the same name automatically merge into one. | **Not supported**: Re-declaring a type alias with the same name throws a compiler error. |
| **Union Types** | Cannot directly define union types (e.g., `'Food' \| 'Transport'`). | Native support for union types (`type Category = 'Food' \| 'Transport'`). |
| **Extending / Inheritance** | Uses `extends` keyword (`interface A extends B`). | Uses intersection `&` operator (`type A = B & C`). |
| **Performance in IDE / TSC** | Interfaces are cached by name and type-checked faster by the TypeScript compiler. | Complex nested type intersections can be slower to evaluate. |

#### When to use which:
- **Use `interface`**: When defining object contracts, props for React components (`ExpenseCardProps`, `ExpenseFormProps`), and data entities (`Expense`, `ApiResponse<T>`). Interfaces allow easy extension and clear error messages.
- **Use `type`**: When defining union types (`Category`, `FilterType`, `SortField`), primitive aliases, function signatures, or mapped/utility types (`FormErrors<T> = Partial<Record<keyof T, string>>`).

---

### 2. What does the `?` symbol mean in an interface property? Give an example from your code.

In TypeScript, the `?` modifier marks a property as **optional**. It signifies that the property is not strictly required when instantiating or passing an object of that interface. Under the hood, TypeScript types an optional property `prop?: T` as `T | undefined`.

#### Example from `src/types/index.ts`:

```typescript
export interface Expense {
  id: number
  title: string
  amount: number
  category: Category
  date: string
  note?: string // '?' means note is optional; it can be string or undefined
}
```

In `ExpenseForm.tsx` and `ExpenseCard.tsx`, an expense can be created without any note. If a note is provided, it is rendered; if omitted (`undefined`), TypeScript prevents runtime crashes and allows safe optional chaining or fallback rendering (`expense.note ?? ''`).

---

### 3. What is a generic in TypeScript? Explain `useLocalStorage<T>` in your own words — what does `<T>` do?

A **generic** is a tool for creating reusable, type-safe components, functions, and interfaces that work with a variety of types rather than a single fixed type. Instead of hardcoding a type like `string` or losing safety with `any`, generics introduce a **type variable** (conventionally `<T>`) that captures the exact type passed in at call-time.

#### In `useLocalStorage<T>`:

```typescript
function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const [stored, setStored] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : initialValue
    } catch {
      return initialValue
    }
  })

  const setValue = (value: T | ((prev: T) => T)): void => {
    const valueToStore = value instanceof Function ? value(stored) : value
    setStored(valueToStore)
    localStorage.setItem(key, JSON.stringify(valueToStore))
  }

  return [stored, setValue]
}
```

#### What `<T>` does in your own words:
1. `<T>` acts as a placeholder parameter for the data type that will be stored in `localStorage`.
2. When called in `App.tsx`:
   ```typescript
   const [expenses, setExpenses] = useLocalStorage<Expense[]>('expenses-ts-data', [])
   ```
   TypeScript replaces every occurrence of `T` with `Expense[]`.
3. As a result:
   - `stored` is strictly typed as `Expense[]` (giving full array autocomplete for `.map()`, `.filter()`, etc.).
   - `setExpenses` will **only** accept an array of `Expense` items or an updater function returning `Expense[]`.
   - If someone tries to execute `setExpenses("invalid string")` or `setExpenses([ { id: "wrong_id" } ])`, TypeScript immediately blocks compilation with an error before the app can crash at runtime.

---

### 4. Give one real example from your code where TypeScript caught an error that JavaScript would have silently missed.

#### Real Example: Type Mismatch and Unused Import Catch

When running the TypeScript production build (`tsc -b && vite build`), the TypeScript compiler detected:

```
src/components/ExpenseCard.tsx(3,15): error TS6196: 'Expense' is declared but never used.
src/App.tsx(20,3): error TS6133: 'Trash' is declared but its value is never read.
```

Furthermore, in `ExpenseForm.tsx`, when passing input values to `onSubmit`:
```typescript
// JavaScript would silently pass string amounts from <input type="number">:
// e.target.value is ALWAYS a string in DOM HTML events!
// In JavaScript: "150" + "200" = "150200" (string concatenation bug!)

// TypeScript caught:
const payload: Omit<Expense, 'id'> = {
  title: formData.title,
  amount: formData.amount, // ❌ ERROR: Type 'string' is not assignable to type 'number'
  category: formData.category,
  date: formData.date
}
```
**What TypeScript showed:**
> `Type 'string' is not assignable to type 'number'. The expected type comes from property 'amount' which is declared here on type 'Omit<Expense, "id">'`

**Why JavaScript would have silently failed:**
HTML form `<input type="number">` returns a string (`"1500"`). In plain JavaScript, storing this string into an expense object causes calculating total spending (`sum + e.amount`) to perform string concatenation (`0 + "1500" = "01500"`) instead of numeric addition! TypeScript refused to compile until we explicitly parsed it with `parseFloat(formData.amount)`, preventing a silent business calculation bug in production.

---

## 📸 Real-time Error Tooltip Screenshot in VS Code

To capture your screenshot for submission:
1. Open `C:\Project\expense-tracker-ts\src\App.tsx` in VS Code.
2. At the top of `App()`, temporarily add this test line:
   ```typescript
   const testExp: Expense = {
     id: "100", // ❌ Type 'string' is not assignable to type 'number'
     title: "Test",
     amount: "invalid", // ❌ Type 'string' is not assignable to type 'number'
     category: "Fun", // ❌ Type '"Fun"' is not assignable to type 'Category'
     date: "2026-10-14"
   }
   ```
3. Hover your mouse cursor over `"Fun"` or `"100"`.
4. VS Code displays the red squiggly underline and the error tooltip:
   ```
   Type '"Fun"' is not assignable to type 'Category'.
   Did you mean '"Food"'?
   ```
5. Take a screenshot showing your VS Code window with this tooltip alongside the running app on `http://localhost:5173`.
