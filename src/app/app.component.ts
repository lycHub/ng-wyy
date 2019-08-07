import { Component, Inject } from '@angular/core';
import {NavigationEnd, Router, ActivatedRoute} from "@angular/router";
import { Observable, from } from 'rxjs/index';
import {filter, map, mergeMap} from "rxjs/internal/operators";
import {WINDOW} from "./core/inject-tokens";
import { Title, Meta } from '@angular/platform-browser';
import { ModalTypes } from './share/wy-ui/wy-layer/wy-layer-modal/wy-layer-modal.component';
import { LoginParams } from './share/wy-ui/wy-layer/wy-login-phone/wy-login-phone.component';
import { MemberService } from './service/member/member.service';
import { NzMessageService } from 'ng-zorro-antd';
import { AppStoreModule } from './store';
import { Store } from '@ngrx/store';
import { SetModalVisible, SetUserInfo } from './store/actions/member.actions';
import Cookies from 'universal-cookie';
import { codeJson } from './utils/base64';
import { StorageService } from './service/storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  
  currentModal = ModalTypes.Default;
  showSpin = false;

  navEnd: Observable<NavigationEnd>;
  loadPercent = 0;
  
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
  
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private titleService: Title,
    private memberServe: MemberService,
    private meta: Meta,
    private message: NzMessageService,
    private store$: Store<AppStoreModule>,
    private storageServe: StorageService,
    @Inject(WINDOW) private win: Window) {
    const cookies = new Cookies();
    const MUSIC_U = cookies.get('MUSIC_U');
    const userId = this.storageServe.getStorage('wyUserId');
    if (MUSIC_U && userId) {
      this.memberServe.refreshLogin(Number(userId)).subscribe(user => this.store$.dispatch(SetUserInfo({ user })));
    }
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

  openModal(type: string) {
    this.currentModal = ModalTypes[type];
    this.store$.dispatch(SetModalVisible({ visible: true }));
  }


  // 登陆
  onLogin(params: LoginParams) {
    this.showSpin = true;
    this.doLogin(params);
  }

  private doLogin(params: LoginParams) {
    this.memberServe.login(params).subscribe(user => {
      this.store$.dispatch(SetModalVisible({ visible: false }));
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
    this.message.create(type, msg);
  }
}
