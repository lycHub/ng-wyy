import {Component, OnInit, ViewChild, Inject} from '@angular/core';
import {Banner, HotTag, Song, SongSheet, SongUrl} from "../../service/data.models";
import {NzCarouselComponent} from "ng-zorro-antd";
import {NzIconService} from "ng-zorro-antd/icon";
import {ActivatedRoute} from "@angular/router";
import {map, mergeMap} from "rxjs/internal/operators";
import {ICON_FONT} from "../../core/inject-tokens";
import {SongService} from "../../service/song/song.service";
import {from, of} from "rxjs/index";

export interface SongSheetList extends SongSheet {
  url: string;
}
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {
  // arr = Array(100).fill(3);
  banners: Banner[];
  hotTags: HotTag[];
  songList: Song[];
  
  // 轮播当前索引
  carouselActiveIndex = 0;
  get bannerBg(): string {
    return this.banners && this.banners[this.carouselActiveIndex].bgColor;
  }
  
  
  songSheetList: SongSheetList[] = [];
  
  
  @ViewChild(NzCarouselComponent) private nzCarousel: NzCarouselComponent;
  constructor(private SongServe: SongService, private route: ActivatedRoute, @Inject(ICON_FONT) private iconfont: NzIconService) {
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
  
  // 播放歌单
  /*playSong(id: number) {
    console.log('click', id);
    this.SongServe.getSongSheetDetail(id).subscribe(res => {
      const sheet = res;
      this.getSongUrls(res.map(item => item.id).join(','))
    })
  }
  
  private getSongUrls(id: string) {
    debugger;
    this.SongServe.getSongUrl(id).subscribe(res => {
      console.log(res);
    })
  }*/
  
  
  playSong(id: number) {
    this.SongServe.getSongList(id).subscribe(res => {
      this.generateSongList(res);
    })
  }
  
  private generateSongList({ sheet, urls }) {
     const result = [];
     from(<SongSheet[]>sheet).pipe(mergeMap(item => {
      const url = <string>urls.find(url => url.id === item.id).url;
        return of({
          id: item.id,
          name: item.name,
          ar: item.ar,
          url
        });
      })).subscribe(
        res => {
          if (res.url) {
            result.push(res);
          }
        },
        error => console.error(error),
        () => this.songSheetList = result
     );
  }
  
  
  trackByBanners(index: number, banner: Banner): number { return banner.targetId; }
  trackByHotTags(index: number, tag: HotTag): number { return tag.id; }
  trackBySongList(index: number, song: Song): number { return song.id; }
}
