import { NgModule } from '@angular/core';
import {NzIconService} from "ng-zorro-antd/icon";

@NgModule({
  providers: [
    {
      provide: 'API_CONFIG', useValue: 'http://127.0.0.1:3000/'
    },
    { provide: 'IconFont',
      useFactory(_iconService: NzIconService) {
        _iconService.fetchFromIconfont({
          scriptUrl: 'http://at.alicdn.com/t/font_992681_i7ebkaybo5.js'
        });
        return _iconService;
      },
      deps: [NzIconService]
    }
  ]
})
export class ServiceModule { }
