import { Component, OnInit, ViewChild } from '@angular/core';
import { Banner, HotTag, SongSheet, Singer } from '../../services/data-types/common.types';
import { NzCarouselComponent } from 'ng-zorro-antd';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/internal/operators';
import { SheetService } from 'src/app/services/sheet.service';
import { Store, select } from '@ngrx/store';
import { AppStoreModule } from '../../store/index';
import { SetSongList, SetPlayList, SetCurrentIndex } from '../../store/actions/player.actions';
import { PlayState } from 'src/app/store/reducers/player.reducer';
import { findIndex, shuffle } from '../../utils/array';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {
  carouselActiveIndex = 0;
  banners: Banner[];
  hotTags: HotTag[];
  songSheetList: SongSheet[];
  singers: Singer[];

  private playerState: PlayState;

  @ViewChild(NzCarouselComponent, { static: true }) private nzCarousel: NzCarouselComponent;

  constructor(
    private route: ActivatedRoute,
    private sheetServe: SheetService,
    private store$: Store<AppStoreModule>
  ) {
    this.route.data.pipe(map(res => res.homeDatas)).subscribe(([banners, hotTags, songSheetList, singers]) => {
      this.banners = banners;
      this.hotTags = hotTags;
      this.songSheetList = songSheetList;
      this.singers = singers;
    });

    this.store$.pipe(select('player')).subscribe(res => this.playerState = res)
  }

  ngOnInit() {
  }

  onBeforeChange({ to }) {
    this.carouselActiveIndex = to;
  }

  onChangeSlide(type: 'pre' | 'next') {
    this.nzCarousel[type]();
  }


  onPlaySheet(id: number) {
    console.log('id :', id);
    this.sheetServe.playSheet(id).subscribe(list => {
      this.store$.dispatch(SetSongList({ songList: list }));

      let trueIndex = 0;
      let trueList = list.slice();

      if (this.playerState.playMode.type === 'random') {
        trueList = shuffle(list || []);
        trueIndex = findIndex(trueList, list[trueIndex]);
      }

      this.store$.dispatch(SetPlayList({ playList: trueList }));
      this.store$.dispatch(SetCurrentIndex({ currentIndex: trueIndex }));
    });
  }

}
