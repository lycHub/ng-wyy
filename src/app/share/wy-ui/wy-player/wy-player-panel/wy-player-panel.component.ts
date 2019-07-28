import {
  AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges,
  ViewChildren,
  QueryList,
  Inject
} from '@angular/core';
import {SongService} from "../../../../service/song/song.service";
import {WyScrollComponent} from "../wy-scroll.component";
import Lyric from 'lyric-parser';
import { WINDOW } from 'src/app/core/inject-tokens';
import { findIndex } from 'src/app/utils/array';
import {Song} from "../../../../service/data.models";

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
  @Input() songList: Song[];
  @Input() currentSong: Song;
  @Input() playing: boolean;
  
  private currentIndex: number;
  lyric: Lyric | null;
  currentLyric: LyricItem[];
  currentLineIndex: number;
  
  // 关闭面板
  @Output() onClose = new EventEmitter<void>();
  
  // 切歌
  @Output() onChangeSong = new EventEmitter<Song>();

  // 删除歌曲
  @Output() onDeleteSong = new EventEmitter<Song>();

  // 清空歌曲
  @Output() onClearSong = new EventEmitter<void>();
  
  @ViewChildren(WyScrollComponent) private wyScroll: QueryList<WyScrollComponent>;
  private songListRefs: NodeList;
  private lyricRefs: NodeList;
  
  // 当前滚动的位置
  scrollY = 0;

  private isCnSong: boolean;
  
  constructor(private songServe: SongService, @Inject(WINDOW) private win: Window) {}

  ngOnInit() {
    // console.log('init');
  }
  
  
  ngAfterViewInit(): void {
    this.songListRefs = this.wyScroll.first.el.nativeElement.querySelectorAll('ul li');
    this.scrollTCurrent(0);
    // this.updateLyric();
  }

  
  
  ngOnChanges(changes: SimpleChanges): void {
    // console.log('currentSong panel', changes['currentSong']);
    let currentSong = null;
    if (changes['currentSong']) {
      currentSong = changes['currentSong'].currentValue;
      if (currentSong) {
        this.currentIndex = findIndex(this.songList, currentSong);
        this.updateLyric();
        this.scrollTCurrent();
      }
    }

    if (changes['playing']) {
      if(!changes['playing'].firstChange) {
        this.lyric && this.lyric.togglePlay();
      }
    }

    if (changes['songList']) {
      if (this.currentSong) {
        if (this.lyric) this.lyric.togglePlay();
        this.currentIndex = findIndex(changes['songList'].currentValue, this.currentSong);
      }
    }
  }


  
  // 获取歌词
  updateLyric() {
    if (this.lyric) {
      this.lyric.stop();
      this.lyric = null;
    }
    this.currentLineIndex = 0;
    this.songServe.getLyric(this.currentSong.id).subscribe(({ lyric, tlyric }) => {
      
      this.lyric = new Lyric(lyric, this.handleLyric.bind(this));
      if (tlyric) {
        this.isCnSong = false;
        const currentTLyric = new Lyric(tlyric);
        this.currentLyric = this.concatLyric(this.lyric.lines, currentTLyric.lines);
      }else{
        this.isCnSong = true;
        this.currentLyric = this.lyric.lines;
      }

      this.wyScroll.last.scrollTo(0, 0);

      if (this.playing) {
        this.lyric.play();
      }
      
 
    this.win.setTimeout(() => {
      this.lyricRefs = this.wyScroll.last.el.nativeElement.querySelectorAll('ul li');
    }, 500);
      // console.log(this.currentLyric);
    });
  }

  private handleLyric({ lineNum }) {
    if (!this.lyricRefs) return;
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
  
  private scrollTCurrent(speed = 300) {
    if (this.songListRefs) {
      const dom = <HTMLElement>this.songListRefs[this.currentIndex || 0];
      const offsetTop = dom.offsetTop;
      const scrollY = this.scrollY;
      // console.log(dom);
      if ((offsetTop < Math.abs(scrollY)) || (Math.abs(offsetTop - Math.abs(scrollY)) > 205)) {
        this.wyScroll.first.scrollToElement(dom, speed, false, false);
      }
    }
  }


  // 删除歌曲
  onDelete(evt: MouseEvent, song: Song) {
    evt.stopPropagation();
    this.onDeleteSong.emit(song);
  }

}
