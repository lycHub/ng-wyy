import { AfterViewInit, Component, ElementRef, Inject, OnChanges, OnDestroy, SimpleChanges, ViewChild } from '@angular/core';
import {SongList} from "../../../service/song/song.service";
import {fromEvent, Subscription, Observable, Subject} from "rxjs/index";
import {DOCUMENT} from "@angular/common";
import {shuffle} from "../../../utils/array";
import {Singer} from "../../../service/data.models";
import { WyPlayerPanelComponent } from './wy-player-panel/wy-player-panel.component';
import { Store, select } from '@ngrx/store';
import { AppStoreModule } from 'src/app/store';
import { getSongList, getPlayList, getCurrentSong, getPlayMode, getCurrentIndex } from 'src/app/store/selectors/player.selector';
import { SetCurrentIndex, SetPlayMode, SetPlayList } from '../../../store/actions/player.actions';
import { MultipleReducersService } from 'src/app/store/multiple-reducers.service';
import { NzModalService } from 'ng-zorro-antd';
import { takeUntil } from 'rxjs/operators';

// 播放模式
export type PlayMode = {
  type: 'loop' | 'random' | 'singleLoop',
  label: '循环' | '单曲循环' | '随机'
};


const modeTypes: PlayMode[] = [{
  type: 'loop',
  label: '循环'
}, {
  type: 'random',
  label: '随机'
}, {
  type: 'singleLoop',
  label: '单曲循环'
}];

@Component({
  selector: 'app-wy-player',
  templateUrl: './wy-player.component.html',
  styleUrls: ['./wy-player.component.less']
})
export class WyPlayerComponent implements OnChanges, AfterViewInit, OnDestroy {
  // @Input() songList: SongList[] = [];
  private songList: SongList[];
  
  private playList: SongList[];
  
  // 是否可以播放
  private songReady = false;
  
  // 播放状态vuex
  playing = false;
  
  // 当前播放的索引vuex
  currentIndex: number;
  
  // 正在播放vuex
  currentSong: SongList;
  
  
  // 播放时间
  currentTime: number;
  
  // 总时长
  duration: number;
  
  // 播放进度（百分比）
  percent = 0;
  
  // 缓冲进度（百分比）
  bufferPercent = 0;
 
 // 当前音量
  currentVol = 60;
  
  // 显示音量控件
  showVolPanel = false;
  
  // 是否点击了音量控件
  volClick = false;
  
  modeCount = 0;
  
  
  // 当前模式vuex
  currentMode: PlayMode;
  
  @ViewChild('audio', { static: true }) private audio: ElementRef;

  // WyPlayerPanelComponent不是静态的
  @ViewChild(WyPlayerPanelComponent, { static: false }) private playPanel: WyPlayerPanelComponent;
  private audioEl: HTMLAudioElement;
  
  private winClick$: Subscription;
  
  showPanel = false;

  private appStore$: Observable<AppStoreModule>;
  private destroy$ = new Subject<void>();

  constructor(@Inject(DOCUMENT) private doc: Document,
  private store$: Store<AppStoreModule>,
  private multipleReducerServe: MultipleReducersService,
  private modalService: NzModalService) {
    this.appStore$ = this.store$.pipe(select('player'), takeUntil(this.destroy$));
    const arr = [{
      type: getPlayMode,
      cb: mode => this.watchMode(mode)
    }, {
      type: getSongList,
      cb: list => this.watchList(list, 'songList')
    }, {
      type: getPlayList,
      cb: list => this.watchList(list, 'playList')
    }, {
      type: getCurrentIndex,
      cb: index => this.watchCurrentIndex(index)
    }, {
      type: getCurrentSong,
      cb: song => this.watchCurrentSong(song)
    }];
    arr.forEach(item => {
      this.appStore$.pipe(select(item.type)).subscribe(item.cb);
    });
    // this.appStore$.pipe(select(getPlayMode)).subscribe(mode => this.watchMode(mode));
    // this.appStore$.pipe(select(getSongList)).subscribe(list => this.watchList(list, 'songList'));
    // this.appStore$.pipe(select(getPlayList)).subscribe(list => this.watchList(list, 'playList'));
    // this.appStore$.pipe(select(getCurrentIndex)).subscribe(index => this.watchCurrentIndex(index));
    // this.appStore$.pipe(select(getCurrentSong)).subscribe(song => this.watchCurrentSong(song));
  }


  private watchMode(mode: PlayMode) {
    this.currentMode = mode;
    if (this.songList) {
      let list = this.songList.slice();
      if (mode.type === 'random') {
        list = shuffle(this.songList);
      }
      this.updateCurrentIndex(list, this.currentSong);
      this.store$.dispatch(SetPlayList({ list }));
    }
  }

  private watchList(list: SongList[], type: string) {
    this[type] = list;
  }

  private watchCurrentIndex(index: number) {
    this.currentIndex = index;
  }
  
