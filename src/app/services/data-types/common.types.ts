export type Banner = {
  targetId: number;
  url: string;
  imageUrl: string;
}


export type HotTag = {
  id: number;
  name: string;
  position: number;
}


// 歌单
export type SongSheet = {
  id: number;
  name: string;
  picUrl: string;
  playCount: number;
}