import {Injectable, Inject} from '@angular/core';
import {ServiceModule} from "../service.module";
import {HttpClient, HttpParams} from "@angular/common/http";
import { Observable, throwError } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import queryString from 'query-string';
import { User, UserRecord, recordVal, UserSheet } from '../data-modals/member.models';
import { LoginParams } from 'src/app/share/wy-ui/wy-layer/wy-login-phone/wy-login-phone.component';
import { formatSinger } from 'src/app/utils/format';
import { SongSheet } from '../data-modals/common.models';
import { API_CONFIG } from 'src/app/core/inject-tokens';

export type sampleBack = {
  [key: string]: any;
  code: number;
}

export enum RecordType {
  AllData,
  weekData
}

const records = ['allData', 'weekData'];

@Injectable({
  providedIn: ServiceModule
})
export class MemberService {
  constructor(private http: HttpClient, @Inject(API_CONFIG) private uri: string) {}

  // 签到/daily_signin
  signIn(): Observable<sampleBack | Observable<never>> {
    const params = new HttpParams({fromString: queryString.stringify({ type: 1 })});
    return this.http.get(this.uri + 'daily_signin', { params })
    .pipe(map((res: { code: number; point?: number; msg?: string; }) => {
      if (res.code === 200) {
        return res as sampleBack;
      }else{
        return throwError(res);
      }
    }));
  }

  login(values: LoginParams): Observable<User> {
    const params = new HttpParams({fromString: queryString.stringify(values)});
    return this.http.get(this.uri + 'login/cellphone', { params })
    .pipe(switchMap((res: User) => this.userDetail(res.profile.userId)));
  }

  logOut(): Observable<number> {
    return this.http.get(this.uri + 'logout').pipe(map((res: { code: number; }) => res.code as number));
  }
  
  
  refreshLogin(id: number): Observable<User> {
    return this.http.get(this.uri + 'login/refresh')
    .pipe(switchMap(() => this.userDetail(id)));
  }

  userDetail(uid: number): Observable<User> {
    const params = new HttpParams({fromString: queryString.stringify({ uid })});
    return this.http.get(this.uri + 'user/detail', { params })
    .pipe(map(res => res as User));
  }

  userRecord(uid: number, type = RecordType.weekData): Observable<recordVal[]> {
    const params = new HttpParams({fromString: queryString.stringify({ uid, type })});
    return this.http.get(this.uri + 'user/record', { params })
    .pipe(map((res: UserRecord) => {
      const copy = res[records[type]].slice();
      copy.forEach(item => {
        const ar = item.song.ar.slice();
        item.song.ar = formatSinger(ar);
      });
      // console.log('copy :', copy);
      return copy;
    }));
  }


  // 获取用户歌单(自建或收藏的)
  userSheets(uid: number): Observable<UserSheet> {
    const params = new HttpParams({fromString: queryString.stringify({ uid })});
    return this.http.get(this.uri + 'user/playlist', { params })
    .pipe(map((res: { playlist: SongSheet[] }) => {
      const list = res.playlist.slice();
      return {
        self: list.filter(item => !item.subscribed),
        subscribed: list.filter(item => item.subscribed)
      }
    }))
  }


  // 新建歌单
  createSheet(name: string): Observable<sampleBack> {
    const params = new HttpParams({fromString: queryString.stringify({ name })});
    return this.http.get(this.uri + 'playlist/create', { params }).pipe(map(res => res as sampleBack));
  }


  // 收藏歌单
  likeSheet(id: number, t = 1): Observable<number> {
    const params = new HttpParams({fromString: queryString.stringify({ id, t })});
    return this.http.get(this.uri + 'playlist/subscribe', { params })
    .pipe(map((res: { code: number }) => res.code));
  }

  // 收藏歌曲
  likeSong(pid: number, tracks: string, op = 'add'): Observable<number> {
    const params = new HttpParams({fromString: queryString.stringify({ pid, tracks, op })});
    return this.http.get(this.uri + 'playlist/tracks', { params })
    .pipe(map((res: { code: number }) => res.code));
  }

  // 分享
  userShare(id: number, msg = '', type = 'song'): Observable<number> {
    const params = new HttpParams({fromString: queryString.stringify({ id, type, msg })});
    return this.http.get(this.uri + 'share/resource', { params })
    .pipe(map((res: { code: number }) => res.code));
  }
}