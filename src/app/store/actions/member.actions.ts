import { createAction, props } from '@ngrx/store';
import { User } from 'src/app/service/data-modals/member.models';
import { ModalTypes, ShareParams } from '../reducers/member.reducer';

export const SetModalVisible = createAction('[Member] Set modal visible', props<{ visible: boolean }>());
export const SetModalType = createAction('[Member] Set modal type', props<{ modalType: ModalTypes }>());
export const SetUserInfo = createAction('[Member] Set user info', props<{ user: User }>());
export const SetLikeId = createAction('[Member] Set like id', props<{ id: string }>());
export const SetShareParams = createAction('[Member] Set share params', props<{ params: ShareParams }>());