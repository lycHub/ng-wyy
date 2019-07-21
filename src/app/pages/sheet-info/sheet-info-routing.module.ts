import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SheetInfoComponent} from "./sheet-info/sheet-info.component";

const routes: Routes = [
  {
    path: '', component: SheetInfoComponent,
    data: { title: '歌单详情', keywords: 'sheet, 歌单', description: '歌单详情' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SheetInfoRoutingModule { }
