export type HttpForBack<T> = {
  code?: number;
  [key: string]: T;
}