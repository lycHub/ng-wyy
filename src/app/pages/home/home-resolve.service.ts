import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { HomeService } from 'src/app/services/home.service';
import { SingerService } from 'src/app/services/singer.service';
import { Banner, SongSheet, Singer, HotTag } from '../../services/data-types/common.types';
import { Observable, forkJoin, of } from 'rxjs';
import { first } from 'rxjs/internal/operators';
import { MemberService } from '../../services/member.service';
import { StorageService } from '../../services/storage.service';
import { User } from 'src/app/services/data-types/member.type';

type HomeDataType = [Banner[], HotTag[], SongSheet[], Singer[]];

@Injectable()
export class HomeResolverService implements Resolve<HomeDataType> {
  constructor(
    private homeServe: HomeService,
    private singerServe: SingerService,
    private memberServe: MemberService,
    private storageServe: StorageService
  ) {}
  resolve(): Observable<HomeDataType> {
    /* const userId = this.storageServe.getStorage('wyUserId');
    let detail$ = of(null);
    if (userId) {
      detail$ = this.memberServe.getUserDetail(userId);
    } */
    return forkJoin([
      this.homeServe.getBanners(),
      this.homeServe.getHotTags(),
      this.homeServe.getPerosonalSheetList(),
      this.singerServe.getEnterSinger()
    ]).pipe(first());
  }
}