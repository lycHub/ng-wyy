import { NgModule } from '@angular/core';
import {HomeModule} from "./home/home.module";
import { SheetModule } from './sheet/sheet.module';
import {SheetInfoModule} from "./sheet-info/sheet-info.module";
import {SongInfoModule} from "./song-info/song-info.module";

@NgModule({
  imports: [
    HomeModule,
    SheetModule,
    SheetInfoModule,
    SongInfoModule
  ],
  exports: [
    HomeModule,
    SheetModule,
    SheetInfoModule,
    SongInfoModule
  ]
})
export class PagesModule { }
