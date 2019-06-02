

import {getRandomInt} from "./number";
export function shuffle<T>(arr: T[]): T[] {
  let _arr = arr.slice();
  for (let i = 0; i < _arr.length; i++) {
  
    // 0和当前索引直接取一个随机数
    const j = getRandomInt([0, i]);
    [_arr[i], _arr[j]] = [_arr[j], _arr[i]];
  }
  return _arr;
}