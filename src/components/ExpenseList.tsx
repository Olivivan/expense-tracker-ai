import { formatCurrency, formatDate } from "@/lib/format";
import { type Expense } from "@/types/expense";

type ExpenseListProps = {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
  onExport: () => void;
};

export function ExpenseList({ expenses, onEdit, onDelete, onExport }: ExpenseListProps) {
  return (
    <section className="rounded-2xl border border-slate-200/70 bg-white/85 p-5 shadow-sm backdrop-blur">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Expense History</h2>
          <p className="mt-1 text-sm text-slate-600">
            {expenses.length} {expenses.length === 1 ? "expense" : "expenses"} in current view
          </p>
        </div>
        <button
          type="button"
          onClick={onExport}
          disabled={expenses.length === 0}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Export CSV
        </button>
      </div>

      {expenses.length === 0 ? (
        <div className="mt-5 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center text-sm text-slate-600">
          No expenses found. Add an expense or adjust your filters.
        </div>
      ) : (
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[620px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-[0.12em] text-slate-500">
                <th className="px-2 py-3 font-semibold">Date</th>
                <th className="px-2 py-3 font-semibold">Category</th>
                <th className="px-2 py-3 font-semibold">Description</th>
                <th className="px-2 py-3 text-right font-semibold">Amount</th>
                <th className="px-2 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense.id} className="border-b border-slate-100 text-slate-700">
                  <td className="px-2 py-3">{formatDate(expense.date)}</td>
                  <td className="px-2 py-3">{expense.category}</td>
                  <td className="px-2 py-3">{expense.description}</td>
                  <td className="px-2 py-3 text-right font-semibold text-slate-900">
                    {formatCurrency(expense.amount)}
                  </td>
                  <td className="px-2 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(expense)}
                        className="rounded-md border border-slate-300 px-2.5 py-1 text-xs font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(expense.id)}
                        className="rounded-md border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
