import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SongInfoComponent } from './song-info.component';


const routes: Routes = [{
  path: 'songInfo/:id', component: SongInfoComponent, data: { title: '歌曲详情' }
}];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SongInfoRoutingModule { }
