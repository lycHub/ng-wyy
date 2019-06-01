import {Inject, Injectable} from '@angular/core';
import {ServiceModule} from "../service.module";
import {HttpClient, HttpErrorResponse, HttpParams} from "@angular/common/http";
import {SongSheet, SongUrl} from "../data.models";
import {Observable} from "rxjs/index";
import {catchError, concatMap, map} from "rxjs/internal/operators";
import {API_CONFIG} from "../../core/inject-tokens";

@Injectable({
  providedIn: ServiceModule
})
export class SongService {
  constructor(private http: HttpClient, @Inject(API_CONFIG) private config: string) { }
  
  // 歌单详情
  getSongSheetDetail(id: number): Observable<SongSheet[]> {
    const params = new HttpParams().set('id', id.toString());
    return this.http.get(this.config + 'playlist/detail', { params })
      .pipe(
        map((res: {playlist: {tracks: SongSheet[]}}) => res.playlist.tracks),
        catchError(this.handleError)
      );
  }
  
  // 歌曲列表
  getSongUrl(id: string): Observable<SongUrl[]> {
    const params = new HttpParams().set('id', id);
    return this.http.get(this.config + 'song/url', { params })
      .pipe(
        map((res: {data: SongUrl[]}) => res.data),
        catchError(this.handleError)
      );
  }
  
  getSongList(id: number): Observable<{ sheet: SongSheet[]; urls: SongUrl[] }> {
    const detail$ =  this.getSongSheetDetail(id);
    return detail$.pipe(concatMap(sheet => {
      const ids = sheet.map(item => item.id).join(',');
      return this.getSongUrl(ids).pipe(map(urls => {
        return { sheet, urls };
      }));
    }))
  }
  
  private handleError(error: HttpErrorResponse): never {
    throw new Error(error.error);
  };
}
