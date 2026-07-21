import { EXPENSE_CATEGORIES, type ExpenseFilters as Filters } from "@/types/expense";

type ExpenseFiltersProps = {
  filters: Filters;
  onChange: (next: Filters) => void;
  onReset: () => void;
};

export function ExpenseFilters({ filters, onChange, onReset }: ExpenseFiltersProps) {
  return (
    <section className="rounded-2xl border border-slate-200/70 bg-white/80 p-5 shadow-sm backdrop-blur">
      <div className="flex items-start justify-between gap-4">
        <h2 className="text-lg font-semibold text-slate-900">Search & Filters</h2>
        <button
          type="button"
          onClick={onReset}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
        >
          Reset
        </button>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-slate-700">Search</span>
          <input
            type="search"
            value={filters.search}
            onChange={(event) => onChange({ ...filters, search: event.target.value })}
            placeholder="Description or category"
            className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-slate-700">Category</span>
          <select
            value={filters.category}
            onChange={(event) =>
              onChange({
                ...filters,
                category: event.target.value as Filters["category"],
              })
            }
            className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
          >
            <option value="All">All</option>
            {EXPENSE_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-slate-700">From</span>
          <input
            type="date"
            value={filters.fromDate}
            onChange={(event) => onChange({ ...filters, fromDate: event.target.value })}
            className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-slate-700">To</span>
          <input
            type="date"
            value={filters.toDate}
            onChange={(event) => onChange({ ...filters, toDate: event.target.value })}
            className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
          />
        </label>
      </div>
    </section>
  );
}
