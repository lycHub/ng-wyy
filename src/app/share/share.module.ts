import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgZorroAntdModule} from "ng-zorro-antd";
import { WyIconDirective } from './wy-icon.directive';
import {PlayCountPipe} from "./play-count.pipe";
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
    PlayCountPipe,
    WyUiModule
  ],
  declarations: [WyIconDirective, PlayCountPipe]
})
export class ShareModule { }
