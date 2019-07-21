import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import {Observable} from "rxjs/index";
import {catchError} from "rxjs/internal/operators";
import {HttpErrorResponse} from "@angular/common/http";
import { SongSheet } from 'src/app/service/data.models';
import { SongService } from 'src/app/service/song/song.service';


@Injectable()
export class SheetInfoResolverService implements Resolve<SongSheet> {
  constructor(private songServe: SongService) {}
  
  resolve(route: ActivatedRouteSnapshot): Observable<SongSheet> {
    return this.songServe.getSongSheetDetail(Number(route.paramMap.get('id'))).pipe(catchError(this.handleError));
  }
  
  private handleError(error: HttpErrorResponse): never {
    throw new Error(error.error);
  };
}