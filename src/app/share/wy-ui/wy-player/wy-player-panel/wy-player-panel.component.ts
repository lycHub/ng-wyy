import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {SongSheetList} from "../../../../service/song/song.service";

@Component({
  selector: 'app-wy-player-panel',
  templateUrl: './wy-player-panel.component.html',
  styleUrls: ['./wy-player-panel.component.less']
})
export class WyPlayerPanelComponent implements OnInit, OnChanges {
  arr = Array(100).fill(3);
  @Input() songList: SongSheetList[];
  @Input() currentSong: SongSheetList;
  
  // 关闭面板
  @Output() readonly onClose = new EventEmitter<void>();
  
  // 切歌
  @Output() readonly onChangeSong = new EventEmitter<SongSheetList>();
  
  private currentIndex: number;
  constructor() { }

  ngOnInit() {
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    // console.log('songList panel', changes['songList']);
    if (changes['currentSong']) {
      // console.log(changes['currentSong'].currentValue);
      this.currentIndex = this.songList.findIndex(item => item.id === changes['currentSong'].currentValue.id);
    }
  }

}
