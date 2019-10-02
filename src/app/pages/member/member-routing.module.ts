import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CenterComponent } from './center/center.component';
import { CenterResolverService } from './center/center-resolve.service';


const routes: Routes = [{
  path: 'member/:id', component: CenterComponent, data: { title: '个人中心' }, resolve: { user: CenterResolverService }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [CenterResolverService]
})
export class MemberRoutingModule { }
