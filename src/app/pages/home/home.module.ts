import { NgModule } from '@angular/core';
import {ShareModule} from "../../share/share.module";
import { WyCarouselComponent } from './components/wy-carousel/wy-carousel.component';
import {HomeComponent} from "./home.component";
import {HomeRoutingModule} from "./home-routing.module";

@NgModule({
  imports: [
    ShareModule,
    HomeRoutingModule
  ],
  declarations: [HomeComponent, WyCarouselComponent]
})
export class HomeModule { }
