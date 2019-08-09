import { NgModule } from '@angular/core';

import { UserRoutingModule } from './user-routing.module';
import { CenterComponent } from './center/center.component';
import { ShareModule } from '../../share/share.module';
import { RecordsComponent } from './records/records.component';
import { RecordDetailComponent } from './record-detail/record-detail.component';

@NgModule({
  declarations: [CenterComponent, RecordsComponent, RecordDetailComponent],
  imports: [
    ShareModule,
    UserRoutingModule
  ]
})
export class UserModule { }
