import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WyLayerModalComponent } from './wy-layer-modal/wy-layer-modal.component';



@NgModule({
  declarations: [WyLayerModalComponent],
  imports: [
    CommonModule
  ],
  exports: [WyLayerModalComponent]
})
export class WyLayerModule { }
