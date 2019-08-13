import { Component, Inject } from '@angular/core';
import {NavigationEnd, Router, ActivatedRoute} from "@angular/router";
import { Observable, from } from 'rxjs/index';
import {filter, map, mergeMap} from "rxjs/internal/operators";
import {WINDOW} from "./core/inject-tokens";
import { Title, Meta } from '@angular/platform-browser';
import { LoginParams } from './share/wy-ui/wy-layer/wy-login-phone/wy-login-phone.component';
import { MemberService } from './service/member/member.service';
import { NzMessageService } from 'ng-zorro-antd';
import { AppStoreModule } from './store';
import { Store } from '@ngrx/store';
import { SetModalVisible, SetUserInfo, SetModalType } from './store/actions/member.actions';
import { codeJson } from './utils/base64';
import { StorageService } from './service/storage.service';
import { User, UserSheet } from './service/data-modals/member.models';
import { ModalTypes } from './store/reducers/member.reducer';
import { MultipleReducersService } from './store/multiple-reducers.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  showSpin = false;

  navEnd: Observable<NavigationEnd>;
  loadPercent = 0;
  user: User;
  userSheet: UserSheet;
  
  menu = [{
    title: '发现',
    path: '/home'
  }, {
    title: '歌单',
    path: '/sheet'
  }, {
    title: '歌手',
    path: ''
  }];

  routeTitle = '';

  wyUserLogin: LoginParams;
  
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private titleService: Title,
    private memberServe: MemberService,
    private meta: Meta,
    private messageServe: NzMessageService,
    private store$: Store<AppStoreModule>,
    private multipleReducerServe: MultipleReducersService,
    private storageServe: StorageService,
    @Inject(WINDOW) private win: Window) {
    const userId = this.storageServe.getStorage('wyUserId');
    if (userId) {
      this.memberServe.refreshLogin(Number(userId)).subscribe(user => {
        this.user = user;
        this.store$.dispatch(SetUserInfo({ user }));
      });
    }


    const storage = JSON.parse(localStorage.getItem('wyUserLogin'));
    this.wyUserLogin = storage;
    this.setLoadingBar();
    this.setMT();
  }


  private setLoadingBar() {
    this.navEnd = this.router.events.pipe(filter(evt => evt instanceof NavigationEnd)) as Observable<NavigationEnd>;
    const timer = this.win.setInterval(() => {
      this.loadPercent = Math.min(95, ++this.loadPercent);
    }, 100);
    this.navEnd.subscribe(() => {
      timer && clearInterval(timer);
      this.loadPercent = 100;
    });
  }

  private setMT() {
    this.navEnd.pipe(
      map(() => this.activatedRoute),
      map((route: ActivatedRoute) => {
        while (route.firstChild) route = route.firstChild;
        return route;
      }),
      // filter((route) => route.outlet === 'primary'),
      mergeMap(route => route.data)).subscribe(event => {
      this.routeTitle = event['title'];
      this.titleService.setTitle(this.routeTitle);
      this.meta.addTag({ keywords: event['keywords'], description: event['description'] });
      this.meta.updateTag({ keywords: event['keywords'], description: event['description'] });
    });
  }

  onChangeModalType(type = ModalTypes.Default) {
    this.store$.dispatch(SetModalType({ modalType: type }));
  }


  // 获取歌单列表
  onLoadSheetList() {
    if (this.user) {
      this.memberServe.userSheets(this.user.profile.userId).subscribe(userSheet => {
        this.userSheet = userSheet;
        // console.log('userSheet :', userSheet);
        this.store$.dispatch(SetModalVisible({ visible: true }));
      });
    }else {
      this.openModal(ModalTypes.Default);
    }
    
  }



  openModal(type: ModalTypes) {
    this.multipleReducerServe.controlModal(type);
  }
  
  // 退出
  onLogOut() {
    this.memberServe.logOut().subscribe(code => {
      if (code === 200) {
        this.storageServe.removeStroge('wyUserId');
        this.store$.dispatch(SetUserInfo({ user: null }));
        this.user = null;
        this.alertMessage('success', '已退出');
      }else {
        this.alertMessage('error', '退出失败');
      }
    });
  }


  // 登陆
  onLogin(params: LoginParams) {
    this.showSpin = true;
    this.doLogin(params);
  }

  private doLogin(params: LoginParams) {
    this.memberServe.login(params).subscribe(user => {
      this.user = user;
      this.multipleReducerServe.controlModal(ModalTypes.Default, false);
      this.store$.dispatch(SetUserInfo({ user }));
      this.alertMessage('success', '登陆成功');
      
      this.storageServe.setStroge({
        key: 'wyUserId',
        value: user.profile.userId
      });
      if (params.remember) {
        this.storageServe.setStroge({
          key: 'wyUserLogin',
          value: JSON.stringify(codeJson(params))
        });
      }else{
        this.storageServe.removeStroge('wyUserLogin');
      }
    }, error => {
      this.alertMessage('error', error.message || '登陆失败');
    });
  }

  private alertMessage(type: string, msg: string) {
    this.showSpin = false;
    this.messageServe.create(type, msg);
  }
}
