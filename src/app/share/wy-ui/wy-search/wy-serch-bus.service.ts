import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable()
export class WySerchBusService {
  private eventBus = new Subject<any>();
  private dataBus = new Subject<any>();
  constructor() {
    
  }

  setData(data: any) {
    this.dataBus.next(data);
  }

  subData(): Observable<any> {
    return this.dataBus.asObservable();
  }


  broadcast(arg: any) {
    this.eventBus.next(arg);
  }


  on(): Observable<any> {
    return this.eventBus.asObservable();
  }

  clear() {
    this.dataBus.next();
    this.dataBus.complete();
    this.eventBus.next();
    this.eventBus.complete();
  }

}
