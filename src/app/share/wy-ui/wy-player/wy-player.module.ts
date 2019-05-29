import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WyPlayerComponent } from './wy-player.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [WyPlayerComponent],
  exports: [WyPlayerComponent]
})
export class WyPlayerModule { }
