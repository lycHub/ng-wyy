import {Inject, Injectable} from '@angular/core';
import {ServiceModule} from "../service.module";
import {HttpClient, HttpErrorResponse, HttpParams} from "@angular/common/http";
import {Song, SongUrl, Lyric, SongSheet} from "../data.models";
import {Observable} from "rxjs/index";
import {catchError, map} from "rxjs/internal/operators";
import {API_CONFIG} from "../../core/inject-tokens";


export interface SongList extends Song {
  url: string;
}

@Injectable({
  providedIn: ServiceModule
})
export class SongService {
  constructor(private http: HttpClient, @Inject(API_CONFIG) private config: string) { }
  
  // 歌单详情
  getSongSheetDetail(id: number): Observable<SongSheet> {
    const params = new HttpParams().set('id', id.toString());
    return this.http.get(this.config + 'playlist/detail', { params })
      .pipe(
        map((res: {playlist: SongSheet}) => res.playlist),
        catchError(this.handleError)
      );
  }
  
  // 歌曲url列表
  getSongUrl(id: string): Observable<SongUrl[]> {
    const params = new HttpParams().set('id', id);
    return this.http.get(this.config + 'song/url', { params })
      .pipe(
        map((res: {data: SongUrl[]}) => res.data),
        catchError(this.handleError)
      );
  }


    // 歌曲url列表
 getLyric(id: number): Observable<Lyric> {
    const params = new HttpParams().set('id', id.toString());
    return this.http.get(this.config + 'lyric', { params })
      .pipe(
        map((res: { [type: string]: {lyric: string} }) => {
          return {
            lyric: res.lrc.lyric,
            tlyric: res.tlyric.lyric
          }
        }),
        catchError(this.handleError)
      );
  }


  getSongList(songs: Song[]) {
    return Observable.create(observer => {
      const ids = songs.map(item => item.id).join(',');
        this.getSongUrl(ids).subscribe(urls => {
          observer.next(this.generateSongList(songs, urls));
        });
    });
  }


  private generateSongList(songs: Song[], urls: SongUrl[]): SongList[] {
    const result = [];
    songs.forEach(song => {
      const url = <string>urls.find(url => url.id === song.id).url;
      result.push({
        id: song.id,
        name: song.name,
        ar: song.ar,
        al: song.al,
        dt: song.dt,
        url
      });
    });
    return result;
  }
  
  private handleError(error: HttpErrorResponse): never {
    throw new Error(error.error);
  };
}
