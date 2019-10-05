import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SingerDetailComponent } from './singer-detail/singer-detail.component';
import { SingerResolverService } from './singer-detail/singer-resolver.service';


const routes: Routes = [{
  path: 'singer/:id', component: SingerDetailComponent, data: { title: '歌手详情' }, resolve: { singerDetail: SingerResolverService }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [SingerResolverService]
})
export class SingerRoutingModule { }
