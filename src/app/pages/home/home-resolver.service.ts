import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import {Observable} from "rxjs/index";
import {HomeService} from "../../service/home/home.service";
import {catchError, take} from "rxjs/internal/operators";
import {HttpErrorResponse} from "@angular/common/http";
import {Banner, HotTag, SongItem} from "../../service/data.models";

type HomeDataModel = [Banner[], HotTag[], SongItem[]];

@Injectable()
export class HomeResolverService implements Resolve<HomeDataModel> {
  constructor(private homeServe: HomeService) {}
  
  resolve(): Observable<HomeDataModel> {
    return this.homeServe.getHomeDatas().pipe(take(1), catchError(this.handleError));
  }
  
  private handleError(error: HttpErrorResponse): never {
    throw new Error(error.error);
  };
}