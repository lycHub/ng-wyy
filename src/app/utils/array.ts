

import {getRandomInt} from "./number";
import {Song} from "../service/data-modals/common.models";
export function shuffle<T>(arr: T[]): T[] {
  let _arr = arr.slice();
  for (let i = 0; i < _arr.length; i++) {
  
    // 0和当前索引直接取一个随机数
    const j = getRandomInt([0, i]);
    [_arr[i], _arr[j]] = [_arr[j], _arr[i]];
  }
  return _arr;
}


export function findIndex(list: Song[], target: Song): number {
  return list.findIndex(item => item.id === target.id);
}