import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SheetComponent } from './sheet.component';

const routes: Routes = [
  {
    path: '', component: SheetComponent,
    data: { title: '歌单', keywords: 'sheet, 歌单', description: '歌单页' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SheetRoutingModule { }
