import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WySearchComponent } from './wy-search.component';
import { NzIconModule, NzInputModule } from 'ng-zorro-antd';



@NgModule({
  declarations: [WySearchComponent],
  imports: [
    CommonModule,
    NzIconModule,
    NzInputModule
  ],
  exports: [WySearchComponent]
})
export class WySearchModule { }
