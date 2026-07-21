"use client";

import { useMemo, useState } from "react";
import { ExpenseFilters } from "@/components/ExpenseFilters";
import { ExpenseForm } from "@/components/ExpenseForm";
import { ExpenseList } from "@/components/ExpenseList";
import { Notice } from "@/components/Notice";
import { SpendingChart } from "@/components/SpendingChart";
import { SummaryCards } from "@/components/SummaryCards";
import {
  buildExpense,
  filterExpenses,
  getExpenseSummary,
  getInitialFormState,
  hasValidationErrors,
  toCsv,
  type ValidationErrors,
  validateExpenseInput,
} from "@/lib/expenses";
import { loadExpenses, saveExpenses } from "@/lib/storage";
import {
  type AppNotice,
  type Expense,
  type ExpenseFilters as Filters,
} from "@/types/expense";

const INITIAL_FILTERS: Filters = {
  search: "",
  category: "All",
  fromDate: "",
  toDate: "",
};

function getInitialExpenses(): Expense[] {
  try {
    return loadExpenses();
  } catch {
    return [];
  }
}

function getInitialNotice(): AppNotice | null {
  try {
    loadExpenses();
    return null;
  } catch {
    return {
      type: "error",
      message: "Could not read your saved expenses. Your storage may be corrupted.",
    };
  }
}

export default function Home() {
  const [expenses, setExpenses] = useState<Expense[]>(getInitialExpenses);
  const [filters, setFilters] = useState<Filters>(INITIAL_FILTERS);
  const [formInput, setFormInput] = useState(getInitialFormState());
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [notice, setNotice] = useState<AppNotice | null>(getInitialNotice);
  const [isSaving, setIsSaving] = useState(false);

  const filteredExpenses = useMemo(
    () => filterExpenses(expenses, filters),
    [expenses, filters]
  );

  const summary = useMemo(
    () => getExpenseSummary(filteredExpenses),
    [filteredExpenses]
  );

  const dateRangeError =
    filters.fromDate && filters.toDate && filters.fromDate > filters.toDate
      ? "From date cannot be later than To date."
      : null;

  function resetForm() {
    setFormInput(getInitialFormState());
    setErrors({});
    setEditingExpense(null);
  }

  function persistExpenses(nextExpenses: Expense[], successMessage?: string) {
    setExpenses(nextExpenses);

    try {
      saveExpenses(nextExpenses);
      if (successMessage) {
        setNotice({ type: "success", message: successMessage });
      }
    } catch {
      setNotice({
        type: "error",
        message: "Could not save changes to local storage.",
      });
    }
  }

  function handleSubmit() {
    const nextErrors = validateExpenseInput(formInput);
    setErrors(nextErrors);

    if (hasValidationErrors(nextErrors)) {
      return;
    }

    setIsSaving(true);

    const nextExpense = buildExpense(formInput, editingExpense ?? undefined);
    const nextExpenses = !editingExpense
      ? [nextExpense, ...expenses]
      : expenses.map((expense) =>
          expense.id === editingExpense.id ? nextExpense : expense
        );

    persistExpenses(
      nextExpenses,
      editingExpense ? "Expense updated successfully." : "Expense added successfully."
    );

    resetForm();
    setIsSaving(false);
  }

  function handleEdit(expense: Expense) {
    setEditingExpense(expense);
    setFormInput({
      date: expense.date,
      amount: expense.amount.toString(),
      category: expense.category,
      description: expense.description,
    });
    setErrors({});
  }

  function handleDelete(id: string) {
    const target = expenses.find((expense) => expense.id === id);
    if (!target) {
      return;
    }

    const confirmed = window.confirm(
      `Delete expense \"${target.description}\" (${target.category})?`
    );

    if (!confirmed) {
      return;
    }

    const nextExpenses = expenses.filter((expense) => expense.id !== id);
    persistExpenses(nextExpenses, "Expense deleted.");

    if (editingExpense?.id === id) {
      resetForm();
    }
  }

  function handleExport() {
    const csv = toCsv(filteredExpenses);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const stamp = new Date().toISOString().split("T")[0];

    link.href = url;
    link.setAttribute("download", `expenses-${stamp}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setNotice({ type: "success", message: "CSV export generated." });
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.22),transparent_50%),radial-gradient(circle_at_80%_0%,rgba(56,189,248,0.2),transparent_45%),linear-gradient(180deg,#f8fbff_0%,#f1f5f9_55%,#eef2ff_100%)]" />

      <main className="relative mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-8 sm:px-6 lg:px-8">
        <header className="rounded-3xl border border-slate-200/70 bg-white/80 px-6 py-7 shadow-sm backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">
            Personal Finance Dashboard
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-[rgb(0,255,0)] sm:text-4xl">
            FlowLedger Expense Tracker
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
            Track spending, monitor trends, and keep your finances under control with
            real-time insights.
          </p>
        </header>

        {notice ? <Notice notice={notice} onDismiss={() => setNotice(null)} /> : null}
        <SummaryCards summary={summary} />
        <SpendingChart summary={summary} />

        <div className="grid gap-4 xl:grid-cols-[1.05fr_1fr]">
          <div className="flex flex-col gap-4">
            <ExpenseForm
              input={formInput}
              errors={errors}
              editingExpense={editingExpense}
              onChange={setFormInput}
              onSubmit={handleSubmit}
              onCancelEdit={resetForm}
              isSaving={isSaving}
            />
            <ExpenseFilters
              filters={filters}
              onChange={setFilters}
              onReset={() => setFilters(INITIAL_FILTERS)}
            />
            {dateRangeError ? (
              <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-800">
                {dateRangeError}
              </p>
            ) : null}
          </div>

          <ExpenseList
            expenses={dateRangeError ? [] : filteredExpenses}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onExport={handleExport}
          />
        </div>
      </main>
    </div>
  );
}
