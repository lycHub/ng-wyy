import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WyLayerModalComponent } from './wy-layer-modal/wy-layer-modal.component';
import { WyLayerDefaultComponent } from './wy-layer-default/wy-layer-default.component';
import { NzButtonModule, NzInputModule, NzCheckboxModule, NzSpinModule, NzAlertModule, NzListModule, NzIconModule, NzFormModule } from 'ng-zorro-antd';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { WyLayerLoginComponent } from './wy-layer-login/wy-layer-login.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { WyLayerLikeComponent } from './wy-layer-like/wy-layer-like.component';
import { WyLayerShareComponent } from './wy-layer-share/wy-layer-share.component';
import { WyLayerRegisterComponent } from './wy-layer-register/wy-layer-register.component';
import { WyCheckCodeComponent } from './wy-check-code/wy-check-code.component';
import { WyCodeComponent } from './wy-check-code/wy-code/wy-code.component';



@NgModule({
  declarations: [WyLayerModalComponent, WyLayerDefaultComponent, WyLayerLoginComponent, WyLayerLikeComponent, WyLayerShareComponent, WyLayerRegisterComponent, WyCheckCodeComponent, WyCodeComponent],
  imports: [
    CommonModule,
    NzButtonModule,
    DragDropModule,
    ReactiveFormsModule,
    NzInputModule,
    NzCheckboxModule,
    NzSpinModule,
    NzAlertModule,
    NzListModule,
    NzIconModule,
    NzFormModule,
    FormsModule
  ],
  exports: [WyLayerModalComponent, WyLayerDefaultComponent, WyLayerLoginComponent, WyLayerLikeComponent, WyLayerShareComponent, WyLayerRegisterComponent, WyCheckCodeComponent]
})
export class WyLayerModule { }
