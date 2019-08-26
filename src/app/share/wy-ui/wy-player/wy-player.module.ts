import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WyPlayerComponent } from './wy-player.component';
import { WySliderModule } from '../wy-slider/wy-slider.module';



@NgModule({
  declarations: [WyPlayerComponent],
  imports: [
    CommonModule,
    WySliderModule
  ],
  exports: [WyPlayerComponent]
})
export class WyPlayerModule { }
