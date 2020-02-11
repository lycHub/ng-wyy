import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WySearchComponent } from './wy-search.component';
import { NzIconModule, NzInputModule } from 'ng-zorro-antd';
import { WySearchPanelComponent } from './wy-search-panel/wy-search-panel.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { JumpService } from './jump.service';



@NgModule({
  declarations: [WySearchComponent, WySearchPanelComponent],
  entryComponents: [WySearchPanelComponent],
  providers: [JumpService],
  imports: [
    CommonModule,
    NzIconModule,
    NzInputModule,
    OverlayModule
  ],
  exports: [WySearchComponent]
})
export class WySearchModule { }
