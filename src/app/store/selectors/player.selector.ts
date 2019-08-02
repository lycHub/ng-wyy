import { PlayerState } from '../reducers/player.reducer';
import { createSelector } from '@ngrx/store';

const selectPlayerStates = (state: PlayerState) => state;

// export const getPlaying = createSelector(selectPlayerStates, (state: PlayerState) => state.playing);
export const getPlayList = createSelector(selectPlayerStates, (state: PlayerState) => state.playList);
export const getSongList = createSelector(selectPlayerStates, (state: PlayerState) => state.songList);
export const getPlayMode = createSelector(selectPlayerStates, (state: PlayerState) => state.playMode);
export const getCurrentIndex = createSelector(selectPlayerStates, (state: PlayerState) => state.currentIndex);
export const getCurrentAction = createSelector(selectPlayerStates, (state: PlayerState) => state.currentAction);

export const getCurrentSong = createSelector(selectPlayerStates, ({ playList, currentIndex }: PlayerState) => playList[currentIndex]);