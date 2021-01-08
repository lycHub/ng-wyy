import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';



const routes: Routes = [
  {
    path: 'sheet',
    loadChildren: () => import('./pages/sheet-list/sheet-list.module').then(mod => mod.SheetListModule)
  },
  {
    path: 'sheetInfo/:id',
    loadChildren: () => import('./pages/sheet-info/sheet-info.module').then(mod => mod.SheetInfoModule)
  },
  {
    path: 'songInfo/:id',
    loadChildren: () => import('./pages/song-info/song-info.module').then(mod => mod.SongInfoModule)
  },
  {
    path: 'member/:id',
    loadChildren: () => import('./pages/member/member.module').then(mod => mod.MemberModule)
  },
  {
    path: 'singer/:id',
    loadChildren: () => import('./pages/singer/singer.module').then(mod => mod.SingerModule)
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
