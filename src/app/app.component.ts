import { Component, Inject, TemplateRef, ViewChild, AfterViewInit } from '@angular/core';
import {NavigationEnd, Router, ActivatedRoute} from "@angular/router";
import {Observable} from "rxjs/index";
import {filter, map, mergeMap} from "rxjs/internal/operators";
import {WINDOW} from "./core/inject-tokens";
import { Title, Meta } from '@angular/platform-browser';
import { ModalTypes, WyLayerModalComponent } from './share/wy-ui/wy-layer/wy-layer-modal/wy-layer-modal.component';
import { LoginParams } from './share/wy-ui/wy-layer/wy-login-phone/wy-login-phone.component';
import { MemberService } from './service/member/member.service';
import { NzMessageService } from 'ng-zorro-antd';
import { AppStoreModule } from './store';
import { Store } from '@ngrx/store';
import { SetModalVisible, SetUserInfo } from './store/actions/member.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements AfterViewInit {
  
  currentModal = ModalTypes.LoginByPhone;
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
  
  @ViewChild(WyLayerModalComponent, { static: true }) private memberModal: WyLayerModalComponent;
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private titleService: Title,
    private memberServe: MemberService,
    private meta: Meta,
    private message: NzMessageService,
    private store$: Store<AppStoreModule>,
    @Inject(WINDOW) private win: Window) {
    const wyUserLogin = this.win.localStorage.getItem('wyUserLogin');
    if (wyUserLogin) {
      this.doLogin(JSON.parse(wyUserLogin));
    }
    this.setLoadingBar();
    this.setMT();
  }

  ngAfterViewInit(): void {
    
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


  // 登陆
  onLogin(params: LoginParams) {
    // console.log('onLogin :', params);
    this.showSpin = true;
    this.doLogin(params);
  }

  private doLogin(params: LoginParams) {
    this.memberServe.login(params).subscribe(user => {
      this.store$.dispatch(SetModalVisible({ visible: false }));
      this.store$.dispatch(SetUserInfo({ user }));
      if (params.remember) {
        this.win.localStorage.setItem('wyUserLogin', JSON.stringify(params));
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
