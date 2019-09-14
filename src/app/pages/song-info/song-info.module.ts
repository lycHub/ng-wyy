import { NgModule } from '@angular/core';
import { SongInfoRoutingModule } from './song-info-routing.module';
import { ShareModule } from '../../share/share.module';
import { SongInfoComponent } from './song-info.component';


@NgModule({
  declarations: [SongInfoComponent],
  imports: [
    ShareModule,
    SongInfoRoutingModule
  ]
})
export class SongInfoModule { }
