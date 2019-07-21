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

export interface Song {
  id: number;
  name: string;
  ar: Singer[];
  al: { id: number; name: string; picUrl: string; };    // 专辑信息
  dt: number;
}

export type SongSheet = {
  id: number;
  userId: number;
  name: string;
  picUrl?: string;
  coverImgUrl?: string;
  playCount: number;
  tags: string[];
  createTime: number;
  creator: { nickname: string; avatarUrl: string; };
  description: string;
  subscribedCount: number;
  shareCount: number;
  commentCount: number;
  tracks: Song[];
}


export type playlistInfo = {
  code: number;
  more: boolean;
  total: number;
  playlists: SongSheet[];
}




export type Singer = {
  id: number;
  name: string;
}


export type SongUrl = {
  id: number;
  url: string;
}

export type Lyric = {
  lyric: string;
  tlyric: string | null;
}
