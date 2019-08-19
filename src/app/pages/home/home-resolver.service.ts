import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import {forkJoin, Observable} from "rxjs/index";
import {HomeService} from "../../service/home.service";
import {take} from "rxjs/internal/operators";
import {Banner, HotTag, SongSheet, Singer} from "../../service/data-modals/common.models";
import { SingService } from 'src/app/service/singer.service';

type HomeDataModel = [Banner[], HotTag[], SongSheet[], Singer[]];

@Injectable()
export class HomeResolverService implements Resolve<HomeDataModel> {
  constructor(private homeServe: HomeService, private singerServe: SingService) {}
  
  resolve(): Observable<HomeDataModel> {
    return forkJoin([
      this.homeServe.getBanners(),
      this.homeServe.getHotTags(),
      this.homeServe.getPersonalSongList(),
      this.singerServe.getEnterSingers(),
    ]).pipe(take(1));
  }
}