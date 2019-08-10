import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import {Observable, forkJoin} from "rxjs/index";
import { MemberService } from 'src/app/service/member/member.service';
import { User, recordVal, UserSheet } from 'src/app/service/data-modals/member.models';
import { take, map } from 'rxjs/operators';


@Injectable()
export class UserCenterResolverService implements Resolve<[User, recordVal[], UserSheet]> {
  constructor(private memberServe: MemberService, private router: Router) {}
  resolve(route: ActivatedRouteSnapshot): Observable<[User, recordVal[], UserSheet]> {
    const uid = route.paramMap.get('id');
    if (uid) {
      return forkJoin([
        this.memberServe.userDetail(Number(uid)),
        this.memberServe.userRecord(Number(uid)),
        this.memberServe.userSheets(Number(uid))
      ]).pipe(take(1));
    }else{
      this.router.navigate(['/home']);
    }
  }
}