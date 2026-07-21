import { formatCurrency } from "@/lib/format";
import { type ExpenseSummary } from "@/lib/expenses";
import { EXPENSE_CATEGORIES } from "@/types/expense";

type SpendingChartProps = {
  summary: ExpenseSummary;
};

export function SpendingChart({ summary }: SpendingChartProps) {
  const maxCategoryTotal = Math.max(...Object.values(summary.byCategory), 1);
  const maxTrendValue = Math.max(...summary.recentMonthTrend.map((entry) => entry.total), 1);

  return (
    <section className="grid gap-4 lg:grid-cols-2">
      <article className="rounded-2xl border border-slate-200/70 bg-white/80 p-5 shadow-sm backdrop-blur">
        <h2 className="text-lg font-semibold text-slate-900">Category Breakdown</h2>
        <div className="mt-4 space-y-3">
          {EXPENSE_CATEGORIES.map((category) => {
            const amount = summary.byCategory[category];
            const width = (amount / maxCategoryTotal) * 100;

            return (
              <div key={category} className="space-y-1">
                <div className="flex items-center justify-between text-sm text-slate-700">
                  <span>{category}</span>
                  <span className="font-medium text-slate-900">{formatCurrency(amount)}</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-teal-400 to-cyan-500 transition-all"
                    style={{ width: `${width}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </article>

      <article className="rounded-2xl border border-slate-200/70 bg-white/80 p-5 shadow-sm backdrop-blur">
        <h2 className="text-lg font-semibold text-slate-900">6-Month Trend</h2>
        <div className="mt-4 flex h-44 items-end gap-3 rounded-xl bg-slate-50 p-3">
          {summary.recentMonthTrend.map((entry) => {
            const height = Math.max((entry.total / maxTrendValue) * 100, entry.total > 0 ? 8 : 0);

            return (
              <div key={entry.label} className="flex flex-1 flex-col items-center gap-2">
                <div className="relative flex h-full w-full items-end">
                  <div
                    className="w-full rounded-t-lg bg-slate-300 transition-all"
                    style={{ height: `${height}%` }}
                    title={`${entry.label}: ${formatCurrency(entry.total)}`}
                  />
                </div>
                <span className="text-xs font-medium text-slate-600">{entry.label}</span>
              </div>
            );
          })}
        </div>
      </article>
    </section>
  );
}
