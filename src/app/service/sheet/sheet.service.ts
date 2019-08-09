import {Injectable} from '@angular/core';
import {ServiceModule} from "../service.module";
import {HttpClient, HttpParams} from "@angular/common/http";
import { playlistInfo, SongSheet } from '../data-modals/common.models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import queryString from 'query-string';
import { formatSinger } from 'src/app/utils/format';

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
  constructor(private http: HttpClient) { }
  getSheetList(obj: SheetParams): Observable<playlistInfo> {
    const params = new HttpParams({fromString: queryString.stringify(obj)});
    return this.http.get('/api/top/playlist', { params })
    .pipe(map(res => res as playlistInfo));
  }

  // 歌单详情
  getSongSheetDetail(id: number): Observable<SongSheet> {
    const params = new HttpParams().set('id', id.toString());
    return this.http.get('/api/playlist/detail', { params })
    .pipe(map((res: {playlist: SongSheet}) => {
      const copy = res.playlist.tracks.slice();
      copy.forEach(item => {
        const ar = item.ar.slice();
        item.ar = formatSinger(ar);
      });
      res.playlist.tracks = copy;
      return res.playlist;
    }));
  }
}
