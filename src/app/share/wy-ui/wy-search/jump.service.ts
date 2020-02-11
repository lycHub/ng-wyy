import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable()
export class JumpService {
  private jump$ = new Subject();
  constructor() {}
  jump() {
    this.jump$.next();
  }
  handleJump(): Observable<any> {
    return this.jump$.asObservable();
  }
}
