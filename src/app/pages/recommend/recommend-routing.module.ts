import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {RecommendComponent} from "./recommend.component";

const routes: Routes = [
  { path: 'recommend', component: RecommendComponent, data: { title: '推荐' } }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecommendRoutingModule { }
