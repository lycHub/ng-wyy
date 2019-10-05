export function isEmptyObject(obj: Object): boolean {
  return JSON.stringify(obj) === '{}';
}
