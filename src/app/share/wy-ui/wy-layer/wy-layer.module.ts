import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WyLayerModalComponent } from './wy-layer-modal/wy-layer-modal.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { OverlayModule } from '@angular/cdk/overlay';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { WyLayerLoginComponent } from './wy-layer-login/wy-layer-login.component';
import { WyLayerRegisterComponent } from './wy-layer-register/wy-layer-register.component';

@NgModule({
  declarations: [WyLayerModalComponent, WyLayerLoginComponent, WyLayerRegisterComponent],
  imports: [
    CommonModule,
    NzButtonModule,
    OverlayModule,
    DragDropModule
  ],
  exports: [WyLayerModalComponent, WyLayerLoginComponent, WyLayerRegisterComponent]
})
export class WyLayerModule { }
