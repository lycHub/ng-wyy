import { Component } from '@angular/core';
import { SearchService } from './services/search.service';
import { SearchResult } from './services/data-types/common.types';
import { isEmptyObject } from './utils/tools';
import { ModalTypes } from './store/reducers/member.reducer';
import { AppStoreModule } from './store/index';
import { Store } from '@ngrx/store';
import { SetModalType } from './store/actions/member.actions';
import { BatchActionsService } from './store/batch-actions.service';
import { LoginParams } from './share/wy-ui/wy-layer/wy-layer-login/wy-layer-login.component';

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

  constructor(
    private searchServe: SearchService,
    private store$: Store<AppStoreModule>,
    private batchActionsServe: BatchActionsService,
  ) {

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
    }else {
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
    console.log('params :', params);
  }
}
