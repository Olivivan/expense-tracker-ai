import {
  hasValidationErrors,
  type ValidationErrors,
} from "@/lib/expenses";
import { EXPENSE_CATEGORIES, type Expense, type ExpenseFormInput } from "@/types/expense";

type ExpenseFormProps = {
  input: ExpenseFormInput;
  errors: ValidationErrors;
  editingExpense: Expense | null;
  onChange: (next: ExpenseFormInput) => void;
  onSubmit: () => void;
  onCancelEdit: () => void;
  isSaving: boolean;
};

export function ExpenseForm({
  input,
  errors,
  editingExpense,
  onChange,
  onSubmit,
  onCancelEdit,
  isSaving,
}: ExpenseFormProps) {
  const isInvalid = hasValidationErrors(errors);

  return (
    <section className="rounded-2xl border border-slate-200/70 bg-white/85 p-5 shadow-sm backdrop-blur">
      <div className="flex items-start justify-between gap-4">
        <h2 className="text-lg font-semibold text-slate-900">
          {editingExpense ? "Edit Expense" : "Add Expense"}
        </h2>
        {editingExpense ? (
          <button
            type="button"
            onClick={onCancelEdit}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
          >
            Cancel
          </button>
        ) : null}
      </div>

      <form
        className="mt-4 grid gap-3 md:grid-cols-2"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-slate-700">Date</span>
          <input
            type="date"
            value={input.date}
            max={new Date().toISOString().split("T")[0]}
            onChange={(event) => onChange({ ...input, date: event.target.value })}
            className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
          />
          {errors.date ? <span className="text-xs text-rose-600">{errors.date}</span> : null}
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-slate-700">Amount (USD)</span>
          <input
            type="number"
            step="0.01"
            min="0"
            inputMode="decimal"
            value={input.amount}
            onChange={(event) => onChange({ ...input, amount: event.target.value })}
            placeholder="0.00"
            className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
          />
          {errors.amount ? <span className="text-xs text-rose-600">{errors.amount}</span> : null}
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-slate-700">Category</span>
          <select
            value={input.category}
            onChange={(event) =>
              onChange({
                ...input,
                category: event.target.value as ExpenseFormInput["category"],
              })
            }
            className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
          >
            {EXPENSE_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm md:col-span-2">
          <span className="font-medium text-slate-700">Description</span>
          <input
            type="text"
            value={input.description}
            onChange={(event) => onChange({ ...input, description: event.target.value })}
            placeholder="Example: Groceries for the week"
            className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
          />
          {errors.description ? (
            <span className="text-xs text-rose-600">{errors.description}</span>
          ) : null}
        </label>

        <div className="md:col-span-2 flex items-center gap-3 pt-1">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSaving ? "Saving..." : editingExpense ? "Save Changes" : "Add Expense"}
          </button>
          {!editingExpense && isInvalid ? (
            <span className="text-xs text-slate-500">Please fix validation issues.</span>
          ) : null}
        </div>
      </form>
    </section>
  );
}
