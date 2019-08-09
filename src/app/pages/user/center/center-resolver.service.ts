import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import {Observable, forkJoin} from "rxjs/index";
import { MemberService } from 'src/app/service/member/member.service';
import { User, recordVal } from 'src/app/service/data-modals/member.models';
import { take } from 'rxjs/operators';


@Injectable()
export class UserCenterResolverService implements Resolve<[User, recordVal[]]> {
  constructor(private memberServe: MemberService, private router: Router) {}
  resolve(route: ActivatedRouteSnapshot): Observable<[User, recordVal[]]> {
    const uid = route.paramMap.get('id');
    if (uid) {
      return forkJoin([
        this.memberServe.userDetail(Number(uid)),
        this.memberServe.userRecord(Number(uid))
      ]).pipe(take(1));
    }else{
      this.router.navigate(['/home']);
    }
  }
}