import { SetPlayList, SetSongList, SetPlayMode, SetCurrentIndex, SetCurrentAction } from '../actions/player.actions';
import { PlayMode } from 'src/app/share/wy-ui/wy-player/player-type';
import { Song } from '../../services/data-types/common.types';
import { createReducer, on, Action } from '@ngrx/store';
import { SetPlaying } from '../actions/player.actions';
import { SetModalVisible, SetModalType, SetUserId } from '../actions/member.actions';

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
  userId: string;
}


export const initialState: MemberState = {
  modalVisible: false,
  modalType: ModalTypes.Default,
  userId: ''
}

const reducer = createReducer(
  initialState,
  on(SetModalVisible, (state, { modalVisible }) => ({ ...state, modalVisible })),
  on(SetModalType, (state, { modalType }) => ({ ...state,  modalType })),
  on(SetUserId, (state, { id }) => ({ ...state,  userId: id })),
);

export function memberReducer(state: MemberState, action: Action) {
  return reducer(state, action);
}