import {Component, OnInit, ViewChild} from '@angular/core';
import {Banner, HotTag, Song} from "../../service/data.models";
import {NzCarouselComponent} from "ng-zorro-antd";
import {ActivatedRoute} from "@angular/router";
import {map} from "rxjs/internal/operators";
import {SongService, SongSheetList} from "../../service/song/song.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {
  // arr = Array(100).fill(3);
  banners: Banner[];
  hotTags: HotTag[];
  songSheetList: Song[];
  
  // 轮播当前索引
  carouselActiveIndex = 0;
  get bannerBg(): string {
    return this.banners && this.banners[this.carouselActiveIndex].bgColor;
  }
  
  
  songList: SongSheetList[] = [];
  
  
  @ViewChild(NzCarouselComponent) private nzCarousel: NzCarouselComponent;
  constructor(private SongServe: SongService, private route: ActivatedRoute) {
     this.route.data.pipe(map(res => res.homeDatas)).subscribe(([banners, hotTags, songSheetList]) => {
      this.banners = banners;
      this.hotTags = hotTags;
      this.songSheetList = songSheetList;
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
  
  
  playSong(id: number) {
    this.SongServe.getSongList(id).subscribe(res => this.songList = res);
  }
  
  
  trackByBanners(index: number, banner: Banner): number { return banner.targetId; }
  trackByHotTags(index: number, tag: HotTag): number { return tag.id; }
  trackBySongList(index: number, song: Song): number { return song.id; }
}
