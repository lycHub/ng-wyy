import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, takeUntil } from 'rxjs/internal/operators';
import { SingerDetail, Song, Singer } from '../../../services/data-types/common.types';
import { AppStoreModule } from 'src/app/store';
import { Store, select } from '@ngrx/store';
import { SongService } from 'src/app/services/song.service';
import { NzMessageService } from 'ng-zorro-antd';
import { BatchActionsService } from 'src/app/store/batch-actions.service';
import { getCurrentSong } from 'src/app/store/selectors/player.selector';
import { findIndex } from 'src/app/utils/array';
import { Subject } from 'rxjs';
import { SetShareInfo } from 'src/app/store/actions/member.actions';
import { MemberService } from '../../../services/member.service';
import { getPlayer } from '../../../store/selectors/player.selector';

@Component({
  selector: 'app-singer-detail',
  templateUrl: './singer-detail.component.html',
  styleUrls: ['./singer-detail.component.less']
})
export class SingerDetailComponent implements OnInit, OnDestroy {
  singerDetail: SingerDetail;
  simiSingers: Singer[];
  currentIndex = -1;
  currentSong: Song;
  hasLiked = false;
  private destroy$ = new Subject<void>();
  constructor(
    private route: ActivatedRoute,
    private store$: Store<AppStoreModule>,
    private songServe: SongService,
    private batchActionServe: BatchActionsService,
    private nzMessageServe: NzMessageService,
    private memberServe: MemberService
  ) {
    this.route.data.pipe(map(res => res.singerDetail)).subscribe(([detail, simiSingers]) => {
      this.singerDetail = detail;
      this.simiSingers = simiSingers;
      this.listenCurrent();
    });
  }

  ngOnInit() {
  }


  private listenCurrent() {
    this.store$
    .pipe(select(getPlayer), select(getCurrentSong), takeUntil(this.destroy$))
    .subscribe(song => {
      this.currentSong = song;
      if (song) {
        this.currentIndex = findIndex(this.singerDetail.hotSongs, song);
      } else {
        this.currentIndex = -1;
      }
    });
  }

  onAddSongs(songs: Song[], isPlay = false) {
    this.songServe.getSongList(songs).subscribe(list => {
      if (list.length) {
        if (isPlay) {
          this.batchActionServe.selectPlayList({ list, index: 0 });
        } else {
          this.batchActionServe.insertSongs(list);
        }
      }
    });
  }


   // 添加一首歌曲
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

  // 收藏歌手
  onLikeSinger(id: string) {
    let typeInfo = {
      type: 1,
      msg: '收藏'
    };
    if (this.hasLiked) {
      typeInfo = {
        type: 2,
        msg: '取消收藏'
      };
    }
    this.memberServe.likeSinger(id, typeInfo.type).subscribe(() => {
      this.hasLiked = !this.hasLiked;
      this.nzMessageServe.create('success', typeInfo.msg + '成功');
    }, err => {
      this.nzMessageServe.create('error', err.msg || typeInfo.msg + '失败');
    });
  }


  // 批量收藏
  onLikeSongs(songs: Song[]) {
    const ids = songs.map(item => item.id).join(',');
    this.onLikeSong(ids);
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
