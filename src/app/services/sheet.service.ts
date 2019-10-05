import { ServicesModule, API_CONFIG } from './services.module';
import { Injectable, Inject } from '@angular/core';
import { SongSheet, Song, SheetList } from './data-types/common.types';
import { Observable, from } from 'rxjs';
import { HttpParams, HttpClient } from '@angular/common/http';
import { map, pluck, switchMap } from 'rxjs/internal/operators';
import { SongService } from './song.service';
import queryString from 'query-string';

export interface SheetParams {
  offset: number;
  limit: number;
  order: 'new' | 'hot';
  cat: string;
}

@Injectable({
  providedIn: ServicesModule
})
export class SheetService {

  constructor(
    private http: HttpClient,
    @Inject(API_CONFIG) private uri: string,
    private songServe: SongService
  ) { }

  // 获取歌单列表
  getSheets(args: SheetParams): Observable<SheetList> {
    const params = new HttpParams({ fromString: queryString.stringify(args) });
    return this.http.get(this.uri + 'top/playlist', { params }).pipe(map(res => res as SheetList));
  }

  // 获取歌单详情
  getSongSheetDetail(id: number): Observable<SongSheet> {
    const params = new HttpParams().set('id', id.toString());
    return this.http.get(this.uri + 'playlist/detail', { params })
    .pipe(map((res: { playlist: SongSheet }) => res.playlist));
  }


  playSheet(id: number): Observable<Song[]> {
    return this.getSongSheetDetail(id)
    .pipe(pluck('tracks'), switchMap(tracks => this.songServe.getSongList(tracks)));
  }
}
