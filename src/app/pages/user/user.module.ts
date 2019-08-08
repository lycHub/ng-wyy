import { NgModule } from '@angular/core';

import { UserRoutingModule } from './user-routing.module';
import { CenterComponent } from './center/center.component';
import { ShareModule } from '../../share/share.module';

@NgModule({
  declarations: [CenterComponent],
  imports: [
    ShareModule,
    UserRoutingModule
  ]
})
export class UserModule { }
