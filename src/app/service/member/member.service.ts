import {Injectable} from '@angular/core';
import {ServiceModule} from "../service.module";
import {HttpClient, HttpParams} from "@angular/common/http";
import { Observable, throwError } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import queryString from 'query-string';
import { User, UserRecord, recordVal, UserSheet } from '../data-modals/member.models';
import { LoginParams } from 'src/app/share/wy-ui/wy-layer/wy-login-phone/wy-login-phone.component';
import { formatSinger } from 'src/app/utils/format';
import { SongSheet } from '../data-modals/common.models';

export type SignBack = {
  point: number;
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
  constructor(private http: HttpClient) {}

  // 签到/daily_signin
  signIn(): Observable<SignBack | Observable<never>> {
    const params = new HttpParams({fromString: queryString.stringify({ type: 1 })});
    return this.http.get('/api/daily_signin', { params })
    .pipe(map((res: { code: number; point?: number; msg?: string; }) => {
      if (res.code === 200) {
        return res as SignBack;
      }else{
        return throwError(res);
      }
    }));
  }

  login(values: LoginParams): Observable<User> {
    const params = new HttpParams({fromString: queryString.stringify(values)});
    return this.http.get('/api/login/cellphone', { params })
    .pipe(switchMap((res: User) => this.userDetail(res.profile.userId)));
  }

  logOut(): Observable<number> {
    return this.http.get('/api/logout').pipe(map((res: { code: number; }) => res.code as number));
  }
  
  
  refreshLogin(id: number): Observable<User> {
    return this.http.get('/api/login/refresh')
    .pipe(switchMap(() => this.userDetail(id)));
  }

  userDetail(uid: number): Observable<User> {
    const params = new HttpParams({fromString: queryString.stringify({ uid })});
    return this.http.get('/api/user/detail', { params })
    .pipe(map(res => res as User));
  }

  userRecord(uid: number, type = RecordType.weekData): Observable<recordVal[]> {
    const params = new HttpParams({fromString: queryString.stringify({ uid, type })});
    return this.http.get('/api/user/record', { params })
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
    return this.http.get('/api/user/playlist', { params })
    .pipe(map((res: { playlist: SongSheet[] }) => {
      const list = res.playlist.slice();
      return {
        self: list.filter(item => !item.subscribed),
        subscribed: list.filter(item => item.subscribed)
      }
    }))
  }
}