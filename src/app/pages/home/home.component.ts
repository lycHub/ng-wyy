import {Component, OnInit, ChangeDetectionStrategy, ViewChild, Inject} from '@angular/core';
import {Banner, HotTag, SongItem} from "../../service/data.models";
import {NzCarouselComponent} from "ng-zorro-antd";
import {NzIconService} from "ng-zorro-antd/icon";
import {Observable} from "rxjs/index";
import {ActivatedRoute} from "@angular/router";
import {map} from "rxjs/internal/operators";
import {ICON_FONT} from "../../core/inject-tokens";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {
  banners: Banner[];
  hotTags: HotTag[];
  songList: SongItem[];
  
  // 轮播当前索引
  carouselActiveIndex = 0;
  
  private data$: Observable<any[]>;
  
  get bannerBg(): string {
    return this.banners && this.banners[this.carouselActiveIndex].bgColor;
  }
  
  @ViewChild(NzCarouselComponent) private nzCarousel: NzCarouselComponent;
  constructor(private route: ActivatedRoute, @Inject(ICON_FONT) private iconfont: NzIconService) {
    this.route.data.pipe(map(res => res.homeDatas)).subscribe(([banners, hotTags, songList]) => {
      this.banners = banners;
      this.hotTags = hotTags;
      this.songList = songList;
    });
  }

  ngOnInit() {
  }
  
  onChangeSlide(type) {
    this.nzCarousel[type]();
  }
  nzBeforeChange({ to }) {
    this.carouselActiveIndex = to;
  }
  
  
  trackByBanners(index: number, banner: Banner): number { return banner.targetId; }
  trackByHotTags(index: number, tag: HotTag): number { return tag.id; }
  trackBySongList(index: number, song: SongItem): number { return song.id; }
}
