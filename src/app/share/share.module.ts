import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FormsModule } from '@angular/forms';
import { WyUiModule } from './wy-ui/wy-ui.module';
import { ImgDefaultDirective } from './directives/img-default.directive';



@NgModule({
  imports: [
    CommonModule,
    NgZorroAntdModule,
    FormsModule,
    WyUiModule
  ],
  exports: [
    CommonModule,
    NgZorroAntdModule,
    FormsModule,
    WyUiModule
  ]
})
export class ShareModule { }
