import {Injectable, Inject} from '@angular/core';
import {ServiceModule} from "./service.module";
import {HttpClient} from "@angular/common/http";
import {Banner, HotTag, SongSheet} from "./data-modals/common.models";
import {Observable} from "rxjs/index";
import {map} from "rxjs/internal/operators";
import { API_CONFIG } from 'src/app/core/inject-tokens';

@Injectable({
  providedIn: ServiceModule
})
export class HomeService {
  constructor(private http: HttpClient, @Inject(API_CONFIG) private uri: string) { }
  
  getBanners(): Observable<Banner[]> {
    return this.http.get(this.uri + 'banner')
      .pipe(map((res: { banners: Banner[] }) => res.banners));
  }
  
  
  // 热门标签
  getHotTags(): Observable<HotTag[]> {
    return this.http.get(this.uri + 'playlist/hot')
      .pipe(
        map((res: {tags: HotTag[]}) => res.tags.sort((x: HotTag, y: HotTag) => x.position - y.position).slice(0, 5)));
  }
  
  
  // 推荐歌单
  getPersonalSongList(): Observable<SongSheet[]> {
    // const params = new HttpParams().set('id', id.toString());
    return this.http.get(this.uri + 'personalized').pipe(
      map((res: {result: SongSheet[]}) => res.result.slice(0, 16)));
  }
}
