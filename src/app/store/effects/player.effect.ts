import { Injectable } from "@angular/core";
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { SongService } from 'src/app/service/song/song.service';
import { RequestSongList, SetSongList } from '../actions/player.actions';

@Injectable()
export class PlayerEffect {
  requestSongList$ = createEffect(() => this.actions$.pipe(
    ofType(RequestSongList),
    tap(() => {
      console.log('tap');
    }),
    switchMap(action => this.SongServe.getSongList(action.id)
      .pipe(
        map(list => SetSongList({ list })),
        catchError(() => EMPTY)
      ))
    )
  );
 
  constructor(private actions$: Actions, private SongServe: SongService) {}
}