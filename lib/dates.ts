export const dateKeyFrom = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const parseDateKey = (key: string): Date => {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
};

export const isNextDay = (prev: string, current: string): boolean => {
  const prevDate = parseDateKey(prev);
  const currentDate = parseDateKey(current);
  const diff = currentDate.getTime() - prevDate.getTime();
  return diff === 24 * 60 * 60 * 1000;
};
