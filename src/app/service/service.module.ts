import { NgModule } from '@angular/core';

@NgModule({
  providers: [{
    provide: 'API_CONFIG', useValue: 'http://127.0.0.1:3000/'
  }]
})
export class ServiceModule { }
