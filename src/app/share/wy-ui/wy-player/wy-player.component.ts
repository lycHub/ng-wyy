import {Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {SongSheetList} from "../../../pages/home/home.component";

@Component({
  selector: 'app-wy-player',
  templateUrl: './wy-player.component.html',
  styleUrls: ['./wy-player.component.less']
})
export class WyPlayerComponent implements OnInit, OnChanges {
  arr = Array(100).fill(3);
  @Input() songSheetList: SongSheetList[];
  
  // 是否可以播放
  private songReady = false;
  
  // 正在播放
  currentSong: SongSheetList;
  
  @ViewChild('audio') private audio: ElementRef;
  constructor() { }
  ngOnInit() {}
  
  ngOnChanges(changes: SimpleChanges): void {
    const songSheetList = changes.songSheetList;
    if (songSheetList && songSheetList.currentValue.length) {
      this.currentSong = songSheetList.currentValue[0];
    }
  }
  
  
  play() {
    this.songReady = true;
  }
  
  
  updateTime(e) {
    // console.log('currentTime', e);
  }
  
  error() {
    this.songReady = false;
  }
  
  end() {
    console.log('end');
  }
}
