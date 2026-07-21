import { type AppNotice } from "@/types/expense";

type NoticeProps = {
  notice: AppNotice;
  onDismiss: () => void;
};

export function Notice({ notice, onDismiss }: NoticeProps) {
  const classes =
    notice.type === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : "border-rose-200 bg-rose-50 text-rose-800";

  return (
    <div className={`flex items-center justify-between gap-4 rounded-xl border px-4 py-3 text-sm ${classes}`}>
      <p>{notice.message}</p>
      <button
        type="button"
        onClick={onDismiss}
        className="rounded-lg border border-current px-2.5 py-1 text-xs font-semibold opacity-80 transition hover:opacity-100"
      >
        Dismiss
      </button>
    </div>
  );
}
