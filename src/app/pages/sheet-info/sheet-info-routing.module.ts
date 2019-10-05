import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SheetInfoComponent } from './sheet-info.component';
import { SheetInfoResolverService } from './sheet-info-resolver.service';


const routes: Routes = [{
  path: '', component: SheetInfoComponent, data: { title: '歌单详情' }, resolve: { sheetInfo: SheetInfoResolverService }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [SheetInfoResolverService]
})
export class SheetInfoRoutingModule { }
