import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WyPlayerComponent } from './wy-player.component';



@NgModule({
  declarations: [WyPlayerComponent],
  imports: [
    CommonModule
  ],
  exports: [WyPlayerComponent]
})
export class WyPlayerModule { }
