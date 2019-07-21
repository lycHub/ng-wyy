import { NgModule } from '@angular/core';
import { SheetInfoRoutingModule } from './sheet-info-routing.module';
import {ShareModule} from "../../share/share.module";
import { SheetInfoComponent } from './sheet-info/sheet-info.component';

@NgModule({
  declarations: [SheetInfoComponent],
  imports: [
    ShareModule,
    SheetInfoRoutingModule
  ]
})
export class SheetInfoModule { }
