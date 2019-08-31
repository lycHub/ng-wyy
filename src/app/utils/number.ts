export function limitNumberInRange(val: number, min: number, max: number): number {
  return Math.min(Math.max(val, min), max);
}


export function getPercent(min: number, max: number, val: number): number {
  return ((val - min) / (max - min)) * 100;
}