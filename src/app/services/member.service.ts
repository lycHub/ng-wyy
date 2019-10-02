import { Injectable, Inject } from '@angular/core';
import { ServicesModule, API_CONFIG } from './services.module';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Banner, HotTag, SongSheet } from './data-types/common.types';
import { map } from 'rxjs/internal/operators';
import { LoginParams } from '../share/wy-ui/wy-layer/wy-layer-login/wy-layer-login.component';
import { User } from './data-types/member.type';
import queryString from 'query-string';

@Injectable({
  providedIn: ServicesModule
})
export class MemberService {
  constructor(private http: HttpClient, @Inject(API_CONFIG) private uri: string) { }
  login(formValue: LoginParams): Observable<User> {
    const params = new HttpParams({ fromString: queryString.stringify(formValue) });
    return this.http.get(this.uri + 'login/cellphone', { params })
    .pipe(map(res => res as User));
  }
}
