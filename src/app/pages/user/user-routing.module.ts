import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CenterComponent } from './center/center.component';
import { UserCenterResolverService } from './center/center-resolver.service';

const routes: Routes = [{
  path: '', component: CenterComponent, data: { title: '个人中心' }, resolve: { user: UserCenterResolverService }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [UserCenterResolverService]
})
export class UserRoutingModule { }
