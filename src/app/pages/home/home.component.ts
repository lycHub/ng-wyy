import { Component, ViewChild, OnDestroy } from '@angular/core';
import {Banner, HotTag, SongSheet} from "../../service/data-modals/common.models";
import {NzCarouselComponent} from "ng-zorro-antd";
import {ActivatedRoute, Router} from "@angular/router";
import {map, takeUntil} from "rxjs/internal/operators";
import { SongService } from 'src/app/service/song/song.service';
import { MultipleReducersService } from 'src/app/store/multiple-reducers.service';
import { AppStoreModule } from 'src/app/store';
import { Store, select } from '@ngrx/store';
import { SetModalVisible } from 'src/app/store/actions/member.actions';
import { Observable, Subject } from 'rxjs';
import { getUserInfo } from '../../store/selectors/member.selector';
import { User } from 'src/app/service/data-modals/member.models';
import { SheetService } from '../../service/sheet/sheet.service';
import { ModalTypes } from '../../store/reducers/member.reducer';
import { SetModalType } from '../../store/actions/member.actions';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnDestroy {
  arr = Array(5).fill(3);
  banners: Banner[];
  hotTags: HotTag[];
  songSheetList: SongSheet[];

  user: User;
  
  // 轮播当前索引
  carouselActiveIndex = 0;
  get bannerBg(): string {
    return this.banners && this.banners[this.carouselActiveIndex].bgColor;
  }
  
  private appStore$: Observable<AppStoreModule>;
  private destroy$ = new Subject<void>();
  
  @ViewChild(NzCarouselComponent, { static: true }) private nzCarousel: NzCarouselComponent;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sheetServe: SheetService,
    private songServe: SongService,
    private store$: Store<AppStoreModule>,
    private multipleReducerServe: MultipleReducersService) {
     this.route.data.pipe(map(res => res.homeDatas)).subscribe(([banners, hotTags, songSheetList]) => {
      this.banners = banners;
      this.hotTags = hotTags;
      this.songSheetList = songSheetList;
    });

    this.appStore$ = this.store$.pipe(select('member'), takeUntil(this.destroy$));
    this.appStore$.pipe(select(getUserInfo)).subscribe(user => this.user = user);
  }

  onChangeSlide(type) {
    this.nzCarousel[type]();
  }
  nzBeforeChange({ to }) {
    this.carouselActiveIndex = to;
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

  openModal() {
    this.multipleReducerServe.showModal(ModalTypes.Default);
  }

  
  
  toInfo(id: number) {
    this.router.navigate(['/sheetInfo', id]);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  trackByBanners(index: number, banner: Banner): number { return banner.targetId; }
  trackByHotTags(index: number, tag: HotTag): number { return tag.id; }
  trackBySongList(index: number, songSheet: SongSheet): number { return songSheet.id; }
}
