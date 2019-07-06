import {Inject, Injectable} from '@angular/core';
import {ServiceModule} from "../service.module";
import {HttpClient, HttpErrorResponse, HttpParams} from "@angular/common/http";
import {API_CONFIG} from "../../core/inject-tokens";
import { playlistInfo } from '../data.models';
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
export class SheetService {
  constructor(private http: HttpClient, @Inject(API_CONFIG) private config: string) { }
  getSheetList(obj: SheetParams): Observable<playlistInfo> {
    
    const params = new HttpParams({fromString: queryString.stringify(obj)});
    return this.http.get(this.config + 'top/playlist', { params })
    .pipe(map(res => res as playlistInfo), catchError(this.handleError));
  }
  
  
  private handleError(error: HttpErrorResponse): never {
    throw new Error(error.error);
  };
}
