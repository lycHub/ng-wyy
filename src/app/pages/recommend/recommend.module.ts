import { NgModule } from '@angular/core';

import { RecommendRoutingModule } from './recommend-routing.module';
import { RecommendComponent } from './recommend.component';
import {ShareModule} from "../../share/share.module";
import { WyCarouselComponent } from './components/wy-carousel/wy-carousel.component';

@NgModule({
  imports: [
    ShareModule,
    RecommendRoutingModule
  ],
  declarations: [RecommendComponent, WyCarouselComponent]
})
export class RecommendModule { }
