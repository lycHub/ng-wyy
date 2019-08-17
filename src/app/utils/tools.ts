export function isEmptyObj(obj: Object): boolean {
  return JSON.stringify(obj) === "{}";
}