import {
  AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges,
  ViewChild
} from '@angular/core';
import {SongList} from "../../../../service/song/song.service";
import BScroll from '@better-scroll/core';
import MouseWheel from '@better-scroll/mouse-wheel';
import ScrollBar from '@better-scroll/scroll-bar';
BScroll.use(MouseWheel);
BScroll.use(ScrollBar);

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
  
  @ViewChild('listWrap', { static: true }) private listWrapRef: ElementRef;
  private songListRefs: NodeList;
  
  private currentIndex: number;
  
  private bs: BScroll;
  constructor() {
    // console.log('constructor');
  }

  ngOnInit() {
    // console.log('init');
  }
  
  
  ngAfterViewInit(): void {
    const wrap = this.listWrapRef.nativeElement;
    this.bs = new BScroll(wrap, {
      click: true,
      scrollbar: {
        fade: false,
        interactive: true
      },
      mouseWheel: {}
    });
    this.songListRefs = wrap.querySelectorAll('ul li');
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
    if (this.songListRefs) {
      const dom = <HTMLElement>this.songListRefs[this.currentIndex];
      const offsetTop = dom.offsetTop;
      const scrollY = this.bs.y;
      if ((offsetTop < Math.abs(scrollY)) || (Math.abs(offsetTop - Math.abs(scrollY)) > 205)) {
        this.bs.scroller.scrollToElement(dom, 300, false, false);
      }
    }
  }

}
