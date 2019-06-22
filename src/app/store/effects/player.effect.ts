import { Injectable } from "@angular/core";
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { EMPTY, Observable } from 'rxjs';
import { map, exhaustMap, catchError } from 'rxjs/operators';
import { SongService } from 'src/app/service/song/song.service';
import { RequestSongList, SetSongList } from '../actions/player.actions';

@Injectable()
export class PlayerEffect {
  requestSongList$: Observable<any>
 
  constructor(
    private actions$: Actions,
    private SongServe: SongService
  ) {
    this.requestSongList$ = createEffect(() => this.actions$.pipe(
      ofType(RequestSongList),
      exhaustMap(action => this.SongServe.getSongList(action.id)
        .pipe(
          map(list => SetSongList({ list })),
          catchError(() => EMPTY)
        ))
      )
    );
  }
}