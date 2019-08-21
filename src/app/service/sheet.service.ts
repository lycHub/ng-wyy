import {Injectable, Inject} from '@angular/core';
import {ServiceModule} from "./service.module";
import {HttpClient, HttpParams} from "@angular/common/http";
import { playlistInfo, SongSheet, Song } from './data-modals/common.models';
import { Observable } from 'rxjs';
import { map, switchMap, pluck } from 'rxjs/operators';
import queryString from 'query-string';
import { API_CONFIG } from 'src/app/core/inject-tokens';
import { SongService } from './song.service';

export type SheetParams = {
  cat: string,
  limit: number,
  offset: number,
  order: string
};

@Injectable({
  providedIn: ServiceModule
})
export class SheetService {
  constructor(
    private http: HttpClient,
    @Inject(API_CONFIG) private uri: string,
    private songServe: SongService
  ) { }
  getSheetList(obj: SheetParams): Observable<playlistInfo> {
    const params = new HttpParams({fromString: queryString.stringify(obj)});
    return this.http.get(this.uri + 'top/playlist', { params })
    .pipe(map(res => res as playlistInfo));
  }

  // 歌单详情
  getSongSheetDetail(id: number): Observable<SongSheet> {
    const params = new HttpParams().set('id', id.toString());
    return this.http.get(this.uri + 'playlist/detail', { params })
    .pipe(map((res: {playlist: SongSheet}) => res.playlist));
  }

  // 播放歌单
  playSheet(id: number): Observable<Song[]> {
    return this.getSongSheetDetail(id)
    .pipe(pluck('tracks'), switchMap(tracks => this.songServe.getSongList(tracks)));
  }
}
