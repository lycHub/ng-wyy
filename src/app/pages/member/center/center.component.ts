import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, takeUntil } from 'rxjs/internal/operators';
import { RecordVal, UserSheet, User } from '../../../services/data-types/member.type';
import { SheetService } from '../../../services/sheet.service';
import { BatchActionsService } from '../../../store/batch-actions.service';
import { RecordType, MemberService } from '../../../services/member.service';
import { SongService } from 'src/app/services/song.service';
import { NzMessageService } from 'ng-zorro-antd';
import { Song, Singer } from '../../../services/data-types/common.types';
import { AppStoreModule } from 'src/app/store';
import { Store, select } from '@ngrx/store';
import { getCurrentSong, getPlayer } from '../../../store/selectors/player.selector';
import { findIndex } from '../../../utils/array';
import { Subject } from 'rxjs';
import { SetShareInfo } from 'src/app/store/actions/member.actions';

@Component({
  selector: 'app-center',
  templateUrl: './center.component.html',
  styleUrls: ['./center.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CenterComponent implements OnInit, OnDestroy {
  user: User;
  records: RecordVal[];
  userSheet: UserSheet;
  recordType = RecordType.weekData;

  private currentSong: Song;
  currentIndex = -1;
  private destory$ = new Subject();

  constructor(
    private route: ActivatedRoute,
    private sheetServe: SheetService,
    private batchActionsServe: BatchActionsService,
    private memberServe: MemberService,
    private songServe: SongService,
    private batchActionServe: BatchActionsService,
    private nzMessageServe: NzMessageService,
    private store$: Store<AppStoreModule>,
    private cdr: ChangeDetectorRef
  ) {
    this.route.data.pipe(map(res => res.user)).subscribe(([user, userRecord, userSheet]) => {
      this.user = user;
      this.records = userRecord.slice(0, 10);
      this.userSheet = userSheet;
      this.listenCurrentSong();
    });
  }

  ngOnInit() {
    console.log('center :>> ');
  }

  private listenCurrentSong() {
    this.store$.pipe(select(getPlayer), select(getCurrentSong), takeUntil(this.destory$)).subscribe(song => {
      this.currentSong = song;
      if (song) {
        const songs = this.records.map(item => item.song);
        this.currentIndex = findIndex(songs, song);
      } else {
        this.currentIndex = -1;
      }
      this.cdr.markForCheck();
    });
  }

  onPlaySheet(id: number) {
    this.sheetServe.playSheet(id).subscribe(list => {
      this.batchActionsServe.selectPlayList({ list, index: 0});
    });
  }

  onChangeType(type: RecordType) {
    if (this.recordType !== type) {
      this.recordType = type;
      this.memberServe.getUserRecord(this.user.profile.userId.toString(), type)
      .subscribe(records => {
        this.records = records.slice(0, 10);
        this.cdr.markForCheck();
      });
    }
  }

  onAddSong([song, isPlay]) {
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
    this.batchActionsServe.likeSong(id);
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
    this.destory$.next();
    this.destory$.complete();
  }
}
