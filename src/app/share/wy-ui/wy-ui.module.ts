import { NgModule } from '@angular/core';
import { SingleSheetComponent } from './single-sheet/single-sheet.component';
import { PlayCountPipe } from '../pipes/play-count.pipe';
import { WyPlayerModule } from './wy-player/wy-player.module';
import { WySearchModule } from './wy-search/wy-search.module';
import { WyLayerModule } from './wy-layer/wy-layer.module';
import { ImgDefaultDirective } from '../directives/img-default.directive';



@NgModule({
  declarations: [
    SingleSheetComponent,
    PlayCountPipe,
    ImgDefaultDirective
  ],
  imports: [
    WyPlayerModule,
    WySearchModule,
    WyLayerModule
  ],
  exports: [
    SingleSheetComponent,
    PlayCountPipe,
    WyPlayerModule,
    WySearchModule,
    WyLayerModule,
    ImgDefaultDirective
  ]
})
export class WyUiModule { }
