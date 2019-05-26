/*export type HttpRes<T> = {
  code: number;
  [key: string]: T;
}*/


export type Banner = {
  targetId: number;
  url: string;
  imageUrl: string;
  bgColor?: string;
}

export type HotTag = {
  id: number;
  name: string;
  position: number;
}

export type SongItem = {
  id: number;
  name: string;
  picUrl: string;
  playCount: number;
}