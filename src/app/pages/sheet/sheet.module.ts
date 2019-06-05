import { NgModule } from '@angular/core';
import { SheetRoutingModule } from './sheet-routing.module';
import { SheetComponent } from './sheet.component';
import { ShareModule } from 'src/app/share/share.module';

@NgModule({
  declarations: [SheetComponent],
  imports: [
    ShareModule,
    SheetRoutingModule
  ]
})
export class SheetModule { }
