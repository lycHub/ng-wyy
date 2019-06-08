import {
  AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges,
  ViewChild,
  ViewChildren,
  QueryList,
  AfterViewChecked,
  Inject
} from '@angular/core';
import {SongList, SongService} from "../../../../service/song/song.service";
import {WyScrollComponent} from "../wy-scroll.component";
import Lyric from 'lyric-parser';
import { WINDOW } from 'src/app/core/inject-tokens';

export type LyricItem = {
  time: number;
  txt: string;
  txtCn?: string;
}

@Component({
  selector: 'app-wy-player-panel',
  templateUrl: './wy-player-panel.component.html',
  styleUrls: ['./wy-player-panel.component.less']
})
export class WyPlayerPanelComponent implements OnInit, OnChanges, AfterViewInit {
  
  arr = Array(100).fill(3);
  @Input() songList: SongList[];
  @Input() currentSong: SongList;
  @Input() playing: boolean;
  
  private currentIndex: number;
  lyric: Lyric | null;
  currentLyric: LyricItem[];
  currentLineIndex: number;
  
  // 关闭面板
  @Output() readonly onClose = new EventEmitter<void>();
  
  // 切歌
  @Output() readonly onChangeSong = new EventEmitter<SongList>();
  // @ViewChild(WyScrollComponent, { static: true }) private wyScroll: WyScrollComponent;
  @ViewChildren(WyScrollComponent) private wyScroll: QueryList<WyScrollComponent>;
  private songListRefs: NodeList;
  private lyricRefs: NodeList;
  
  // 当前滚动的位置
  scrollY = 0;

  private isCnSong: boolean;
  
  constructor(private songServe: SongService, @Inject(WINDOW) private win: Window) {
    // console.log('constructor');
  }

  ngOnInit() {
    // console.log('init');
  }
  
  
  ngAfterViewInit(): void {
    this.songListRefs = this.wyScroll.first.el.nativeElement.querySelectorAll('ul li');
    this.scrollToElement();
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    // console.log('songList panel', changes['songList']);
    if (changes['currentSong']) {
      const songId = changes['currentSong'].currentValue.id;
      this.currentIndex = this.songList.findIndex(item => item.id === songId);
      this.scrollToElement();
      this.updateLyric(songId);
    }

    if (changes['playing']) {
      if (this.lyric) this.lyric.togglePlay();
    }
  }


  
  // 获取歌词
  updateLyric(songId: number) {
    this.songServe.getLyric(songId).subscribe(({ lyric, tlyric }) => {
      this.currentLineIndex = 0;
      this.wyScroll.last.scrollTo(0, 0);
      if (this.lyric) this.lyric.stop();
      this.lyric = new Lyric(lyric, this.handleLyric.bind(this));
      
      if (tlyric) {
        this.isCnSong = false;
        const currentTLyric = new Lyric(tlyric);
        this.currentLyric = this.concatLyric(this.lyric.lines, currentTLyric.lines);
      }else{
        this.isCnSong = true;
        this.currentLyric = this.lyric.lines;
      }
      // console.log('currentLyric', this.currentLyric);
      // console.log('playing', this.playing);
      if (this.playing) {
        this.lyric.play();
      }
      
 
    this.win.setTimeout(() => {
      this.lyricRefs = this.wyScroll.last.el.nativeElement.querySelectorAll('ul li');
    }, 500);
      // console.log(this.currentLyric);
    }, error => {
      if (this.lyric) this.lyric = null;
      this.currentLineIndex = 0;
    });
  }

  private handleLyric({ lineNum }) {
    console.log('handleLyric');
    this.currentLineIndex = lineNum;
    const startLine = this.isCnSong ? 3 : 2;
    if (lineNum > startLine) {
      const targetLine = this.lyricRefs[lineNum - startLine];
      this.wyScroll.last.scrollToElement(targetLine, 300, false, false);
    }else{
      this.wyScroll.last.scrollTo(0, 0);
    }
  }

  private concatLyric(lyric: LyricItem[], tlyric: LyricItem[]): LyricItem[] {
    const result = [];
    lyric.forEach(item => {
      const cnItem = tlyric.find(cnLyric => cnLyric.time === item.time);
      const txtCn = cnItem ? cnItem.txt : '';
      result.push({ ...item, txtCn });
    });
    return result;
  }
  
  private scrollToElement() {
    // console.log('scrollY', this.scrollY);
    if (this.songListRefs) {
      const dom = <HTMLElement>this.songListRefs[this.currentIndex];
      const offsetTop = dom.offsetTop;
      const scrollY = this.scrollY;
      if ((offsetTop < Math.abs(scrollY)) || (Math.abs(offsetTop - Math.abs(scrollY)) > 205)) {
        this.wyScroll.first.scrollToElement(dom, 300, false, false);
      }
    }
  }

}
