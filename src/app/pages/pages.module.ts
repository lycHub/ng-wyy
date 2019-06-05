import { NgModule } from '@angular/core';
import {HomeModule} from "./home/home.module";
import { SheetModule } from './sheet/sheet.module';

@NgModule({
  imports: [
    HomeModule,
    SheetModule
  ],
  exports: [
    HomeModule,
    SheetModule
  ]
})
export class PagesModule { }
