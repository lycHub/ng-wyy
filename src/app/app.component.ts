import { Component, Inject, TemplateRef, ViewChild, AfterViewInit } from '@angular/core';
import {NavigationEnd, Router, ActivatedRoute} from "@angular/router";
import {Observable} from "rxjs/index";
import {filter, map, mergeMap} from "rxjs/internal/operators";
import {WINDOW} from "./core/inject-tokens";
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements AfterViewInit {
  
  // nowModalContent: TemplateRef<{}>;
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

  isVisible = false;

  @ViewChild('loginModal', { static: false }) private loginModalRef: TemplateRef<{}>;
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private titleService: Title,
    private meta: Meta,
    @Inject(WINDOW) private win: Window) {
      // this.nowModalContent = this.loginModalRef;
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
}
