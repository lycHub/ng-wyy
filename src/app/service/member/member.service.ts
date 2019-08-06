import {Inject, Injectable} from '@angular/core';
import {ServiceModule} from "../service.module";
import {HttpClient, HttpParams} from "@angular/common/http";
import {API_CONFIG} from "../../core/inject-tokens";
import { Observable } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import queryString from 'query-string';
import { User } from '../data-modals/member.models';

export type SheetParams = {
  cat: string,
  limit: number,
  offset: number,
  order: string
};

export type SignBack = {
  point: number;
  code: number;
}

@Injectable({
  providedIn: ServiceModule
})
export class MemberService {
  constructor(private http: HttpClient, @Inject(API_CONFIG) private config: string) {}

  // 签到/daily_signin
  signIn(): Observable<SignBack> {
    const params = new HttpParams({fromString: queryString.stringify({ type: 1 })});
    return this.http.get(this.config + 'daily_signin', { params })
    .pipe(map(res => res as SignBack));
  }

  login(values: { phone: number; password: string }): Observable<User> {
    const params = new HttpParams({fromString: queryString.stringify(values)});
    return this.http.get(this.config + 'login/cellphone', { params })
    .pipe(switchMap((res: User) => {
      return this.userDetail(res.profile.userId)
    }));
  }

  private userDetail(uid: number): Observable<User> {
    const params = new HttpParams({fromString: queryString.stringify({ uid })});
    return this.http.get(this.config + 'user/detail', { params })
    .pipe(map(res => res as User));
  }
}
