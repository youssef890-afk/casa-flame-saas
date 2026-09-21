export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function formatPrice(value: number): string {
  return value.toFixed(2) + ' MAD';
}
