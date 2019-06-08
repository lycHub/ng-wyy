import {AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {SongList} from "../../../../service/song/song.service";

@Component({
  selector: 'app-wy-player-panel',
  templateUrl: './wy-player-panel.component.html',
  styleUrls: ['./wy-player-panel.component.less']
})
export class WyPlayerPanelComponent implements OnInit, OnChanges, AfterViewInit {
  arr = Array(100).fill(3);
  @Input() songList: SongList[];
  @Input() currentSong: SongList;
  
  // 关闭面板
  @Output() readonly onClose = new EventEmitter<void>();
  
  // 切歌
  @Output() readonly onChangeSong = new EventEmitter<SongList>();
  private currentIndex: number;
  constructor() { }

  ngOnInit() {
  }
  
  
  ngAfterViewInit(): void {
  
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    // console.log('songList panel', changes['songList']);
    if (changes['currentSong']) {
      // console.log(changes['currentSong'].currentValue);
      this.currentIndex = this.songList.findIndex(item => item.id === changes['currentSong'].currentValue.id);
    }
  }

}
