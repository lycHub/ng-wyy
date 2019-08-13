import { NgModule } from '@angular/core';
import { WyPlayerModule } from './wy-player/wy-player.module';
import { SingleSheetComponent } from './single-sheet/single-sheet.component';
import { PlayCountPipe } from '../pipes/play-count.pipe';
import { WyLayerModule } from './wy-layer/wy-layer.module';
import { ImgDefaultDirective } from '../directives/img-default.directive';
import { WySearchModule } from './wy-search/wy-search.module';

@NgModule({
  imports: [
    WyPlayerModule, WyLayerModule, WySearchModule
  ],
  declarations: [SingleSheetComponent, PlayCountPipe, ImgDefaultDirective],
  exports: [WyPlayerModule, WyLayerModule, SingleSheetComponent, PlayCountPipe, ImgDefaultDirective, WySearchModule]
})
export class WyUiModule { }
