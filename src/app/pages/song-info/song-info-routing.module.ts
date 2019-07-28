import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SongInfoComponent} from "./song-info.component";

const routes: Routes = [{
  path: '', component: SongInfoComponent,
  data: { title: '歌曲详情' },
  // resolve: { sheetInfo: SheetInfoResolverService }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SongInfoRoutingModule { }
