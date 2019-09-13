import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter, ViewChildren, QueryList, Inject } from '@angular/core';
import { Song } from 'src/app/services/data-types/common.types';
import { WyScrollComponent } from '../wy-scroll/wy-scroll.component';
import { findIndex } from 'src/app/utils/array';
import { timer } from 'rxjs';
import { SongService } from '../../../../services/song.service';
import { WyLyric, BaseLyricLine } from './wy-lyric';

@Component({
  selector: 'app-wy-player-panel',
  templateUrl: './wy-player-panel.component.html',
  styleUrls: ['./wy-player-panel.component.less']
})
export class WyPlayerPanelComponent implements OnInit, OnChanges {
  @Input() playing: boolean;
  @Input() songList: Song[];
  @Input() currentSong: Song;
  @Input() show: boolean;

  @Output() onClose = new EventEmitter<void>();
  @Output() onChangeSong = new EventEmitter<Song>();

  scrollY = 0;

  currentIndex: number;
  currentLyric: BaseLyricLine[];
  currentLineNum: number;

  private lyric: WyLyric;

  @ViewChildren(WyScrollComponent) private wyScroll: QueryList<WyScrollComponent>;
  
  constructor(private songServe: SongService) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['playing']) {
      if (!changes['playing'].firstChange) {
        this.lyric && this.lyric.togglePlay(this.playing);
      }
    }


    if (changes['songList']) {
      // console.log('songList :', this.songList);
      this.currentIndex = 0;
    }

    if (changes['currentSong']) {
      if (this.currentSong) {
        this.currentIndex = findIndex(this.songList, this.currentSong);
        this.updateLyric();
        if (this.show) {
          this.scrollToCurrent();
        }
      }else {

      }
    }


    if (changes['show']) {
      if (!changes['show'].firstChange && this.show) {
        // console.log('wyScroll :', this.wyScroll);
        this.wyScroll.first.refreshScroll();
        this.wyScroll.last.refreshScroll();
        timer(80).subscribe(() => {
          if (this.currentSong) {
            this.scrollToCurrent(0);
          }
        });
      }
    }
  }


  private updateLyric() {
    this.songServe.getLyric(this.currentSong.id).subscribe(res => {
      // console.log('res :', res);
      this.lyric = new WyLyric(res);
      this.currentLyric = this.lyric.lines;
      console.log('currentLyric :', this.currentLyric);
      this.handleLyric();
      this.wyScroll.last.scrollTo(0, 0);
     
      
      if (this.playing) {
        this.lyric.play();
      }
    });
  }

  private handleLyric() {
    this.lyric.handler.subscribe(({ lineNum }) => {
      console.log('lineNum :', lineNum);
      this.currentLineNum = lineNum;
    });
  }


  private scrollToCurrent(speed = 300) {
    const songListRefs = this.wyScroll.first.el.nativeElement.querySelectorAll('ul li');
    if (songListRefs.length) {
      const currentLi = <HTMLElement>songListRefs[this.currentIndex || 0];
      const offsetTop = currentLi.offsetTop;
      const offsetHeight = currentLi.offsetHeight;
      console.log('scrollY :', this.scrollY);
      console.log('offsetTop :', offsetTop);
      if (((offsetTop - Math.abs(this.scrollY)) > offsetHeight * 5) || (offsetTop < Math.abs(this.scrollY))) {
        this.wyScroll.first.scrollToElement(currentLi, speed, false, false);
      }
    }
  }
}
