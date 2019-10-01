import { SetPlayList, SetSongList, SetPlayMode, SetCurrentIndex, SetCurrentAction } from '../actions/player.actions';
import { PlayMode } from 'src/app/share/wy-ui/wy-player/player-type';
import { Song } from '../../services/data-types/common.types';
import { createReducer, on, Action } from '@ngrx/store';
import { SetPlaying } from '../actions/player.actions';
import { SetModalVisible, SetModalType } from '../actions/member.actions';

export enum ModalTypes {
  Register = 'register',
  LoginByPhone = 'loginByPhone',
  Share = 'share',
  Like = 'like',
  Default = 'default'
}

export type MemberState = {
  modalVisible: boolean;
  modalType: ModalTypes;
}


export const initialState: MemberState = {
  modalVisible: false,
  modalType: ModalTypes.Default,
}

const reducer = createReducer(
  initialState,
  on(SetModalVisible, (state, { modalVisible }) => ({ ...state, modalVisible })),
  on(SetModalType, (state, { modalType }) => ({ ...state,  modalType })),
);

export function memberReducer(state: MemberState, action: Action) {
  return reducer(state, action);
}