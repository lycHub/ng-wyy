import { Injectable } from '@angular/core';
import { AppStoreModule } from '.';
import { Store, select } from '@ngrx/store';
import { SetSongList, SetPlayList, SetCurrentIndex, SetCurrentAction } from './actions/player.actions';
import { shuffle, findIndex } from '../utils/array';
import { PlayerState, CurrentActions } from './reducers/player.reducer';
import {Song} from "../service/data-modals/common.models";
import { MemberState, ModalTypes, ShareParams } from './reducers/member.reducer';
import { SetModalType, SetModalVisible, SetLikeId, SetShareParams } from './actions/member.actions';

@Injectable({
  providedIn: AppStoreModule
})
export class MultipleReducersService {
  private playState: PlayerState;
  private memberState: MemberState;
  constructor(private store$: Store<AppStoreModule>) {
    this.store$.pipe(select('player')).subscribe(res => this.playState = res);
    this.store$.pipe(select('member')).subscribe(res => this.memberState = res);
  }

  // 选择播放列表
  selectPlay({ list, index }: {list: Song[]; index: number}) {
    this.store$.dispatch(SetSongList({ list }));
    let trueIndex = index;
    let trueList = list;
    if (this.playState.playMode.type === 'random') {
      trueList = shuffle(list || []);
      trueIndex = findIndex(trueList, list[index]);
    }
    this.store$.dispatch(SetPlayList({ list: trueList }));
    this.store$.dispatch(SetCurrentIndex({ index: trueIndex }));
    this.store$.dispatch(SetCurrentAction({ action: CurrentActions.Play }));
  }
  
  
  // 添加一首歌
  insertSong(song: Song, play) {
    const playlist = this.playState.playList.slice();
    const songList = this.playState.songList.slice();
    let insertIndex = this.playState.currentIndex;
    const pIndex = findIndex(playlist, song);
    if (pIndex > -1) {  // 如果有这首歌
      if (play) {
        insertIndex = pIndex;
      }
    }else {
      songList.push(song);
      playlist.push(song);
      if (play) {
        insertIndex = songList.length - 1;
      }
      this.store$.dispatch(SetSongList({ list: songList }));
      this.store$.dispatch(SetPlayList({ list: playlist }));
    }
    // console.log(currentIndex, this.playState.currentIndex);
    if (insertIndex !== this.playState.currentIndex) {
      this.store$.dispatch(SetCurrentIndex({ index: insertIndex }));
      this.store$.dispatch(SetCurrentAction({ action: CurrentActions.Play }));
    }else{
      this.store$.dispatch(SetCurrentAction({ action: CurrentActions.Add }));
    }
  }
  
  
  // 添加多首歌
  insertSongs(songs: Song[]) {
    const playlist = this.playState.playList.slice();
    const songList = this.playState.songList.slice();
    songs.forEach(item => {
      const pIndex = findIndex(playlist, item);
      if (pIndex === -1) {
        songList.push(item);
        playlist.push(item);
      }
    });
    this.store$.dispatch(SetSongList({ list: songList }));
    this.store$.dispatch(SetPlayList({ list: playlist }));
    this.store$.dispatch(SetCurrentAction({ action: CurrentActions.Add }));
  }


  // 删除列表中的一首歌
  deleteSong(song: Song) {
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
    this.store$.dispatch(SetCurrentAction({ action: CurrentActions.Delete }));
  }

  clearSong() {
    this.store$.dispatch(SetSongList({ list: [] }));
    this.store$.dispatch(SetPlayList({ list: [] }));
    this.store$.dispatch(SetCurrentIndex({ index: -1 }));
    this.store$.dispatch(SetCurrentAction({ action: CurrentActions.Clear }));
  }



  // 显示弹窗
  showModal(modalType: ModalTypes) {
    this.store$.dispatch(SetModalType({ modalType }));
    this.store$.dispatch(SetModalVisible({ visible: true }));
  }


  // 收藏歌单
  likeSheet(id: number) {
    this.store$.dispatch(SetModalType({ modalType: ModalTypes.Like }));
    this.store$.dispatch(SetLikeId({ id }));
  }

  // 分享
  share(params: ShareParams) {
    this.store$.dispatch(SetModalType({ modalType: ModalTypes.Share }));
    this.store$.dispatch(SetShareParams({ params }));
    this.store$.dispatch(SetModalVisible({ visible: true }));
  }
}
