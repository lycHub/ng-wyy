import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { first } from 'rxjs/internal/operators';
import { User } from 'src/app/services/data-types/member.type';
import { RecordVal } from '../../../services/data-types/member.type';
import { MemberService } from 'src/app/services/member.service';

type CenterDataType = [User, RecordVal[]];

@Injectable()
export class RecordResolverService implements Resolve<CenterDataType> {
  constructor(
    private memberServe: MemberService,
    private router: Router
  ) {}
  resolve(route: ActivatedRouteSnapshot): Observable<CenterDataType> {
    const uid = route.paramMap.get('id');
    if (uid) {
      return forkJoin([
        this.memberServe.getUserDetail(uid),
        this.memberServe.getUserRecord(uid)
      ]).pipe(first());
    } else {
      this.router.navigate(['/home']);
    }
  }
}
