import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WyPlayerComponent } from './wy-player.component';
import { WySliderModule } from '../wy-slider/wy-slider.module';
import { WyPlayerPanelComponent } from './wy-player-panel/wy-player-panel.component';
import {FormatTimePipe} from "../../pipes/format-time.pipe";
import { WyScrollComponent } from './wy-scroll.component';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    WySliderModule,
    NzToolTipModule,
    FormsModule
  ],
  declarations: [WyPlayerComponent, WyPlayerPanelComponent, FormatTimePipe, WyScrollComponent],
  exports: [WyPlayerComponent, FormatTimePipe]
})
export class WyPlayerModule { }
