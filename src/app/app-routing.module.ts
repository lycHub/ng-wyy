import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SingerModule } from './pages/singer/singer.module';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then(mod => mod.HomeModule)
  },
  {
    path: 'singer/:id',
    loadChildren: () => import('./pages/singer/singer.module').then(mod => mod.SingerModule)
  },
  {
    path: 'sheet',
    loadChildren: () => import('./pages/sheet/sheet.module').then(mod => mod.SheetModule)
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
    path: 'userCenter/:id',
    loadChildren: () => import('./pages/user/user.module').then(mod => mod.UserModule)
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  /* {
    path: '**',
    redirectTo: '/home'
  } */
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
