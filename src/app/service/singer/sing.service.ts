import {Injectable, Inject} from '@angular/core';
import {ServiceModule} from "../service.module";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Singer} from "../data-modals/common.models";
import {Observable} from "rxjs";
import {map} from "rxjs/internal/operators";
import queryString from 'query-string';
import { API_CONFIG } from 'src/app/core/inject-tokens';

type SingerParams = {
  offset: number;
  limit: number;
  cat?: string;
}

const defaultParams = {
  offset: 0,
  limit: 9
}

@Injectable({
  providedIn: ServiceModule
})
export class SingService {
  constructor(private http: HttpClient, @Inject(API_CONFIG) private uri: string) {}
  
  // 歌手列表
  getEnterSingers(args: SingerParams = { ...defaultParams, cat: '5001' }): Observable<Singer[]> {
    const params = new HttpParams({fromString: queryString.stringify(args)});
    return this.http.get(this.uri + 'artist/list', { params })
      .pipe(map((res: {artists: Singer[]}) => res.artists));
  }

  // 热门歌手
  getHotSingers(args: SingerParams = defaultParams): Observable<Singer[]> {
    const params = new HttpParams({fromString: queryString.stringify(args)});
    return this.http.get(this.uri + 'top/artists', { params })
      .pipe(map((res: {artists: Singer[]}) => res.artists));
  }
}
