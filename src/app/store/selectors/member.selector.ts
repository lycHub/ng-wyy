import { createSelector } from '@ngrx/store';
import { MemberState } from '../reducers/member.reducer';

const selectMemberStates = (state: MemberState) => state;

export const getModalVisible = createSelector(selectMemberStates, (state: MemberState) => state.modalVisible);
export const getModalType = createSelector(selectMemberStates, (state: MemberState) => state.modalType);
export const getUserInfo = createSelector(selectMemberStates, (state: MemberState) => state.userInfo);
export const getLikeId = createSelector(selectMemberStates, (state: MemberState) => state.likeId);

// export const getCurrentSong = createSelector(selectPlayerStates, ({ playList, currentIndex }: PlayerState) => playList[currentIndex]);