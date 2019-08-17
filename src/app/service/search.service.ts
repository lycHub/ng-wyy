
import {Injectable, Inject} from '@angular/core';
import { API_CONFIG } from '../core/inject-tokens';
import { ServiceModule } from './service.module';
import { Singer, SongSheet, Song } from './data-modals/common.models';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export type SearchResult = {
  artists?: Singer[],
  playlists?: SongSheet[],
  songs?: Song[]
}

@Injectable({
  providedIn: ServiceModule
})
export class SearchService {
  constructor(private http: HttpClient, @Inject(API_CONFIG) private uri: string) { }
  search(keywords: string): Observable<SearchResult> {
    const params = new HttpParams().set('keywords', keywords);
    return this.http.get(this.uri + 'search/suggest', { params })
      .pipe(map((res: {result: SearchResult}) => res.result));
  }
}
