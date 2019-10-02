import { Component } from '@angular/core';
import { SearchService } from './services/search.service';
import { SearchResult } from './services/data-types/common.types';
import { isEmptyObject } from './utils/tools';
import { ModalTypes } from './store/reducers/member.reducer';
import { AppStoreModule } from './store/index';
import { Store } from '@ngrx/store';
import { SetModalType, SetUserId } from './store/actions/member.actions';
import { BatchActionsService } from './store/batch-actions.service';
import { LoginParams } from './share/wy-ui/wy-layer/wy-layer-login/wy-layer-login.component';
import { MemberService } from './services/member.service';
import { User } from './services/data-types/member.type';
import { NzMessageService } from 'ng-zorro-antd';
import { codeJson } from './utils/base64';
import { StorageService } from './services/storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  menu = [{
    label: '发现',
    path: '/home'
  }, {
    label: '歌单',
    path: '/sheet'
  }];

  searchResult: SearchResult;
  wyRememberLogin: LoginParams;
  user: User;
  constructor(
    private searchServe: SearchService,
    private store$: Store<AppStoreModule>,
    private batchActionsServe: BatchActionsService,
    private memberServe: MemberService,
    private messageServe: NzMessageService,
    private storageServe: StorageService,
  ) {
    const userId = this.storageServe.getStorage('wyUserId');
    if (userId) {
      this.store$.dispatch(SetUserId({ id: userId }));
      this.memberServe.getUserDetail(userId).subscribe(user => this.user = user);
    }

    const wyRememberLogin = this.storageServe.getStorage('wyRememberLogin');
    if (wyRememberLogin) {
      this.wyRememberLogin = JSON.parse(wyRememberLogin);
    }
  }


  // 打开弹窗
  openModal(type: ModalTypes) {
    this.batchActionsServe.controlModal(true, type);
  }


  // 改变弹窗类型
  onChangeModalType(modalType = ModalTypes.Default) {
    this.store$.dispatch(SetModalType({ modalType }));
  }


  onSearch(keywords: string) {
    console.log('keywords :', keywords);
    if (keywords) {
      this.searchServe.search(keywords).subscribe(res => {
        this.searchResult = this.highlightKeyWords(keywords, res);
        console.log('searchResult :', this.searchResult);
      });
    } else {
      this.searchResult = {};
    }
  }

  private highlightKeyWords(keywords: string, result: SearchResult): SearchResult {
    if (!isEmptyObject(result)) {
      const reg = new RegExp(keywords, 'ig');
      ['artists', 'playlists', 'songs'].forEach(type => {
        if (result[type]) {
          result[type].forEach(item => {
            item.name = item.name.replace(reg, '<span class="highlight">$&</span>');
          });
        }
      });
    }
    return result;
  }


  // 登陆
  onLogin(params: LoginParams) {
    this.memberServe.login(params).subscribe(user => {
      this.user = user;
      this.batchActionsServe.controlModal(false);
      this.alertMessage('success', '登陆成功');
      this.storageServe.setStorage({
        key: 'wyUserId',
        value: user.profile.userId
      });
      this.store$.dispatch(SetUserId({ id: user.profile.userId.toString() }));

      if (params.remember) {
        this.storageServe.setStorage({
          key: 'wyRememberLogin',
          value: JSON.stringify(codeJson(params))
        });
      } else {
        this.storageServe.removeStorage('wyRememberLogin');
      }
    }, ({ error }) => {
      // console.log('error :', error);
      this.alertMessage('error', error.message || '登陆失败');
    });
  }

  onLogout() {
    this.memberServe.logout().subscribe(() => {
      this.user = null;
      this.storageServe.removeStorage('wyUserId');
      this.store$.dispatch(SetUserId({ id: '' }));
      this.alertMessage('success', '已退出');
    }, ({ error }) => {
      this.alertMessage('error', error.message || '退出失败');
    });
  }

  private alertMessage(type: string, msg: string) {
    this.messageServe.create(type, msg);
  }
}
