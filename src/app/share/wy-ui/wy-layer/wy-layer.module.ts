import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WyLayerModalComponent } from './wy-layer-modal/wy-layer-modal.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { OverlayModule } from '@angular/cdk/overlay';

@NgModule({
  declarations: [WyLayerModalComponent],
  // entryComponents: [WyLayerMethodsComponent],
  imports: [
    CommonModule,
    NzButtonModule,
    OverlayModule
  ],
  exports: [WyLayerModalComponent]
})
export class WyLayerModule { }
