import {Component, OnInit, ChangeDetectionStrategy, ViewChild} from '@angular/core';
import {RecommendService} from "../../service/recommend/recommend.service";
import {Banner} from "../../service/recommend/data.models";
import {NzCarouselComponent} from "ng-zorro-antd";

@Component({
  selector: 'app-recommend',
  templateUrl: './recommend.component.html',
  styleUrls: ['./recommend.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecommendComponent implements OnInit {
  arr = Array(8).fill(4);
  banners: Banner[];
  
  // 轮播当前索引
  carouselActiveIndex = 0;
  
  get bannerBg(): string {
    return this.banners && this.banners[this.carouselActiveIndex].bgColor;
  }
  
  @ViewChild(NzCarouselComponent) private nzCarousel: NzCarouselComponent;
  constructor(private recommendServe: RecommendService) {
    this.recommendServe.getBanners().subscribe(res => {
      console.log(res);
      this.banners = res;
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
}
