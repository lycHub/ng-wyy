export function limitNumberInRange(val: number, min: number, max: number): number {
  return Math.min(Math.max(val, min), max);
}