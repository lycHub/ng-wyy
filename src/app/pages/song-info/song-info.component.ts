import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {map} from "rxjs/internal/operators";
import {Lyric, Song} from "../../service/data-modals/common.models";
import {LyricItem} from "../../share/wy-ui/wy-player/wy-player-panel/wy-player-panel.component";
import { LyricParser } from '../../share/wy-lyric';
import {SongService} from "../../service/song/song.service";
import {MultipleReducersService} from "../../store/multiple-reducers.service";

@Component({
  selector: 'app-song-info',
  templateUrl: './song-info.component.html',
  styleUrls: ['./song-info.component.less']
})
export class SongInfoComponent implements OnInit {
  song: Song;
  
  lyric: LyricParser;
  currentLyric: LyricItem[];
  
  controlLyric = {
    isExpand: false,
    label: '展开',
    iconCls: 'down'
  }
  constructor(
    private route: ActivatedRoute,
    private songServe: SongService,
    private multipleReducerServe: MultipleReducersService
  ) {
    this.route.data.pipe(map(res => res.songInfo)).subscribe(([song, lyric]) => {
      this.song = song;
      this.updateLyric(lyric);
    });
  }

  ngOnInit() {
  }
  
  
  
  onToggleExpand() {
    this.controlLyric.isExpand = !this.controlLyric.isExpand;
    if (this.controlLyric.isExpand) {
      this.controlLyric.label = '收起';
      this.controlLyric.iconCls = 'up';
    }else {
      this.controlLyric.label = '展开';
      this.controlLyric.iconCls = 'down';
    }
  }
  
  // 插入歌曲
  onAddSong(song: Song, play = false) {
    this.songServe.getSongList(song).subscribe(list => this.multipleReducerServe.insertSong(list[0], play));
  }
  
  
  private updateLyric({ lyric, tlyric }: Lyric) {
    this.lyric = new LyricParser({lyric, tlyric});
    this.currentLyric = this.lyric.lines;
  }
}
