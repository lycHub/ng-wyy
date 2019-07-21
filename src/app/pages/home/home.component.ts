import {Component, ViewChild} from '@angular/core';
import {Banner, HotTag, SongSheet} from "../../service/data.models";
import {NzCarouselComponent} from "ng-zorro-antd";
import {ActivatedRoute, Router} from "@angular/router";
import {map} from "rxjs/internal/operators";
import { SongService } from 'src/app/service/song/song.service';
import { MultipleReducersService } from 'src/app/store/multiple-reducers.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent {
  arr = Array(5).fill(3);
  banners: Banner[];
  hotTags: HotTag[];
  songSheetList: SongSheet[];
  
  // 轮播当前索引
  carouselActiveIndex = 0;
  get bannerBg(): string {
    return this.banners && this.banners[this.carouselActiveIndex].bgColor;
  }
  
  
  @ViewChild(NzCarouselComponent, { static: true }) private nzCarousel: NzCarouselComponent;
  constructor(private route: ActivatedRoute, private router: Router, private songServe: SongService, private multipleReducerServe: MultipleReducersService) {
     this.route.data.pipe(map(res => res.homeDatas)).subscribe(([banners, hotTags, songSheetList]) => {
      this.banners = banners;
      this.hotTags = hotTags;
      this.songSheetList = songSheetList;
    });
  }

  onChangeSlide(type) {
    this.nzCarousel[type]();
  }
  nzBeforeChange({ to }) {
    this.carouselActiveIndex = to;
  }

  playSong(id: number) {
    this.songServe.getSongList(id).subscribe(list => {
      this.multipleReducerServe.selectPlay(({ list, index: 0 }));
    });
  }


  
  
  toInfo(id: number) {
    this.router.navigate(['/sheetInfo', id]);
  }
  
  trackByBanners(index: number, banner: Banner): number { return banner.targetId; }
  trackByHotTags(index: number, tag: HotTag): number { return tag.id; }
  trackBySongList(index: number, songSheet: SongSheet): number { return songSheet.id; }
}
