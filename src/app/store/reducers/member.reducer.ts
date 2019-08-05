import { createReducer, Action, on } from '@ngrx/store';
import * as MemberActions from '../actions/member.actions';

export type MemberState = {

  // 弹窗状态
  modalVisible: boolean;

  // 会员信息
  // memberInfo: Member;
}


export const initialState: MemberState = {
  modalVisible: true
};




const reducer = createReducer(
  initialState,
  on(MemberActions.SetModalVisible, (state, { visible }) => ({ ...state, modalVisible: visible })),
);

export function memberReducer(state: MemberState | undefined, action: Action) {
  return reducer(state, action);
}