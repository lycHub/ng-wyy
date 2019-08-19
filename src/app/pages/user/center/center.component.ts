import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, takeUntil, take } from 'rxjs/operators';
import { User, recordVal, UserSheet } from 'src/app/service/data-modals/member.models';
import { Song } from 'src/app/service/data-modals/common.models';
import { Observable, Subject } from 'rxjs';
import { AppStoreModule } from 'src/app/store';
import { MemberService, RecordType } from 'src/app/service/member/member.service';
import { SongService } from 'src/app/service/song/song.service';
import { MultipleReducersService } from 'src/app/store/multiple-reducers.service';
import { Store, select } from '@ngrx/store';
import { getCurrentSong } from 'src/app/store/selectors/player.selector';
import { findIndex } from 'src/app/utils/array';
import { SheetService } from '../../../service/sheet/sheet.service';

@Component({
  selector: 'app-center',
  templateUrl: './center.component.html',
  styleUrls: ['./center.component.less']
})
export class CenterComponent implements OnInit, OnDestroy {
  user: User;
  testArr: number[];
  userRecord: recordVal[];

  recordType = RecordType.weekData;

  currentIndex = -1;

  userSheet: UserSheet;

  private currentSong: Song;
  
  
  private appStore$: Observable<AppStoreModule>;
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private songServe: SongService,
    private sheetServe: SheetService,
    private multipleReducerServe: MultipleReducersService,
    private store$: Store<AppStoreModule>,
    private memberServe: MemberService
  ) {
    this.route.data.pipe(map(res => res.user)).subscribe(([user, userRecord, userSheet]) => {
      this.user = user;
      this.userRecord = userRecord.slice(0, 10);
      this.userSheet = userSheet;
      this.listenCurrentSong();
    });
  }

  ngOnInit() {
    
  }

  // 监听currentSong
  private listenCurrentSong() {
    this.appStore$ = this.store$.pipe(select('player'), takeUntil(this.destroy$));
    this.appStore$.pipe(select(getCurrentSong)).subscribe(song => {
      this.currentSong = song;
      if (song) {
        const songs = this.userRecord.map(item => item.song);
        this.currentIndex = findIndex(songs, song);
      }else{
        this.currentIndex = -1;
      }
    });
  }

  // 改变记录类型
  onChangeRecordType(type: number) {
    if (this.recordType !== type) {
      this.recordType = type;
      this.memberServe.userRecord(this.user.profile.userId, this.recordType)
        .subscribe(userRecord => this.userRecord = userRecord.slice(0, 10));
    }
  }


   // 添加一首歌曲
   onAddSong([song, play]) {
    if (!this.currentSong || this.currentSong.id !== song.id) {
      this.songServe.getSongList(song).subscribe(list => this.multipleReducerServe.insertSong(list[0], play));
    }
  }

  playSong(id: number) {
    this.sheetServe.getSongSheetDetail(id).subscribe(sheet => {
      this.songServe.getSongList(sheet.tracks).subscribe(list => {
        if (list.length) {
          this.multipleReducerServe.selectPlay(({ list, index: 0 }));
        }
      });
    });
  }


  // 收藏歌曲
  onLikeSong(id: string) {
    this.multipleReducerServe.likeSongs(id);
  }


  onLookMore() {
    this.router.navigate([`/userCenter/${this.user.profile.userId}/record-detail`]);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
