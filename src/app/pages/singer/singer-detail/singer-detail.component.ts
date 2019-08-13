import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, takeUntil } from 'rxjs/operators';
import { SingerDetail } from '../../../service/singer/singer.service';
import { Singer, Song } from 'src/app/service/data-modals/common.models';
import { Observable, Subject } from 'rxjs';
import { AppStoreModule } from 'src/app/store';
import { MultipleReducersService } from 'src/app/store/multiple-reducers.service';
import { Store, select } from '@ngrx/store';
import { NzMessageService } from 'ng-zorro-antd';
import { MemberService } from 'src/app/service/member/member.service';
import { SongService } from 'src/app/service/song/song.service';
import { getCurrentSong } from 'src/app/store/selectors/player.selector';
import { findIndex } from 'src/app/utils/array';

@Component({
  selector: 'app-singer-detail',
  templateUrl: './singer-detail.component.html',
  styleUrls: ['./singer-detail.component.less']
})
export class SingerDetailComponent implements OnInit, OnDestroy {
  detail: SingerDetail;
  simiSingers: Singer[];
  alias = '';
  currentIndex = -1;
  hasLiked = false;

  private currentSong: Song;
  private appStore$: Observable<AppStoreModule>;
  private destroy$ = new Subject<void>();
  constructor(
    private route: ActivatedRoute,
    private songServe: SongService,
    private memberServe: MemberService,
    private messageServe: NzMessageService,
    private multipleReducerServe: MultipleReducersService,
    private store$: Store<AppStoreModule>
  ) {
    this.route.data.pipe(map(res => res.singerDatas)).subscribe(([detail, singers]) => {
      console.log('detail :', detail);
      this.detail = detail;
      this.simiSingers = singers;
      if (this.detail) {
        this.alias = this.detail.artist.alias.join('；');
      }
    });
    this.listenCurrentSong();
  }

  ngOnInit() {
  }


  playSong(songs: Song[]) {
    this.songServe.getSongList(songs).subscribe(list => {
      if (list.length) {
        this.multipleReducerServe.selectPlay(({ list, index: 0 }));
      }
    });
  }


   // 添加一首歌曲
   onAddSong(song: Song, play = false) {
    if (this.currentSong && this.currentSong.id === song.id) {
      console.log('存在');
    }else{
      this.songServe.getSongList(song).subscribe(list => this.multipleReducerServe.insertSong(list[0], play));
    }
  }
  
  // 添加歌单
  onAddSongs(songs: Song[]) {
    this.songServe.getSongList(songs).subscribe(list => {
      this.multipleReducerServe.insertSongs(list);
    });
  }


  // 批量收藏歌曲
  onLikeSongs(songs: Song[]) {
    this.onLikeSong(songs.map(item => item.id).join(','));
  }

   // 收藏歌曲
   onLikeSong(ids: string) {
    this.multipleReducerServe.likeSongs(ids);
  }

  // 收藏歌手
  onLikeSinger(id: number) {
    let typeInfo = {
      type: 1,
      msg: '收藏'
    }
    if (this.hasLiked) {
      typeInfo = {
        type: 2,
        msg: '取消收藏'
      }
    }
    this.memberServe.likeSinger(id, typeInfo.type).subscribe(code => {
      console.log('code :', code);
      if (code === 200) {
        this.hasLiked = !this.hasLiked;
        this.alertMessage('success', typeInfo.msg + '成功');
      }
    }, error => {
      this.alertMessage('error', error.msg ||  typeInfo.msg + '失败');
    });
  }


  // 分享
  onShare(info: Song, type = 'song') {
    const txt = this.makeTxt('单曲', info.name, (<Song>info).ar);
    this.multipleReducerServe.share({ id: info.id, type, txt });
  }

  private makeTxt(type: string, name: string, makeBy: Singer[]): string {
    const makeByStr = makeBy.map(item => item.name).join('/');
    return `${type}：${name} -- ${makeByStr}`;
  }




  private listenCurrentSong() {
    this.appStore$ = this.store$.pipe(select('player'), takeUntil(this.destroy$));
    this.appStore$.pipe(select(getCurrentSong)).subscribe(song => {
      // console.log('listenCurrentSong :', song);
      this.currentSong = song;
      if (song) {
        this.currentIndex = findIndex(this.detail.hotSongs, song);
      }else{
        this.currentIndex = -1;
      }
    });
  }


  private alertMessage(type: string, msg: string) {
    this.messageServe.create(type, msg);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
