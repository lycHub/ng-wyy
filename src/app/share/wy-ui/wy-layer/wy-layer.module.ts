import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WyLayerModalComponent } from './wy-layer-modal/wy-layer-modal.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { OverlayModule, OverlayContainer } from '@angular/cdk/overlay';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { WyLoginPhoneComponent } from './wy-login-phone/wy-login-phone.component';
import { WyLayerRegisterComponent } from './wy-layer-register/wy-layer-register.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NzInputModule, NzAlertModule, NzCheckboxModule, NzFormModule, NzSpinModule, NzListModule, NzIconModule } from 'ng-zorro-antd';
import { WyLoginDefaultComponent } from './wy-login-default/wy-login-default.component';
import { WyLayerLikeComponent } from './wy-layer-like/wy-layer-like.component';
import { WyLayerShareComponent } from './wy-layer-share/wy-layer-share.component';
import { CheckCodeComponent } from '../check-code/check-code.component';
import { CodeComponent } from '../check-code/code/code.component';


@NgModule({
  declarations: [WyLayerModalComponent, WyLoginPhoneComponent, WyLayerRegisterComponent, WyLoginDefaultComponent, WyLayerLikeComponent, WyLayerShareComponent, CheckCodeComponent, CodeComponent],
  imports: [
    CommonModule,
    NzButtonModule,
    OverlayModule,
    DragDropModule,
    FormsModule,
    ReactiveFormsModule,
    NzInputModule,
    NzCheckboxModule,
    NzSpinModule,
    NzAlertModule,
    NzListModule,
    NzIconModule,
    NzFormModule
  ],
  providers: [OverlayContainer],
  exports: [WyLayerModalComponent, WyLoginPhoneComponent, WyLayerRegisterComponent, WyLoginDefaultComponent, WyLayerLikeComponent, WyLayerShareComponent, CheckCodeComponent, CodeComponent]
})
export class WyLayerModule { }
