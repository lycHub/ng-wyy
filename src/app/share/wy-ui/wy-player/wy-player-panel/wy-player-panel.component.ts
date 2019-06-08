import {
  AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges,
  ViewChild
} from '@angular/core';
import {SongList} from "../../../../service/song/song.service";
import {WyScrollComponent} from "../wy-scroll.component";

@Component({
  selector: 'app-wy-player-panel',
  templateUrl: './wy-player-panel.component.html',
  styleUrls: ['./wy-player-panel.component.less']
})
export class WyPlayerPanelComponent implements OnInit, OnChanges, AfterViewInit {
  arr = Array(100).fill(3);
  @Input() songList: SongList[];
  @Input() currentSong: SongList;
  
  private currentIndex: number;
  
  
  // 关闭面板
  @Output() readonly onClose = new EventEmitter<void>();
  
  // 切歌
  @Output() readonly onChangeSong = new EventEmitter<SongList>();
  @ViewChild(WyScrollComponent, { static: true }) private wyScroll: WyScrollComponent;
  private songListRefs: NodeList;
  
  // 当前滚动的位置
  scrollY = 0;
  
  constructor() {
    // console.log('constructor');
  }

  ngOnInit() {
    // console.log('init');
  }
  
  
  ngAfterViewInit(): void {
    this.songListRefs = this.wyScroll.el.nativeElement.querySelectorAll('ul li');
    this.scrollToElement();
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    // console.log('songList panel', changes['songList']);
    if (changes['currentSong']) {
      // console.log(changes['currentSong'].currentValue);
      this.currentIndex = this.songList.findIndex(item => item.id === changes['currentSong'].currentValue.id);
      this.scrollToElement();
    }
  }
  
  private scrollToElement() {
    // console.log('scrollY', this.scrollY);
    if (this.songListRefs) {
      const dom = <HTMLElement>this.songListRefs[this.currentIndex];
      const offsetTop = dom.offsetTop;
      const scrollY = this.scrollY;
      if ((offsetTop < Math.abs(scrollY)) || (Math.abs(offsetTop - Math.abs(scrollY)) > 205)) {
        this.wyScroll.scrollToElement(dom, 300, false, false);
      }
    }
  }

}
