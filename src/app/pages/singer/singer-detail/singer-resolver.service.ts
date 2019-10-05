import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { SingerDetail, Singer } from '../../../services/data-types/common.types';
import { SingerService } from '../../../services/singer.service';
import { first } from 'rxjs/internal/operators';

type SingerDetailDataModel = [SingerDetail, Singer[]];

@Injectable()
export class SingerResolverService implements Resolve<SingerDetailDataModel> {
  constructor(private singerServe: SingerService) {}
  resolve(route: ActivatedRouteSnapshot): Observable<SingerDetailDataModel> {
    const id = route.paramMap.get('id');
    return forkJoin([
      this.singerServe.getSingerDetail(id),
      this.singerServe.getSimiSinger(id)
    ]).pipe(first());
  }
}
