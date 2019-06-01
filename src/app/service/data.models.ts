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

export type Song = {
  id: number;
  name: string;
  picUrl: string;
  playCount: number;
}



export interface SongSheet {
  id: number;
  name: string;
  ar: Singer[];
}

export type Singer = {
  id: number;
  name: string;
}


export type SongUrl = {
  id: number;
  url: string;
}
