import {Inject, Injectable} from '@angular/core';
import {ServiceModule} from "../service.module";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Banner, HotTag, SongItem} from "../data.models";
import {forkJoin, Observable} from "rxjs/index";
import {catchError, map} from "rxjs/internal/operators";
import {API_CONFIG} from "../../core/inject-tokens";

@Injectable({
  providedIn: ServiceModule
})
export class HomeService {
  constructor(private http: HttpClient, @Inject(API_CONFIG) private config: string) { }
  
  getBanners(): Observable<Banner[]> {// bgColor
    const bgColor = ['#f1f0ee', '#5e786b', '#040404', '#eff1fd', '#202441', '#f1eee9', '#c17335', '#f1f1e7', '#5a5a5a'];
    return this.http.get(this.config + 'banner')
      .pipe(map((res: {banners: Banner[]; code: number;}) => {
        res.banners.forEach((item, key) => {
          item.bgColor = bgColor[key]
        });
        return res.banners;
      }), catchError(this.handleError));
  }
  
  
  // 热门标签
  getHotTags(): Observable<HotTag[]> {
    return this.http.get(this.config + 'playlist/hot')
      .pipe(
        map((res: {tags: HotTag[]}) => res.tags.sort((x: HotTag, y: HotTag) => x.position - y.position).slice(0, 5)),
        catchError(this.handleError)
      );
  }
  
  
  // 推荐歌单
  getPersonalSongList(): Observable<SongItem[]> {
    return this.http.get(this.config + 'personalized').pipe(
      map((res: {result: SongItem[]}) => res.result.slice(0, 8)),
      catchError(this.handleError));
  }
  
  
  getHomeDatas(): Observable<any> {
    return forkJoin([
      this.getBanners(),
      this.getHotTags(),
      this.getPersonalSongList()
    ]);
  }
  
  private handleError(error: HttpErrorResponse): never {
    throw new Error(error.error);
  };
}
