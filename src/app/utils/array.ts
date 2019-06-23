

import {getRandomInt} from "./number";
import { SongList } from '../service/song/song.service';
export function shuffle<T>(arr: T[]): T[] {
  let _arr = arr.slice();
  for (let i = 0; i < _arr.length; i++) {
  
    // 0和当前索引直接取一个随机数
    const j = getRandomInt([0, i]);
    [_arr[i], _arr[j]] = [_arr[j], _arr[i]];
  }
  return _arr;
}


export function findIndex(list: SongList[], target: SongList): number {
  return list.findIndex(item => item.id === target.id);
}