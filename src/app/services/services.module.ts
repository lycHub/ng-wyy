import { NgModule, InjectionToken } from '@angular/core';
import { httpInterceptorProvides } from './http-interceptors';
import { environment } from '../../environments/environment';

export const API_CONFIG = new InjectionToken('ApiConfigToken');

@NgModule({
  declarations: [],
  imports: [

  ],
  providers: [
    { provide: API_CONFIG, useValue: environment.production ? '/' : '/api/' },
    httpInterceptorProvides
  ]
})
export class ServicesModule { }
