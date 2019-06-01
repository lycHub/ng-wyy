import {AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {SongSheetList} from "../../../service/song/song.service";

@Component({
  selector: 'app-wy-player',
  templateUrl: './wy-player.component.html',
  styleUrls: ['./wy-player.component.less']
})
export class WyPlayerComponent implements OnInit, OnChanges, AfterViewInit {
  arr = Array(100).fill(3);
  @Input() songSheetList: SongSheetList[];
  
  // 是否可以播放
  private songReady = false;
  
  // 播放状态vuex
  private playing = false;
  
  // 当前播放的索引vuex
  currentIndex: number;
  
  
  // 正在播放vuex
  get currentSong(): SongSheetList | null {
    return this.songSheetList[this.currentIndex];
  }
  
  // 播放时间
  currentTime: number;
  
  // 总时长
  duration: number;
  
  // 播放进度（百分比）
  get percent(): number | null {
    return (this.currentTime / this.duration) * 100;
  }
  
  @ViewChild('audio') private audio: ElementRef;
  private audioEl: HTMLAudioElement;
  ngOnInit() {}
  
  ngAfterViewInit(): void {
    this.audioEl = this.audio.nativeElement;
  }
  
  onChange(e) {
    console.log('e', e);
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    const songSheetList = changes.songSheetList;
    if (songSheetList && songSheetList.currentValue.length) {
      this.currentIndex = 0;
    }
  }
  
  
  onToggle() {
    console.log(this.songReady);
    if (this.songReady) {
      console.log('aa');
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
      this.songReady = false;
    }
  }
  onNext(index: number) {
    if (this.songReady) {
      this.currentIndex = index >= this.songSheetList.length ? 0 : index;
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
    if (this.currentSong) {
      this.songReady = true;
    }
  }
  
  onEnded() {
    console.log('end');
  }
}
