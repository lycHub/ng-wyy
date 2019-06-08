import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WyPlayerComponent } from './wy-player.component';
import { WySliderModule } from '../wy-slider/wy-slider.module';
import {FormsModule} from "@angular/forms";
import { WyPlayerPanelComponent } from './wy-player-panel/wy-player-panel.component';
import {FormatTimePipe} from "../../pipes/format-time.pipe";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    WySliderModule
  ],
  declarations: [WyPlayerComponent, WyPlayerPanelComponent, FormatTimePipe],
  exports: [WyPlayerComponent]
})
export class WyPlayerModule { }
