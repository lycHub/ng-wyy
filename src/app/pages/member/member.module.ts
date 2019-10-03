import { NgModule } from '@angular/core';
import { MemberRoutingModule } from './member-routing.module';
import { ShareModule } from 'src/app/share/share.module';
import { CenterComponent } from './center/center.component';
import { RecordsComponent } from './components/records/records.component';


@NgModule({
  declarations: [CenterComponent, RecordsComponent],
  imports: [
    ShareModule,
    MemberRoutingModule
  ]
})
export class MemberModule { }
