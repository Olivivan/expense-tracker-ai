import { formatCurrency } from "@/lib/format";
import { type ExpenseSummary } from "@/lib/expenses";

type SummaryCardsProps = {
  summary: ExpenseSummary;
};

export function SummaryCards({ summary }: SummaryCardsProps) {
  const topCategoryText = summary.topCategory
    ? `${summary.topCategory} (${formatCurrency(summary.topCategoryAmount)})`
    : "No data";

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <article className="rounded-2xl border border-slate-200/70 bg-white/80 p-5 shadow-sm backdrop-blur">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
          Total Spending
        </p>
        <p className="mt-2 text-3xl font-semibold text-slate-900">
          {formatCurrency(summary.totalSpending)}
        </p>
      </article>

      <article className="rounded-2xl border border-slate-200/70 bg-white/80 p-5 shadow-sm backdrop-blur">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
          This Month
        </p>
        <p className="mt-2 text-3xl font-semibold text-slate-900">
          {formatCurrency(summary.currentMonthSpending)}
        </p>
      </article>

      <article className="rounded-2xl border border-slate-200/70 bg-white/80 p-5 shadow-sm backdrop-blur sm:col-span-2 xl:col-span-1">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
          Top Category
        </p>
        <p className="mt-2 text-xl font-semibold text-slate-900">{topCategoryText}</p>
      </article>
    </section>
  );
}
