import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import {forkJoin, Observable} from "rxjs/index";
import {take} from "rxjs/internal/operators";
import { SingService, SingerDetail } from 'src/app/service/singer.service';
import { Singer } from 'src/app/service/data-modals/common.models';

type SingerDetailDataModel = [SingerDetail, Singer[]];

@Injectable()
export class SingerDetailResolverService implements Resolve<SingerDetailDataModel> {
  constructor(private singerServe: SingService) {}
  
  resolve(route: ActivatedRouteSnapshot): Observable<SingerDetailDataModel> {
    const id = route.paramMap.get('id');
    return forkJoin([
      this.singerServe.getSingerDetail(id),
      this.singerServe.getSimiSingers(id)
    ]).pipe(take(1));
  }
}