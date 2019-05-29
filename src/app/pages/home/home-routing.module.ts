import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from "./home.component";
import {HomeResolverService} from "./home-resolver.service";

const routes: Routes = [
  { path: 'home', component: HomeComponent, data: { title: '发现音乐' } }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [HomeResolverService]
})
export class HomeRoutingModule { }
