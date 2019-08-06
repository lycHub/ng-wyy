export type User = {
  level?: number;
  listenSongs?: number;
  profile: {
    userId: number;
    nickname: string;
    avatarUrl: string;
    backgroundUrl: string;

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