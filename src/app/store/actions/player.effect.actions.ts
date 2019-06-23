import { createAction, props } from '@ngrx/store';

export const SelectPlay = createAction('[Player] Select play', props<{ id: number }>());
