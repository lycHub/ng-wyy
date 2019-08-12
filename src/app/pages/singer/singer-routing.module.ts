import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SingerDetailComponent } from './singer-detail/singer-detail.component';
import { SingerDetailResolverService } from './singer-detail/singer-detail-resolver.service';

const routes: Routes = [
  { path: '', component: SingerDetailComponent, data: { title: '歌手主页' }, resolve: { singerDatas: SingerDetailResolverService } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [SingerDetailResolverService]
})
export class SingerRoutingModule { }
