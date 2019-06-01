import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WyPlayerComponent } from './wy-player.component';
import { WySliderModule } from '../wy-slider/wy-slider.module';
import {FormsModule} from "@angular/forms";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    WySliderModule
  ],
  declarations: [WyPlayerComponent],
  exports: [WyPlayerComponent]
})
export class WyPlayerModule { }
