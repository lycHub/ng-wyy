import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WyLayerModalComponent } from './wy-layer-modal/wy-layer-modal.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { OverlayModule } from '@angular/cdk/overlay';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { WyLoginPhoneComponent } from './wy-login-phone/wy-login-phone.component';
import { WyLayerRegisterComponent } from './wy-layer-register/wy-layer-register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NzInputModule, NzAlertModule, NzCheckboxModule, NzFormModule, NzSpinModule } from 'ng-zorro-antd';

@NgModule({
  declarations: [WyLayerModalComponent, WyLoginPhoneComponent, WyLayerRegisterComponent],
  imports: [
    CommonModule,
    NzButtonModule,
    OverlayModule,
    DragDropModule,
    ReactiveFormsModule,
    NzInputModule,
    NzCheckboxModule,
    NzSpinModule,
    NzAlertModule,
    NzFormModule
  ],
  exports: [WyLayerModalComponent, WyLoginPhoneComponent, WyLayerRegisterComponent]
})
export class WyLayerModule { }
