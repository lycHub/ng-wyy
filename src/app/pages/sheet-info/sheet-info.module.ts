import { NgModule } from '@angular/core';
import { SheetInfoRoutingModule } from './sheet-info-routing.module';
import { SheetInfoComponent } from './sheet-info.component';
import { ShareModule } from '../../share/share.module';


@NgModule({
  declarations: [SheetInfoComponent],
  imports: [
    ShareModule,
    SheetInfoRoutingModule
  ]
})
export class SheetInfoModule { }
