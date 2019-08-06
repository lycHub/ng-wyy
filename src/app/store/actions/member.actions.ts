import { createAction, props } from '@ngrx/store';
import { User } from 'src/app/service/data-modals/member.models';

export const SetModalVisible = createAction('[Member] Set modal visible', props<{ visible: boolean }>());
export const SetUserInfo = createAction('[Member] Set user info', props<{ user: User }>());