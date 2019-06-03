import {NgModule, PLATFORM_ID} from '@angular/core';
import {NzIconService} from "ng-zorro-antd/icon";
import {API_CONFIG, WINDOW} from "../core/inject-tokens";
import {isPlatformBrowser} from "@angular/common";

@NgModule({
  providers: [
    {
      provide: API_CONFIG, useValue: 'http://127.0.0.1:3000/'
    },
    /*{ provide: ICON_FONT,
      useFactory(_iconService: NzIconService) {
        _iconService.fetchFromIconfont({
          scriptUrl: '//at.alicdn.com/t/font_992681_o5991rd0i3i.js'
        });
        return _iconService;
      },
      deps: [NzIconService]
    },*/
    {
      provide: WINDOW,
      useFactory(platformId: Object): Window | Object {
        return isPlatformBrowser(platformId) ? window : {};
      },
      deps: [PLATFORM_ID]
    }
  ]
})
export class ServiceModule { }
