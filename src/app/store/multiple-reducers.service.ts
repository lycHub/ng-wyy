import { Injectable } from '@angular/core';
import { AppStoreModule } from '.';
import { Store, select } from '@ngrx/store';
import { SongList } from '../service/song/song.service';
import { SetSongList, SetPlayList, SetCurrentIndex } from './actions/player.actions';
import { shuffle, findIndex } from '../utils/array';
import { PlayerState } from './reducers/player.reducer';

@Injectable({
  providedIn: AppStoreModule
})
export class MultipleReducersService {
  private playState: PlayerState;
  constructor(private store$: Store<AppStoreModule>) {
    this.store$.pipe(select('player')).subscribe(res => this.playState = res);
  }

  // 选择播放列表
  selectPlay({ list, index }: {list: SongList[]; index: number}) {
    this.store$.dispatch(SetSongList({ list }));
    let trueIndex = index;
    let trueList = list;
    if (this.playState.playMode.type === 'random') {
      trueList = shuffle(list || []);
      trueIndex = findIndex(trueList, list[index]);
    }
    this.store$.dispatch(SetPlayList({ list: trueList }));
    this.store$.dispatch(SetCurrentIndex({ index: trueIndex }));
  }
  
  
  // 删除列表中的一首歌
  insertSong(song: SongList, play) {
    const playlist = this.playState.playList.slice();
    const songList = this.playState.songList.slice();
    let currentIndex = this.playState.currentIndex;
    const pIndex = findIndex(playlist, song);
    if (pIndex > -1) {  // 如果有这首歌
      if (play) {
        currentIndex = pIndex;
      }
    }else {
      if (play) {
        currentIndex = pIndex + 1;
      }
      songList.push(song);
      playlist.push(song);
      this.store$.dispatch(SetSongList({ list: songList }));
      this.store$.dispatch(SetPlayList({ list: playlist }));
    }
    
    if (currentIndex !== this.playState.currentIndex) {
      this.store$.dispatch(SetCurrentIndex({ index: currentIndex }));
    }
  }


  // 删除列表中的一首歌
  deleteSong(song: SongList) {
    const playlist = this.playState.playList.slice();
    const songList = this.playState.songList.slice();
    let currentIndex = this.playState.currentIndex;
    const pIndex = findIndex(playlist, song);
    playlist.splice(pIndex, 1);
    const sIndex = findIndex(songList, song);
    songList.splice(sIndex, 1);
    if (currentIndex > pIndex || currentIndex === playlist.length) {
      currentIndex--;
    }

    this.store$.dispatch(SetSongList({ list: songList }));
    this.store$.dispatch(SetPlayList({ list: playlist }));
    this.store$.dispatch(SetCurrentIndex({ index: currentIndex }));
  }

  clearSong() {
    this.store$.dispatch(SetSongList({ list: [] }));
    this.store$.dispatch(SetPlayList({ list: [] }));
    this.store$.dispatch(SetCurrentIndex({ index: -1 }));
  }
}
