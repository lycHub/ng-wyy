import {Component, OnInit, ChangeDetectionStrategy, ViewChild, Inject} from '@angular/core';
import {HomeService} from "../../service/home/home.service";
import {Banner} from "../../service/home/data.models";
import {NzCarouselComponent} from "ng-zorro-antd";
import {NzIconService} from "ng-zorro-antd/icon";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {
  arr = Array(8).fill(4);
  banners: Banner[];
  
  // 轮播当前索引
  carouselActiveIndex = 0;
  
  get bannerBg(): string {
    return this.banners && this.banners[this.carouselActiveIndex].bgColor;
  }
  
  @ViewChild(NzCarouselComponent) private nzCarousel: NzCarouselComponent;
  constructor(private homeServe: HomeService, @Inject('IconFont') private iconfont: NzIconService) {
    
    /*
    * http://localhost:3000/playlist/hot
    * http://localhost:3000/personalized
    * */
    this.homeServe.getBanners().subscribe(res => {
      // console.log(res);
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
