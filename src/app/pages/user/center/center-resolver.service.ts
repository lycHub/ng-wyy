import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import {Observable, of} from "rxjs/index";


@Injectable()
export class UserCenterResolverService implements Resolve<number> {
  constructor() {}
  resolve(route: ActivatedRouteSnapshot): Observable<number> {
    // Number(route.paramMap.get('id'))
    return of(Number(route.paramMap.get('id')));
  }
}