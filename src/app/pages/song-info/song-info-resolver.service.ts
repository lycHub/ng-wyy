import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {forkJoin, Observable} from "rxjs/index";
import {catchError, take} from "rxjs/internal/operators";
import {HttpErrorResponse} from "@angular/common/http";
import {Lyric, Song} from "../../service/data-modals/common.models";
import {SongService} from "../../service/song.service";

type SongDataModel = [Song, Lyric];

@Injectable()
export class SongInfoResolverService implements Resolve<SongDataModel> {
  constructor(private songServe: SongService) {}
  
  resolve(route: ActivatedRouteSnapshot): Observable<SongDataModel> {
    const id = route.paramMap.get('id');
    return forkJoin([
      this.songServe.getSongDetail(id),
      this.songServe.getLyric(Number(id))
    ]).pipe(take(1), catchError(this.handleError));
  }
  
  private handleError(error: HttpErrorResponse): never {
    throw new Error(error.error);
  };
}