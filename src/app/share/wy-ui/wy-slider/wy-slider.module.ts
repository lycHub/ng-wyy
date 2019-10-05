import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WySliderComponent } from './wy-slider.component';
import { WySliderHandleComponent } from './wy-slider-handle.component';
import { WySliderTrackComponent } from './wy-slider-track.component';



@NgModule({
  declarations: [WySliderComponent, WySliderHandleComponent, WySliderTrackComponent],
  imports: [
    CommonModule
  ],
  exports: [WySliderComponent]
})
export class WySliderModule { }
