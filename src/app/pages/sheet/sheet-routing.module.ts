import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SheetComponent } from './sheet.component';

const routes: Routes = [
  { path: 'sheet', component: SheetComponent, data: { title: '歌单' } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SheetRoutingModule { }
