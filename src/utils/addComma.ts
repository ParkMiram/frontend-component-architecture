export function addComma(value: number | string): string {
  const num = Number(value);

  if (isNaN(num)) return String(0);

  return num.toLocaleString();
}
