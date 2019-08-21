import { Component, ViewChild, OnDestroy } from '@angular/core';
import {Banner, HotTag, SongSheet, Singer} from "../../service/data-modals/common.models";
import {NzCarouselComponent} from "ng-zorro-antd";
import {ActivatedRoute, Router} from "@angular/router";
import {map, takeUntil} from "rxjs/internal/operators";
import { MultipleReducersService } from 'src/app/store/multiple-reducers.service';
import { AppStoreModule } from 'src/app/store';
import { Store, select } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { getUserInfo } from '../../store/selectors/member.selector';
import { User } from 'src/app/service/data-modals/member.models';
import { SheetService } from '../../service/sheet.service';
import { ModalTypes } from '../../store/reducers/member.reducer';

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
  singers: Singer[];

  user: User;
  
  // 轮播当前索引
  carouselActiveIndex = 0;
  private appStore$: Observable<AppStoreModule>;
  private destroy$ = new Subject<void>();
  
  @ViewChild(NzCarouselComponent, { static: true }) private nzCarousel: NzCarouselComponent;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sheetServe: SheetService,
    private store$: Store<AppStoreModule>,
    private multipleReducerServe: MultipleReducersService) {
     this.route.data.pipe(map(res => res.homeDatas)).subscribe(([banners, hotTags, songSheetList, singers]) => {
      this.banners = banners;
      this.hotTags = hotTags;
      this.songSheetList = songSheetList;
      this.singers = singers;
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

  playSheet(id: number) {
    this.sheetServe.playSheet(id).subscribe(list => {
      if (list.length) {
        this.multipleReducerServe.selectPlay(({ list, index: 0 }));
      }
    });
  }

  openModal() {
    this.multipleReducerServe.controlModal(ModalTypes.Default);
  }

  
  
  toInfo(id: number) {
    this.router.navigate(['/sheetInfo', id]);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
