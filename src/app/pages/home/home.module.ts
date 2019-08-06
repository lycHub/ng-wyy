import { NgModule } from '@angular/core';
import {ShareModule} from "../../share/share.module";
import { WyCarouselComponent } from './components/wy-carousel/wy-carousel.component';
import {HomeComponent} from "./home.component";
import {HomeRoutingModule} from "./home-routing.module";
import { MemberCardComponent } from './components/member-card/member-card.component';

@NgModule({
  imports: [
    ShareModule,
    HomeRoutingModule
  ],
  declarations: [HomeComponent, WyCarouselComponent, MemberCardComponent]
})
export class HomeModule { }
