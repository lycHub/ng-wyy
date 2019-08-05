import { createAction, props } from '@ngrx/store';

export const SetModalVisible = createAction('[Member] Set modal visible', props<{ visible: boolean }>());