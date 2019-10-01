import { createAction, props } from '@ngrx/store';
import { ModalTypes } from '../reducers/member.reducer';

export const SetModalVisible = createAction('[member] Set modal visible', props<{ modalVisible: boolean }>());
export const SetModalType = createAction('[member] Set modal type', props<{ modalType: ModalTypes }>());