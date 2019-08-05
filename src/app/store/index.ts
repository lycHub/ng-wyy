import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { playerReducer } from './reducers/player.reducer';
import { environment } from 'src/environments/environment';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { PlayerEffect } from './effects/player.effect';
import { memberReducer } from './reducers/member.reducer';

@NgModule({
  imports: [
    StoreModule.forRoot({ player: playerReducer, member: memberReducer }, {
      // metaReducers,
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
        strictStateSerializability: true,
        strictActionSerializability: true
      }
    }),
    EffectsModule.forRoot([PlayerEffect]),
    StoreDevtoolsModule.instrument({
      maxAge: 20, // Retains last 25 states
      logOnly: environment.production,
    })
  ]
})

// 需要导入coreModule
export class AppStoreModule { }