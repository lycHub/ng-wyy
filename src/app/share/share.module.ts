import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgZorroAntdModule} from "ng-zorro-antd";
import { WyIconDirective } from './wy-icon.directive';
import { WyUiModule } from './wy-ui/wy-ui.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    WyUiModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    WyIconDirective,
    WyUiModule
  ],
  declarations: [WyIconDirective]
})
export class ShareModule { }
