import {Inject, Injectable} from '@angular/core';
import {ServiceModule} from "../service.module";
import {HttpClient, HttpErrorResponse, HttpParams} from "@angular/common/http";
import {API_CONFIG} from "../../core/inject-tokens";
import { playlistInfo } from '../data-modals/common.models';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import queryString from 'query-string';

export type SheetParams = {
  cat: string,
  limit: number,
  offset: number,
  order: string
};

@Injectable({
  providedIn: ServiceModule
})
export class MemberService {
  constructor(private http: HttpClient, @Inject(API_CONFIG) private config: string) { }
  login(values: { phone: number; password: string }): Observable<playlistInfo> {
    
    const params = new HttpParams({fromString: queryString.stringify(values)});
    return this.http.get(this.config + 'login/cellphone', { params })
    .pipe(map(res => res as playlistInfo), catchError(this.handleError));
  }
  
  
  private handleError(error: HttpErrorResponse): never {
    throw new Error(error.error);
  };
}
