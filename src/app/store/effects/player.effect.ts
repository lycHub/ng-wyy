import { Injectable } from "@angular/core";
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { SongService } from 'src/app/service/song/song.service';
import { SetSongList } from '../actions/player.actions';
import { Store } from '@ngrx/store';
import { AppStoreModule } from '..';
import { SelectPlay } from '../actions/player.effect.actions';

@Injectable()
export class PlayerEffect {
  requestSongList$ = createEffect(() => this.actions$.pipe(
    ofType(SelectPlay),
    // tap((action, ...res) => {
    //   console.log('tap', action);
    //   console.log('tap', res);
    // }),
    switchMap(action => this.SongServe.getSongList(action.id)
      .pipe(
        map(list => SetSongList({ list })),
        catchError(() => EMPTY)
      ))
    )
  );
 
  constructor(private store$: Store<AppStoreModule>, private actions$: Actions, private SongServe: SongService) {}
}