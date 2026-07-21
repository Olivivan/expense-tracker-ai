import { STORAGE_KEY } from "@/lib/constants";
import { type Expense } from "@/types/expense";

type StoredData = {
  version: number;
  expenses: Expense[];
};

const CURRENT_VERSION = 1;

export function loadExpenses(): Expense[] {
  if (typeof window === "undefined") {
    return [];
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return [];
  }

  const parsed = JSON.parse(raw) as StoredData;

  if (!parsed || !Array.isArray(parsed.expenses)) {
    return [];
  }

  return parsed.expenses;
}

export function saveExpenses(expenses: Expense[]): void {
  if (typeof window === "undefined") {
    return;
  }

  const payload: StoredData = {
    version: CURRENT_VERSION,
    expenses,
  };

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}
