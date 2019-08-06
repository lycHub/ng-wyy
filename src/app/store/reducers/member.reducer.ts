import { createReducer, Action, on } from '@ngrx/store';
import * as MemberActions from '../actions/member.actions';
import { User } from 'src/app/service/data-modals/member.models';
import { SetUserInfo } from '../actions/member.actions';

export type MemberState = {

  // 弹窗状态
  modalVisible: boolean;

  // 会员信息
  userInfo: User;
}


export const initialState: MemberState = {
  modalVisible: false,
  userInfo: null
};




const reducer = createReducer(
  initialState,
  on(MemberActions.SetModalVisible, (state, { visible }) => ({ ...state, modalVisible: visible })),
  on(MemberActions.SetUserInfo, (state, { user }) => ({ ...state, userInfo: user })),
);

export function memberReducer(state: MemberState | undefined, action: Action) {
  return reducer(state, action);
}