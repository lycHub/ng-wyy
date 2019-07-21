import { NgModule } from '@angular/core';
import {HomeModule} from "./home/home.module";
import { SheetModule } from './sheet/sheet.module';
import {SheetInfoModule} from "./sheet-info/sheet-info.module";

@NgModule({
  imports: [
    HomeModule,
    SheetModule,
    SheetInfoModule
  ],
  exports: [
    HomeModule,
    SheetModule,
    SheetInfoModule
  ]
})
export class PagesModule { }
