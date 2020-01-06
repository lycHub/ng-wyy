import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, takeUntil } from 'rxjs/internal/operators';
import { BaseLyricLine, WyLyric } from '../../share/wy-ui/wy-player/wy-player-panel/wy-lyric';
import { Song, Singer } from 'src/app/services/data-types/common.types';
import { SongService } from '../../services/song.service';
import { Subject } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppStoreModule } from 'src/app/store';
import { BatchActionsService } from 'src/app/store/batch-actions.service';
import { NzMessageService } from 'ng-zorro-antd';
import { getCurrentSong } from 'src/app/store/selectors/player.selector';
import { SetShareInfo } from 'src/app/store/actions/member.actions';
import { getPlayer } from '../../store/selectors/player.selector';

@Component({
  selector: 'app-song-info',
  templateUrl: './song-info.component.html',
  styleUrls: ['./song-info.component.less']
})
export class SongInfoComponent implements OnInit, OnDestroy {
  song: Song;
  lyric: BaseLyricLine[];

  controlLyric = {
    isExpand: false,
    label: '展开',
    iconCls: 'down'
  };

  currentSong: Song;
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private songServe: SongService,
    private store$: Store<AppStoreModule>,
    private batchActionServe: BatchActionsService,
    private nzMessageServe: NzMessageService
  ) {
    this.route.data.pipe(map(res => res.songInfo)).subscribe(([song, lyric]) => {
      this.song = song;
      this.lyric = new WyLyric(lyric).lines;
      this.listenCurrent();
    });
  }

  ngOnInit() {
  }

  private listenCurrent() {
    this.store$
    .pipe(select(getPlayer), select(getCurrentSong), takeUntil(this.destroy$))
    .subscribe(song => this.currentSong = song);
  }

  toggleLyric() {
    this.controlLyric.isExpand = !this.controlLyric.isExpand;
    if (this.controlLyric.isExpand) {
      this.controlLyric.label = '收起';
      this.controlLyric.iconCls = 'up';
    } else {
      this.controlLyric.label = '展开';
      this.controlLyric.iconCls = 'down';
    }
  }

  onAddSong(song: Song, isPlay = false) {
    if (!this.currentSong || this.currentSong.id !== song.id) {
      this.songServe.getSongList(song)
      .subscribe(list => {
        if (list.length) {
          this.batchActionServe.insertSong(list[0], isPlay);
        } else {
          this.nzMessageServe.create('warning', '无url!');
        }
      });
    }
  }

  // 收藏歌曲
  onLikeSong(id: string) {
    this.batchActionServe.likeSong(id);
  }

  // 分享
  onShareSong(resource: Song, type = 'song') {
    const txt = this.makeTxt('歌曲', resource.name, resource.ar);
    this.store$.dispatch(SetShareInfo({ info: { id: resource.id.toString(), type, txt } }));
  }

  private makeTxt(type: string, name: string, makeBy: Singer[]): string {
    const makeByStr = makeBy.map(item => item.name).join('/');
    return `${type}: ${name} -- ${makeByStr}`;
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
