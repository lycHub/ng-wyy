export function getPercent(min: number, max: number, value: number): number {
  return ((value - min) / (max - min)) * 100;
}

export function ensureNumberInRange(num: number, min: number, max: number): number {
  if (isNaN(num) || num < min) {
    return min;
  } else if (num > max) {
    return max;
  } else {
    return num;
  }
}