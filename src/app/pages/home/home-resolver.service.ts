import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import {forkJoin, Observable} from "rxjs/index";
import {HomeService} from "../../service/home/home.service";
import {catchError, take} from "rxjs/internal/operators";
import {HttpErrorResponse} from "@angular/common/http";
import {Banner, HotTag, SongSheet} from "../../service/data-modals/common.models";

type HomeDataModel = [Banner[], HotTag[], SongSheet[]];

@Injectable()
export class HomeResolverService implements Resolve<HomeDataModel> {
  constructor(private homeServe: HomeService) {}
  
  resolve(): Observable<HomeDataModel> {
    return forkJoin([
      this.homeServe.getBanners(),
      this.homeServe.getHotTags(),
      this.homeServe.getPersonalSongList()
    ]).pipe(take(1), catchError(this.handleError));
  }
  
  private handleError(error: HttpErrorResponse): never {
    throw new Error(error.error);
  };
}