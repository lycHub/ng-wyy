import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WyPlayerModule } from './wy-player/wy-player.module';

@NgModule({
  imports: [
    CommonModule,
    WyPlayerModule
  ],
  exports: [WyPlayerModule]
})
export class WyUiModule { }
