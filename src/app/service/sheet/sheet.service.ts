import {Injectable} from '@angular/core';
import {ServiceModule} from "../service.module";
import {HttpClient, HttpParams} from "@angular/common/http";
import { playlistInfo } from '../data-modals/common.models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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
  constructor(private http: HttpClient) { }
  getSheetList(obj: SheetParams): Observable<playlistInfo> {
    
    const params = new HttpParams({fromString: queryString.stringify(obj)});
    return this.http.get('/api/top/playlist', { params })
    .pipe(map(res => res as playlistInfo));
  }
}
