export const EXPENSE_CATEGORIES = [
  "Food",
  "Transportation",
  "Entertainment",
  "Shopping",
  "Bills",
  "Other",
] as const;

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];

export type Expense = {
  id: string;
  date: string;
  amount: number;
  category: ExpenseCategory;
  description: string;
  createdAt: string;
  updatedAt: string;
};

export type ExpenseFormInput = {
  date: string;
  amount: string;
  category: ExpenseCategory;
  description: string;
};

export type ExpenseFilters = {
  search: string;
  category: ExpenseCategory | "All";
  fromDate: string;
  toDate: string;
};

export type AppNotice = {
  type: "success" | "error";
  message: string;
};
