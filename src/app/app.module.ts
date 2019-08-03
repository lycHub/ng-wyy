import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import {CoreModule} from "./core/core.module";
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { WyLayerMethodsComponent } from './share/wy-ui/wy-layer/wy-layer-methods/wy-layer-methods.component';

registerLocaleData(zh);

@NgModule({
  declarations: [
    AppComponent,
    WyLayerMethodsComponent
  ],
  imports: [
    BrowserModule,
    CoreModule,
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production })
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
