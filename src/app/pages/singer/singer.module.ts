import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SingerRoutingModule } from './singer-routing.module';
import { ShareModule } from 'src/app/share/share.module';
import { SingerDetailComponent } from './singer-detail/singer-detail.component';

@NgModule({
  declarations: [SingerDetailComponent],
  imports: [
    ShareModule,
    SingerRoutingModule
  ],
  exports: [SingerDetailComponent]
})
export class SingerModule { }
