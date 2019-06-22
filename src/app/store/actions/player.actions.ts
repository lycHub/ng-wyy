import { createAction, props } from '@ngrx/store';
import { SongList } from 'src/app/service/song/song.service';
import { PlayMode } from 'src/app/share/wy-ui/wy-player/wy-player.component';

export const SetPlayList = createAction('[Player] Set playList', props<{ list: SongList[] }>());
export const SetPlaying = createAction('[Player] Set PlayIng', props<{ playing: boolean }>());
export const SetSongList = createAction('[Player] Set SongList', props<{ list: SongList[] }>());
export const SetPlayMode = createAction('[Player] Set PlayMode', props<{ mode: PlayMode }>());
export const SetCurrentIndex = createAction('[Player] Set CurrentIndex', props<{ index: number }>());
