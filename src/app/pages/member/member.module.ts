import { NgModule } from '@angular/core';
import { MemberRoutingModule } from './member-routing.module';
import { ShareModule } from 'src/app/share/share.module';
import { CenterComponent } from './center/center.component';


@NgModule({
  declarations: [CenterComponent],
  imports: [
    ShareModule,
    MemberRoutingModule
  ]
})
export class MemberModule { }
