import {
  AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges,
  ViewChildren,
  QueryList,
  Inject, ElementRef
} from '@angular/core';
import {SongService} from "../../../../service/song/song.service";
import {WyScrollComponent} from "../wy-scroll.component";
import { WINDOW } from 'src/app/core/inject-tokens';
import { findIndex } from 'src/app/utils/array';
import {Song} from "../../../../service/data.models";
import {LyricParser} from "../../../wy-lyric";

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
export class WyPlayerPanelComponent implements OnChanges {
  @Input() songList: Song[];
  @Input() currentSong: Song;
  @Input() playing: boolean;
  @Input() show = false;
  
  private currentIndex: number;
  lyric: LyricParser | null;
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
  private lyricRefs: NodeList;
  
  // 当前滚动的位置
  scrollY = 0;

  private isCnSong: boolean;
  
  constructor(private songServe: SongService, @Inject(WINDOW) private win: Window) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['playing']) {
      // console.log('changes playing', this.playing);
      if(!changes['playing'].firstChange) {
        this.lyric && this.lyric.togglePlay(this.playing);
      }
    }
    
    if (changes['show']) {
      if (!changes['show'].firstChange && changes['show'].currentValue) {
        this.wyScroll.first.refreshScroll();
        this.wyScroll.last.refreshScroll();
        this.win.setTimeout(() => {
          if (this.lyricRefs) {
            const targetLine = this.lyricRefs[this.currentLineIndex - this.startLine];
            if (targetLine) {
              this.wyScroll.last.scrollToElement(targetLine, 0, false, false);
            }
          }
        }, 100);
      }
      
    }

    // console.log('songList :', changes['songList']);
    if (changes['songList']) {
      if (this.currentSong) {
        // if (this.lyric) this.lyric.togglePlay();
        this.currentIndex = findIndex(changes['songList'].currentValue, this.currentSong);
        
      }
    }
  
  
    let currentSong = null;
    // console.log('currentSong :', changes['currentSong']);
    if (changes['currentSong']) {
      currentSong = changes['currentSong'].currentValue;
      if (currentSong) {
        this.currentIndex = findIndex(this.songList, currentSong);
        this.updateLyric();
        if (this.show) {
          this.scrollToCurrent();
        }
      }else{
        this.resetLyric();
      }
    }
  }


  
  // 获取歌词
  updateLyric() {
    this.resetLyric();
    this.currentLineIndex = 0;
    this.songServe.getLyric(this.currentSong.id).subscribe(({ lyric, tlyric }) => {
      this.lyric = new LyricParser({ lyric, tlyric });
      this.handleLyric();
      // console.log('lyric lines :', this.lyric.lines);
      this.currentLyric = this.lyric.lines;
      if (tlyric) {
        this.isCnSong = false;
      }else{
        this.isCnSong = true;
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

  private handleLyric() {
    this.lyric.handler.subscribe(({ lineNum }) => {
      console.log('subscribe :', lineNum);
      if (!this.lyricRefs) return;
      this.currentLineIndex = lineNum;
    if (lineNum > this.startLine) {
      const targetLine = this.lyricRefs[lineNum - this.startLine];
      this.wyScroll.last.scrollToElement(targetLine, 300, false, false);
    }else{
      this.wyScroll.last.scrollTo(0, 0);
    }
    });
    
  }
  
  /* private concatLyric(lyric: LyricItem[], tlyric: LyricItem[]): LyricItem[] {
    const result = [];
    lyric.forEach(item => {
      const cnItem = tlyric.find(cnLyric => cnLyric.time === item.time);
      const txtCn = cnItem ? cnItem.txt : '';
      result.push({ ...item, txtCn });
    });
    return result;
  } */
  
  private scrollToCurrent(speed = 300) {
    const songListRefs = this.wyScroll.first.el.nativeElement.querySelectorAll('ul li');
    if (songListRefs.length) {
      // console.log('currentIndex :', this.currentIndex);
      const dom = <HTMLElement>songListRefs[this.currentIndex || 0];
      // console.log('dom :', dom);
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


  // 重置歌词
  private resetLyric() {
    if (this.lyric) {
      this.lyric.stop();
      this.lyric = null;
      this.currentLyric = [];
    }
  }
  
  // 开始滚动的行
  get startLine(): number {
    return this.isCnSong ? 3 : 1;
  }
}
