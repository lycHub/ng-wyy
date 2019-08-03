import { NgModule } from '@angular/core';
import { WyPlayerModule } from './wy-player/wy-player.module';
import { SingleSheetComponent } from './single-sheet/single-sheet.component';
import { PlayCountPipe } from '../pipes/play-count.pipe';
import { WyLayerModule } from './wy-layer/wy-layer.module';

@NgModule({
  imports: [
    WyPlayerModule, WyLayerModule
  ],
  declarations: [SingleSheetComponent, PlayCountPipe],
  exports: [WyPlayerModule, WyLayerModule, SingleSheetComponent, PlayCountPipe]
})
export class WyUiModule { }
