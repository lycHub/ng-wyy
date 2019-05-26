import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgZorroAntdModule} from "ng-zorro-antd";
import { WyIconDirective } from './wy-icon.directive';
import {PlayCountPipe} from "./play-count.pipe";
import { WyPlayerComponent } from './components/wy-player/wy-player.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    WyIconDirective,
    PlayCountPipe,
    WyPlayerComponent
  ],
  declarations: [WyIconDirective, PlayCountPipe, WyPlayerComponent]
})
export class ShareModule { }
