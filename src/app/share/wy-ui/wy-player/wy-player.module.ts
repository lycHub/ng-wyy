import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WyPlayerComponent } from './wy-player.component';
import { WySliderModule } from '../wy-slider/wy-slider.module';
import {FormsModule} from "@angular/forms";
import { WyPlayerPanelComponent } from './wy-player-panel/wy-player-panel.component';
import {FormatTimePipe} from "../../pipes/format-time.pipe";

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
  // minScrollbarLength: 50
};

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    WySliderModule,
    PerfectScrollbarModule
  ],
  declarations: [WyPlayerComponent, WyPlayerPanelComponent, FormatTimePipe],
  exports: [WyPlayerComponent, PerfectScrollbarModule],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ]
})
export class WyPlayerModule { }
