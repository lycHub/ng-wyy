import { NgModule } from '@angular/core';
import { WyPlayerModule } from './wy-player/wy-player.module';
import { SingleSheetComponent } from './single-sheet/single-sheet.component';
import { PlayCountPipe } from '../pipes/play-count.pipe';

@NgModule({
  imports: [
    WyPlayerModule
  ],
  exports: [WyPlayerModule, SingleSheetComponent, PlayCountPipe],
  declarations: [SingleSheetComponent, PlayCountPipe]
})
export class WyUiModule { }
