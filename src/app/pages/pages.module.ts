import { NgModule } from '@angular/core';
import {RecommendModule} from "./recommend/recommend.module";

@NgModule({
  imports: [
    RecommendModule
  ],
  exports: [
    RecommendModule
  ]
})
export class PagesModule { }
