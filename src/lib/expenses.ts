import { isDateInRange } from "@/lib/date";
import {
  type Expense,
  type ExpenseFilters,
  type ExpenseFormInput,
  type ExpenseCategory,
  EXPENSE_CATEGORIES,
} from "@/types/expense";

export type ValidationErrors = Partial<Record<keyof ExpenseFormInput, string>>;

export type ExpenseSummary = {
  totalSpending: number;
  currentMonthSpending: number;
  topCategory: ExpenseCategory | null;
  topCategoryAmount: number;
  byCategory: Record<ExpenseCategory, number>;
  recentMonthTrend: Array<{
    label: string;
    total: number;
  }>;
};

export function getInitialFormState(): ExpenseFormInput {
  const today = new Date().toISOString().split("T")[0];

  return {
    date: today,
    amount: "",
    category: "Food",
    description: "",
  };
}

export function validateExpenseInput(input: ExpenseFormInput): ValidationErrors {
  const errors: ValidationErrors = {};
  const amount = Number(input.amount);

  if (!input.date) {
    errors.date = "Date is required.";
  }

  if (!input.amount) {
    errors.amount = "Amount is required.";
  } else if (!Number.isFinite(amount) || amount <= 0) {
    errors.amount = "Amount must be greater than 0.";
  } else if (amount > 1_000_000) {
    errors.amount = "Amount must be below 1,000,000.";
  }

  if (!input.description.trim()) {
    errors.description = "Description is required.";
  } else if (input.description.trim().length > 160) {
    errors.description = "Description must be 160 characters or fewer.";
  }

  return errors;
}

export function hasValidationErrors(errors: ValidationErrors): boolean {
  return Object.keys(errors).length > 0;
}

export function buildExpense(
  input: ExpenseFormInput,
  existing?: Expense
): Expense {
  const timestamp = new Date().toISOString();

  return {
    id: existing?.id ?? crypto.randomUUID(),
    date: input.date,
    amount: Number(input.amount),
    category: input.category,
    description: input.description.trim(),
    createdAt: existing?.createdAt ?? timestamp,
    updatedAt: timestamp,
  };
}

export function filterExpenses(expenses: Expense[], filters: ExpenseFilters): Expense[] {
  const normalizedSearch = filters.search.trim().toLowerCase();

  return expenses
    .filter((expense) => {
      if (filters.category !== "All" && expense.category !== filters.category) {
        return false;
      }

      if (!isDateInRange(expense.date, filters.fromDate, filters.toDate)) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      const searchable = `${expense.description} ${expense.category}`.toLowerCase();
      return searchable.includes(normalizedSearch);
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getExpenseSummary(expenses: Expense[]): ExpenseSummary {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const byCategory = EXPENSE_CATEGORIES.reduce(
    (acc, category) => {
      acc[category] = 0;
      return acc;
    },
    {} as Record<ExpenseCategory, number>
  );

  let totalSpending = 0;
  let currentMonthSpending = 0;

  for (const expense of expenses) {
    totalSpending += expense.amount;
    byCategory[expense.category] += expense.amount;

    const date = new Date(expense.date);
    if (
      !Number.isNaN(date.getTime()) &&
      date.getMonth() === currentMonth &&
      date.getFullYear() === currentYear
    ) {
      currentMonthSpending += expense.amount;
    }
  }

  const topCategoryEntry = Object.entries(byCategory).sort(([, a], [, b]) => b - a)[0];

  const recentMonthTrend = Array.from({ length: 6 }).map((_, index) => {
    const target = new Date(currentYear, currentMonth - (5 - index), 1);
    const label = target.toLocaleDateString("en-US", {
      month: "short",
      year: "2-digit",
    });

    const total = expenses
      .filter((expense) => {
        const date = new Date(expense.date);
        return (
          !Number.isNaN(date.getTime()) &&
          date.getMonth() === target.getMonth() &&
          date.getFullYear() === target.getFullYear()
        );
      })
      .reduce((sum, expense) => sum + expense.amount, 0);

    return { label, total };
  });

  return {
    totalSpending,
    currentMonthSpending,
    topCategory: (topCategoryEntry?.[0] as ExpenseCategory | undefined) ?? null,
    topCategoryAmount: topCategoryEntry?.[1] ?? 0,
    byCategory,
    recentMonthTrend,
  };
}

export function toCsv(expenses: Expense[]): string {
  const headers = ["Date", "Amount", "Category", "Description"];
  const rows = expenses.map((expense) => [
    expense.date,
    expense.amount.toFixed(2),
    expense.category,
    escapeCsvValue(expense.description),
  ]);

  return [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
}

function escapeCsvValue(value: string): string {
  const escaped = value.replaceAll('"', '""');
  return `"${escaped}"`;
}
