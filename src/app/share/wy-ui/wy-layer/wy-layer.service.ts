import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { WyLayerRegisterComponent } from './wy-layer-register/wy-layer-register.component';
import { WyLoginPhoneComponent } from './wy-login-phone/wy-login-phone.component';

export type ModalForms = WyLayerRegisterComponent | WyLoginPhoneComponent;

@Injectable()
export class WyLayerService {
  private insBus = new Subject<ModalForms>();
  constructor() {}
  setIns(ins: ModalForms) {
    this.insBus.next(ins);
  }

  getIns(): Observable<ModalForms> {
    return this.insBus.asObservable();
  }
}
