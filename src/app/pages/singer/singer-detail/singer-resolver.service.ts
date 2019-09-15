import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { SingerDetail } from '../../../services/data-types/common.types';
import { SingerService } from '../../../services/singer.service';



@Injectable()
export class SingerResolverService implements Resolve<SingerDetail> {
  constructor(private singerServe: SingerService) {}
  resolve(route: ActivatedRouteSnapshot): Observable<SingerDetail> {
    const id = route.paramMap.get('id');
    return this.singerServe.getSingerDetail(id);
  }
}