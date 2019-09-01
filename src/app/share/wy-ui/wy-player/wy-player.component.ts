import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppStoreModule } from '../../../store/index';
import { getSongList, getPlayList, getCurrentIndex, getPlayMode, getCurrentSong } from '../../../store/selectors/player.selector';
import { Song } from '../../../services/data-types/common.types';
import { PlayMode } from './player-type';

@Component({
  selector: 'app-wy-player',
  templateUrl: './wy-player.component.html',
  styleUrls: ['./wy-player.component.less']
})
export class WyPlayerComponent implements OnInit {
  
  sliderValue = 35;
  bufferOffset = 70;

  songList: Song[];
  playList: Song[];
  currentIndex: number;
  currentSong: Song;

  duration: number;
  currentTime: number;

  @ViewChild('audio', { static: true }) private audio: ElementRef;
  private audioEl: HTMLAudioElement;


  constructor(
    private store$: Store<AppStoreModule>
  ) {
    const appStore$ = this.store$.pipe(select('player'));
    const stateArr = [{
      type: getSongList,
      cb: list => this.watchList(list, 'songList')
    }, {
      type: getPlayList,
      cb: list => this.watchList(list, 'playList')
    }, {
      type: getCurrentIndex,
      cb: index => this.watchCurrentIndex(index)
    }, {
      type: getPlayMode,
      cb: mode => this.watchPlayMode(mode)
    }, {
      type: getCurrentSong,
      cb: song => this.watchCurrentSong(song)
    }];

    stateArr.forEach(item => {
      appStore$.pipe(select(item.type)).subscribe(item.cb);
    })

  }

  ngOnInit() {
    this.audioEl = this.audio.nativeElement;
  }



  private watchList(list: Song[], type: string) {
    this[type] = list;
  }

  private watchCurrentIndex(index: number) {
    this.currentIndex = index;
  }

  private watchPlayMode(mode: PlayMode) {
    console.log('mode :', mode);
  }

  private watchCurrentSong(song: Song) {
    if (song) {
      this.currentSong = song;
      this.duration = song.dt / 1000;
      console.log('song :', song);
    }
  }


  onCanplay() {
    this.play();
  }


  onTimeUpdate(e: Event) {
    this.currentTime = (<HTMLAudioElement>e.target).currentTime;
  }

  private play() {
    this.audioEl.play();
  }


  get picUrl(): string {
    return this.currentSong ? this.currentSong.al.picUrl : '//s4.music.126.net/style/web2/img/default/default_album.jpg';
  }
}
