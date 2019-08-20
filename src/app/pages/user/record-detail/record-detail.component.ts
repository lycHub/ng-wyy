import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, takeUntil } from 'rxjs/operators';
import { User, recordVal } from 'src/app/service/data-modals/member.models';
import { Song } from 'src/app/service/data-modals/common.models';
import { Observable, Subject } from 'rxjs';
import { AppStoreModule } from 'src/app/store';
import { MemberService, RecordType } from 'src/app/service/member.service';
import { SongService } from 'src/app/service/song.service';
import { MultipleReducersService } from 'src/app/store/multiple-reducers.service';
import { Store, select } from '@ngrx/store';
import { getCurrentSong } from 'src/app/store/selectors/player.selector';
import { findIndex } from 'src/app/utils/array';
import { Singer } from '../../../service/data-modals/common.models';

@Component({
  selector: 'app-record-detail',
  templateUrl: './record-detail.component.html',
  styleUrls: ['./record-detail.component.less']
})
export class RecordDetailComponent implements OnInit, OnDestroy {

  user: User;
  testArr: number[];
  userRecord: recordVal[];

  recordType = RecordType.weekData;

  currentIndex = -1;
  private currentSong: Song;
  
  private appStore$: Observable<AppStoreModule>;
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private songServe: SongService,
    private multipleReducerServe: MultipleReducersService,
    private store$: Store<AppStoreModule>,
    private memberServe: MemberService
  ) {
    this.route.data.pipe(map(res => res.user)).subscribe(([user, userRecord]) => {
      this.user = user;
      this.userRecord = userRecord;
      this.listenCurrentSong();
    });
  }

  ngOnInit() {
    // this.testArr = Array(10).fill(3);
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

  onChangeRecordType(type: number) {
    if (this.recordType !== type) {
      this.recordType = type;
      this.memberServe.userRecord(this.user.profile.userId, this.recordType)
        .subscribe(userRecord => this.userRecord = userRecord);
    }
  }


   // 添加一首歌曲
   onAddSong([song, play]) {
    if (!this.currentSong || this.currentSong.id !== song.id) {
      this.songServe.getSongList(song).subscribe(list => this.multipleReducerServe.insertSong(list[0], play));
    }
  }

   // 收藏歌曲
   onLikeSong(id: string) {
    this.multipleReducerServe.likeSongs(id);
  }

  // 分享
  onShareSong(song: Song) {
    const txt = this.makeTxt('单曲', song.name, song.ar);
    this.multipleReducerServe.share({ id: song.id, type: 'song', txt });
  }

  private makeTxt(type: string, name: string, makeBy: Singer[]): string {
    let makeByStr = makeBy.map(item => item.name).join('/');
    return `${type}：${name} -- ${makeByStr}`;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
