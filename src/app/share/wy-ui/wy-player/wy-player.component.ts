import {
  AfterViewInit, Component, ElementRef, Inject, Input, OnChanges, OnInit, SimpleChanges,
  ViewChild
} from '@angular/core';
import {SongSheetList} from "../../../service/song/song.service";
import {fromEvent, Subscription} from "rxjs/index";
import {DOCUMENT} from "@angular/common";
import {shuffle} from "../../../utils/array";
import {Singer} from "../../../service/data.models";

@Component({
  selector: 'app-wy-player',
  templateUrl: './wy-player.component.html',
  styleUrls: ['./wy-player.component.less']
})
export class WyPlayerComponent implements OnChanges, AfterViewInit {
  arr = Array(100).fill(3);
  
  // 原始列表的副本
  private sequenceList: SongSheetList[];
  private playList: SongSheetList[];
  
  @Input() songSheetList: SongSheetList[];
  
  
  // 是否可以播放
  private songReady = false;
  
  // 播放状态vuex
  private playing = false;
  
  // 当前播放的索引vuex
  currentIndex: number;
  
  // 正在播放vuex
  currentSong: SongSheetList;
  
  
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
  modeTypes = [ {
    type: 'loop',
    label: '循环'
  }, {
    type: 'random',
    label: '随机'
  }, {
    type: 'single-loop',
    label: '单曲循环'
  }];
  
  // 当前模式vuex
  currentMode = this.modeTypes[0];
  
  @ViewChild('audio') private audio: ElementRef;
  private audioEl: HTMLAudioElement;
  
  private winClick$: Subscription;
  constructor(@Inject(DOCUMENT) private doc: Document) {
    this.winClick$ = fromEvent(this.doc, 'click').subscribe((e: MouseEvent) => {
      if (!this.volClick) {
        this.showVolPanel = false;
      }
      this.volClick = false;
    });
  }
  
  // 点击音量面板
  onVolClick() {
    this.volClick = true;
  }
  
  // 控制音量面板
  toggleVolPanel() {
    this.onVolClick();
    this.showVolPanel = !this.showVolPanel;
  }
  
  changeMode() {
    this.currentMode = this.modeTypes[++this.modeCount % 3];
    if (this.currentMode.type === 'random') {
      console.log('random');
      const randomList = this.getPlayList();
      this.updateCurrentIndex(randomList);
      this.playList = randomList;
    }else {
      this.updateCurrentIndex(this.songSheetList);
      this.playList = this.songSheetList;
    }
    this.updateCurrentSong();
  }
  
  // 随机列表
  private getPlayList(): SongSheetList[] {
    return shuffle(this.songSheetList || []);
  }
  
  private updateCurrentSong() {
    this.currentSong = this.playList[this.currentIndex];
    this.arStr(this.currentSong.ar);
  }
  private updateCurrentIndex(list: SongSheetList[]) {
    this.currentIndex = list.findIndex(item => item.id === this.currentSong.id);
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
    this.audioEl.currentTime = this.duration * (per / 100);
    if (!this.playing) {
      this.onToggle();
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
    }
  }
  
  onPrev(index: number) {
    if (this.songReady) {
      this.currentIndex = index < 0 ? this.songSheetList.length - 1 : index;
      this.updateCurrentSong();
      this.songReady = false;
    }
  }
  onNext(index: number) {
    if (this.songReady) {
      this.currentIndex = index >= this.songSheetList.length ? 0 : index;
      this.updateCurrentSong();
      this.songReady = false;
    }
  }
  
  private play() {
    this.audioEl.play();
    this.duration = this.audioEl.duration;
    this.playing = true;
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
  
  private formatTime(time: number): string {
    if (time) {
      const temp = time | 0;
      const minute = temp / 60 | 0;
      const second = (temp % 60).toString().padStart(2, '0');
      return `${minute}:${second}`;
    }else {
      return '00:00';
    }
  }
  
  onError() {
    this.playing = false;
    if (this.currentSong) {
      this.songReady = true;
    }
  }
  
  onEnded() {
    this.playing = false;
    if (this.currentMode.type !== 'single-loop') {
      this.onNext(this.currentIndex + 1);
    }else {
      this.loop();
    }
  }
  
  // 单曲循环
  private loop() {
    this.audioEl.currentTime = 0;
    this.play();
  }
  
  
  ngOnChanges(changes: SimpleChanges): void {
    const songSheetList = changes.songSheetList;
    if (songSheetList && songSheetList.currentValue.length) {
      this.currentIndex = 0;
      this.playList = this.getPlayList();
      this.updateCurrentSong();
    }
  }
}
