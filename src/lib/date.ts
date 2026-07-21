export function toIsoDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

export function isDateInRange(
  value: string,
  fromDate: string,
  toDate: string
): boolean {
  if (!fromDate && !toDate) {
    return true;
  }

  const target = new Date(value);

  if (Number.isNaN(target.getTime())) {
    return false;
  }

  if (fromDate) {
    const from = new Date(fromDate);
    if (!Number.isNaN(from.getTime()) && target < from) {
      return false;
    }
  }

  if (toDate) {
    const to = new Date(toDate);
    if (!Number.isNaN(to.getTime()) && target > to) {
      return false;
    }
  }

  return true;
}
