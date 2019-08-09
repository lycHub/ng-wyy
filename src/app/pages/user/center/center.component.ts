import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { User, recordVal } from 'src/app/service/data-modals/member.models';
import { Song } from 'src/app/service/data-modals/common.models';
import { Observable, Subject } from 'rxjs';
import { AppStoreModule } from 'src/app/store';
import { MemberService, RecordType } from 'src/app/service/member/member.service';

@Component({
  selector: 'app-center',
  templateUrl: './center.component.html',
  styleUrls: ['./center.component.less']
})
export class CenterComponent implements OnInit, OnDestroy {
  user: User;
  testArr: number[];
  userRecord: recordVal[];

  recordType = RecordType.weekData

  currentIndex = -1;
  private currentSong: Song;
  
  private appStore$: Observable<AppStoreModule>;
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private memberServe: MemberService
  ) {
    this.route.data.pipe(map(res => res.user)).subscribe(([user, userRecord]) => {
      console.log('userRecord :', userRecord);
      this.user = user;
      this.userRecord = userRecord;
    });
  }

  ngOnInit() {
    // this.testArr = Array(10).fill(3);
  }

  changeRecord(type: number) {
    if (this.recordType !== type) {
      this.recordType = type;
      this.memberServe.userRecord(this.user.profile.userId, this.recordType)
        .subscribe(userRecord => this.userRecord = userRecord);
    }
  }


   // 添加一首歌曲
   onAddSong(song: Song, play = false) {
    if (this.currentSong && this.currentSong.id === song.id) {
      console.log('存在');
    }else{
      // this.songServe.getSongList(song).subscribe(list => this.multipleReducerServe.insertSong(list[0], play));
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
