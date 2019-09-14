import { NgModule } from '@angular/core';
import { HomeModule } from './home/home.module';
import { SheetListModule } from './sheet-list/sheet-list.module';



@NgModule({
  declarations: [],
  imports: [
    HomeModule,
    SheetListModule
  ],
  exports: [
    HomeModule,
    SheetListModule
  ]
})
export class PagesModule { }
