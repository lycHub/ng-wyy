import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable()
export class WySerchBusService {
  private eventBus = new Subject<any>();
  constructor() { }


  broadcast(arg: any) {
    this.eventBus.next(arg);
  }


  on(): Observable<any> {
    return this.eventBus.asObservable();
  }

  clear() {
    this.eventBus.next();
    this.eventBus.complete();
  }

}
