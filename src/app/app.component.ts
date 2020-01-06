import { Component, Inject } from '@angular/core';
import { SearchService } from './services/search.service';
import { SearchResult, SongSheet } from './services/data-types/common.types';
import { isEmptyObject } from './utils/tools';
import { ModalTypes, ShareInfo } from './store/reducers/member.reducer';
import { AppStoreModule } from './store/index';
import { Store, select } from '@ngrx/store';
import { SetModalType, SetUserId, SetModalVisible } from './store/actions/member.actions';
import { BatchActionsService } from './store/batch-actions.service';
import { LoginParams } from './share/wy-ui/wy-layer/wy-layer-login/wy-layer-login.component';
import { MemberService, LikeSongParams, ShareParams } from './services/member.service';
import { User } from './services/data-types/member.type';
import { NzMessageService } from 'ng-zorro-antd';
import { codeJson } from './utils/base64';
import { StorageService } from './services/storage.service';
import { getLikeId, getModalVisible, getModalType, getShareInfo, getMember } from './store/selectors/member.selector';
import { Router, ActivatedRoute, NavigationEnd, NavigationStart } from '@angular/router';
import { Observable, interval } from 'rxjs';
import { filter, map, mergeMap, takeUntil } from 'rxjs/internal/operators';
import { Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

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

  loadPercent = 0;

  searchResult: SearchResult;
  wyRememberLogin: LoginParams;
  user: User;
  mySheets: SongSheet[];


  // 被收藏歌曲的id
  likeId: string;

  // 弹窗显示
  visible = false;

  // 弹窗loading
  showSpin = false;

  // 弹窗类型
  currentModalType = ModalTypes.Default;

  // 分享信息
  shareInfo: ShareInfo;

  routeTitle = '';
  private navEnd: Observable<NavigationEnd>;

  constructor(
    private searchServe: SearchService,
    private store$: Store<AppStoreModule>,
    private batchActionsServe: BatchActionsService,
    private memberServe: MemberService,
    private messageServe: NzMessageService,
    private storageServe: StorageService,
    private router: Router,
    private activateRoute: ActivatedRoute,
    private titleServe: Title,
    @Inject(DOCUMENT) private doc: Document
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
    this.listenStates();

    this.router.events.pipe(filter(evt => evt instanceof NavigationStart)).subscribe(() => {
      this.loadPercent = 0;
      this.setTitle();
    });

    this.navEnd = this.router.events.pipe(filter(evt => evt instanceof NavigationEnd)) as Observable<NavigationEnd>;
    this.setLoadingBar();
  }

  private setLoadingBar() {
    interval(100).pipe(takeUntil(this.navEnd)).subscribe(() => {
      this.loadPercent = Math.max(95, ++this.loadPercent);
    });
    this.navEnd.subscribe(() => {
      this.loadPercent = 100;
      // this.doc.documentElement.scrollTop = 0;
    });
  }

  private setTitle() {
    this.navEnd.pipe(
      map(() => this.activateRoute),
      map((route: ActivatedRoute) => {
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }),
      mergeMap(route => route.data)
    ).subscribe(data => {
      this.routeTitle = data.title;
      this.titleServe.setTitle(this.routeTitle);
    });
  }


  private listenStates() {
    const appStore$ = this.store$.pipe(select(getMember));
    appStore$.pipe(select(getLikeId)).subscribe(id => this.watchLikeId(id));
    appStore$.pipe(select(getModalVisible)).subscribe(visib => this.watchModalVisible(visib));
    appStore$.pipe(select(getModalType)).subscribe(type => this.watchModalType(type));
    appStore$.pipe(select(getShareInfo)).subscribe(info => this.watchShareInfo(info));
  }


  private watchModalVisible(visib: boolean) {
    if (this.visible !== visib) {
      this.visible = visib;
    }
  }
  private watchModalType(type: ModalTypes) {
    if (this.currentModalType !== type) {
      if (type === ModalTypes.Like) {
        this.onLoadMySheets();
      }
      this.currentModalType = type;
    }
  }

  private watchLikeId(id: string) {
    if (id) {
      this.likeId = id;
    }
  }

  private watchShareInfo(info: ShareInfo) {
    if (info) {
      if (this.user) {
        this.shareInfo = info;
        this.openModal(ModalTypes.Share);
      } else {
        this.openModal(ModalTypes.Default);
      }
    }
  }

  openModalByMenu(type: 'loginByPhone' | 'register') {
    if (type === 'loginByPhone') {
      this.openModal(ModalTypes.LoginByPhone);
    } else {
      this.openModal(ModalTypes.Register);
    }
  }


  // 打开弹窗
  openModal(type: ModalTypes) {
    this.batchActionsServe.controlModal(true, type);
  }

  closeModal() {
    this.batchActionsServe.controlModal(false);
  }


  // 改变弹窗类型
  onChangeModalType(modalType = ModalTypes.Default) {
    this.store$.dispatch(SetModalType({ modalType }));
  }


  // 获取当前用户的歌单
  onLoadMySheets() {
    if (this.user) {
      this.memberServe.getUserSheets(this.user.profile.userId.toString()).subscribe(userSheet => {
        this.mySheets = userSheet.self;
        this.store$.dispatch(SetModalVisible({ modalVisible: true }));
      });
    } else {
      this.openModal(ModalTypes.Default);
    }
  }


  onSearch(keywords: string) {
    if (keywords) {
      this.searchServe.search(keywords).subscribe(res => {
        this.searchResult = this.highlightKeyWords(keywords, res);
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
    this.showSpin = true;
    this.memberServe.login(params).subscribe(user => {
      this.user = user;
      this.closeModal();
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
      this.showSpin = false;
    }, error => {
      this.showSpin = false;
      this.alertMessage('error', error.message || '登陆失败');
    });
  }

  onLogout() {
    this.memberServe.logout().subscribe(() => {
      this.user = null;
      this.storageServe.removeStorage('wyUserId');
      this.store$.dispatch(SetUserId({ id: '' }));
      this.alertMessage('success', '已退出');
    }, error => {
      this.alertMessage('error', error.message || '退出失败');
    });
  }



  // 收藏歌曲
  onLikeSong(args: LikeSongParams) {
    this.memberServe.likeSong(args).subscribe(() => {
      this.closeModal();
      this.alertMessage('success', '收藏成功');
    }, error => {
      this.alertMessage('error', error.msg || '收藏失败');
    });
  }

  // 新建歌单
  onCreateSheet(sheetName: string) {
    this.memberServe.createSheet(sheetName).subscribe(pid => {
      this.onLikeSong({ pid, tracks: this.likeId });
    }, error => {
      this.alertMessage('error', error.msg || '新建失败');
    });
  }


  // 分享
  onShare(arg: ShareParams) {
    this.memberServe.shareResource(arg).subscribe(() => {
      this.alertMessage('success', '分享成功');
      this.closeModal();
    }, error => {
      this.alertMessage('error', error.msg || '分享失败');
    });
  }


  // 注册
  onRegister(phone: string) {
    this.alertMessage('success', phone + '注册成功');
  }


  private alertMessage(type: string, msg: string) {
    this.messageServe.create(type, msg);
  }
}
