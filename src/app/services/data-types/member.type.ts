import { Song, SongSheet } from './common.types';

export type Signin = {
  code: number;
  point?: number;
  msg?: string;
}

export type User = {
  // 等级
  level?: number;

  // 听歌记录
  listenSongs?: number;

  profile: {
    userId: number;
    nickname: string;
    avatarUrl: string;
    backgroundUrl: string;
    signature: string;

    // 性别
    gender: number;

    // 粉丝
    followeds: number;

    // 关注
    follows: number;

    // 动态
    eventCount: number;
  };
};


export type recordVal = {
  playCount: number;
  score: number;
  song: Song;
};

type recordKeys = 'weekData' | 'allData';

export type UserRecord = {
  [key in recordKeys]: recordVal[];
}

export type UserSheet = {
  self: SongSheet[],
  subscribed: SongSheet[]
}