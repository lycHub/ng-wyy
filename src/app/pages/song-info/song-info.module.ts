import { NgModule } from '@angular/core';
import { SongInfoRoutingModule } from './song-info-routing.module';
import { SongInfoComponent } from './song-info.component';
import {ShareModule} from "../../share/share.module";

@NgModule({
  declarations: [SongInfoComponent],
  imports: [
    ShareModule,
    SongInfoRoutingModule
  ]
})
export class SongInfoModule { }
