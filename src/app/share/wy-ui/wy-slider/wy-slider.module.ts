import { NgModule } from '@angular/core';
import { WySliderComponent } from './wy-slider.component';
import { WySliderTrackComponent } from './wy-slider-track.component';
import { WySliderHandleComponent } from './wy-slider-handle.component';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [CommonModule],
  declarations: [WySliderComponent, WySliderTrackComponent, WySliderHandleComponent],
  exports: [WySliderComponent, WySliderTrackComponent, WySliderHandleComponent]
})
export class WySliderModule { }
