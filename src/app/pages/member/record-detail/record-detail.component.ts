import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, takeUntil } from 'rxjs/internal/operators';
import { User, recordVal } from 'src/app/services/data-types/member.type';
import { RecordType, MemberService } from 'src/app/services/member.service';
import { Song } from 'src/app/services/data-types/common.types';
import { Subject } from 'rxjs';
import { BatchActionsService } from 'src/app/store/batch-actions.service';
import { SongService } from 'src/app/services/song.service';
import { AppStoreModule } from 'src/app/store';
import { NzMessageService } from 'ng-zorro-antd';
import { Store, select } from '@ngrx/store';
import { SheetService } from 'src/app/services/sheet.service';
import { getCurrentSong } from 'src/app/store/selectors/player.selector';
import { findIndex } from 'src/app/utils/array';

@Component({
  selector: 'app-record-detail',
  templateUrl: './record-detail.component.html',
  styles: [`.record-detail .page-wrap { padding: 40px; }`],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecordDetailComponent implements OnInit, OnDestroy {
  user: User;
  records: recordVal[];
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
    this.route.data.pipe(map(res => res.user)).subscribe(([user, userRecord]) => {
      this.user = user;
      this.records = userRecord;
      this.listenCurrentSong();
    });
  }

  ngOnInit() {
  }

  private listenCurrentSong() {
    this.store$.pipe(select('player'), select(getCurrentSong), takeUntil(this.destory$)).subscribe(song => {
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
        this.records = records;
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

  ngOnDestroy(): void {
    this.destory$.next();
    this.destory$.complete();
  }

}
