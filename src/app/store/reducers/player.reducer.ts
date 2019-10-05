import { SetPlayList, SetSongList, SetPlayMode, SetCurrentIndex, SetCurrentAction } from '../actions/player.actions';
import { PlayMode } from 'src/app/share/wy-ui/wy-player/player-type';
import { Song } from '../../services/data-types/common.types';
import { createReducer, on, Action } from '@ngrx/store';
import { SetPlaying } from '../actions/player.actions';

export enum CurrentActions {
  Add,
  Play,
  Delete,
  Clear,
  Other
}

export interface PlayState {
  // 播放状态
  playing: boolean;

  // 播放模式
  playMode: PlayMode;

  // 歌曲列表
  songList: Song[];

  // 播放列表
  playList: Song[];

  // 当前正在播放的索引
  currentIndex: number;

  // 当前操作
  currentAction: CurrentActions;
}


export const initialState: PlayState = {
  playing: false,
  songList: [],
  playList: [],
  playMode: { type: 'loop', label: '循环' },
  currentIndex: -1,
  currentAction: CurrentActions.Other
};

const reducer = createReducer(
  initialState,
  on(SetPlaying, (state, { playing }) => ({ ...state, playing })),
  on(SetPlayList, (state, { playList }) => ({ ...state,  playList })),
  on(SetSongList, (state, { songList }) => ({ ...state,  songList })),
  on(SetPlayMode, (state, { playMode }) => ({ ...state,  playMode })),
  on(SetCurrentIndex, (state, { currentIndex }) => ({ ...state,  currentIndex })),
  on(SetCurrentAction, (state, { currentAction }) => ({ ...state,  currentAction }))
);

export function playerReducer(state: PlayState, action: Action) {
  return reducer(state, action);
}
