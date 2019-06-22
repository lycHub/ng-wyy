import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { playerReducer } from './reducers/player.reducer';

@NgModule({
  imports: [
    StoreModule.forRoot({ player: playerReducer })
  ]
})

// 需要导入coreModule
export class AppStoreModule { }