import {NgModule, Optional, SkipSelf} from '@angular/core';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {HttpClientModule} from "@angular/common/http";
import {AppRoutingModule} from "../app-routing.module";
import {ShareModule} from "../share/share.module";
import {PagesModule} from "../pages/pages.module";
import {ServiceModule} from "../service/service.module";

@NgModule({
  declarations: [],
  imports: [
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ShareModule,
    PagesModule,
    ServiceModule
  ],
  exports: [
    AppRoutingModule,
    ShareModule
  ]
})
export class CoreModule {
  constructor (@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only');
    }
  }
}