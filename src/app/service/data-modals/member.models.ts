import { Song, SongSheet } from './common.models';

export type User = {
  level?: number;
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
}

type recordKey = 'allData' | 'weekData';
export type recordVal = {
  playCount: number;
  score: number;
  song: Song;
};
export type UserRecord = {
  [key in recordKey]: recordVal[];
};


export type UserSheet = {
  self: SongSheet[],
  subscribed: SongSheet[]
}