  private watchCurrentSong(song: SongList) {
    this.currentSong = song;
    if (song) {
      this.duration = song.dt / 1000;
      this.arStr(song.ar);
    }
  }
  
  onVolClick(e) {
    e.stopPropagation();
  }
  
  
  // 控制音量面板
  toggleVolPanel(e) {
    e.stopPropagation();
    this.showVolPanel = !this.showVolPanel;
    if (this.showVolPanel) {
      this.winClick$ = fromEvent(this.doc, 'click').subscribe(() => {
        console.log('click');
        this.showVolPanel = false;
        this.winClick$.unsubscribe();
      });
    }else {
      this.winClick$.unsubscribe();
    }
  }
  
  changeMode() {
    this.store$.dispatch(SetPlayMode({ mode: modeTypes[++this.modeCount % 3] }));
  }


   // 面板切歌
   onChangeSong(song: SongList) {
    this.updateCurrentIndex(this.playList, song);
  }

   // 面板删除歌曲
   onDeleteSong(song: SongList) {
    this.modalService.confirm({
      nzTitle: '确认删除?',
      nzOnOk: () => this.multipleReducerServe.deleteSong(song)
    });
  }
   
  // 面板删除歌曲
  onClearSong() {
    this.modalService.confirm({
      nzTitle: '确认删除?',
      nzOnOk: () => {
        this.multipleReducerServe.clearSong();
        this.showPanel = false;
      }
    });
  }

  private updateCurrentIndex(list: SongList[], song: SongList) {
    const index = list.findIndex(item => item.id === song.id);
    this.store$.dispatch(SetCurrentIndex({ index }));
  }

  
  arStr(ar: Singer[]): string {
    let result = '';
    if (ar && ar.length) {
      result = ar.map(item => item.name).join(' ');
    }
    return result;
  }
  
  
  ngAfterViewInit(): void {
    this.audioEl = this.audio.nativeElement;
  }
  
  onPercentChange(per: number) {
    if (!this.currentSong) return;
    const currentTime = this.duration * (per / 100);
    this.audioEl.currentTime = currentTime;

    if (this.playPanel) {
      this.playPanel.lyric.seek(currentTime * 1000);
    }


    if (!this.playing) {
      // console.log('per', this.playing);
      this.onToggle();
      if (this.playPanel) {
        this.playPanel.lyric.togglePlay();
      }
    }
  }
  
  openPanel() {
    if (this.songList.length) {
      this.showPanel = !this.showPanel;
    }
  }
  
  
  onToggle() {
    if (this.songReady) {
      this.playing = !this.playing;
      if (this.playing) {
        this.audioEl.play();
      }else {
        this.audioEl.pause();
      }
      // this.playPanel.lyric.togglePlay();
    }
  }
  
  onPrev(index: number) {
    if (!this.songReady) return;
    if (this.songList.length === 1) {
      this.loop();
    }else{
      const newIndex = index < 0 ? this.songList.length - 1 : index;
      // this.updateCurrentSong();
      this.store$.dispatch(SetCurrentIndex({ index: newIndex }));
      this.songReady = false;
    }
  }

  onNext(index: number) {
    if (!this.songReady) return;
    if (this.songList.length === 1) {
      this.loop();
    }else{
      const newIndex = index >= this.songList.length ? 0 : index;
      // this.updateCurrentSong();
      this.store$.dispatch(SetCurrentIndex({ index: newIndex }));
    }
    this.songReady = false;
    
  }
  
  private play() {
    this.audioEl.play();
    this.playing = true;
    // this.playPanel.lyric.play();
  }
  
  // 缓存一定数据足以播放时触发
  onCanPlay() {
    this.songReady = true;
    this.play();
  }
  
  
  
  onTimeUpdate(e) {
    this.currentTime = e.target.currentTime;
    this.percent = (this.currentTime / this.duration) * 100;
    const buffered = this.audioEl.buffered;
    if (buffered.length && this.bufferPercent < 100) {
      this.bufferPercent = (buffered.end(0) / this.duration) * 100;
    }
  }
  
  // 改变音量
  onVolChange(val: number) {
    this.audioEl.volume = val / 100;
  }
  
  
  onError() {
    this.playing = false;
    if (this.currentSong) {
      this.songReady = true;
    }
  }
  
  onEnded() {
    this.playing = false;
    if (this.currentMode.type !== 'singleLoop') {
      this.onNext(this.currentIndex + 1);
    }else {
      console.log('loop');
      this.loop();
    }
  }
  
  // 单曲循环
  private loop() {
    this.audioEl.currentTime = 0;
    if (this.playPanel) {
      console.log('seek');
      this.playPanel.lyric.seek(0);
    }
    this.play();
  }
  
  
  ngOnChanges(changes: SimpleChanges): void {
    
  }
  
  ngOnDestroy(): void {
    this.winClick$ && this.winClick$.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
