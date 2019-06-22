import { PlayerState } from '../reducers/player.reducer';
import { createSelector } from '@ngrx/store';

const selectPlayerStates = (state: PlayerState) => state;

export const SelectPlaying = createSelector(selectPlayerStates, (state: PlayerState) => state.playing);
export const SelectPlayList = createSelector(selectPlayerStates, (state: PlayerState) => state.playList);
export const SelectSongList = createSelector(selectPlayerStates, (state: PlayerState) => state.songList);
export const SelectPlayMode = createSelector(selectPlayerStates, (state: PlayerState) => state.playMode);
export const SelectCurrentIndex = createSelector(selectPlayerStates, (state: PlayerState) => state.currentIndex);