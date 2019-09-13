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




// 歌手
export type Singer = {
  id: number;
  name: string;
  picUrl: string;
  albumSize: number;
}


// 歌曲
export type Song = {
  id: number;
  name: string;
  url: string;
  ar: Singer[];
  al: { id: number; name: string; picUrl: string };
  dt: number;
}


// 播放地址
export type SongUrl = {
  id: number;
  url: string;
}


// 歌单
export type SongSheet = {
  id: number;
  name: string;
  picUrl: string;
  playCount: number;
  tracks: Song[];
}


// 歌词
export type Lyric = {
  lyric: string;
  tlyric: string;
}