import {Component, Inject} from '@angular/core';
import {NavigationEnd, Router} from "@angular/router";
import {Observable} from "rxjs/index";
import {filter} from "rxjs/internal/operators";
import {WINDOW} from "./core/inject-tokens";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  navEnd: Observable<NavigationEnd>;
  loadPercent = 0;
  constructor(private router: Router, @Inject(WINDOW) private win: Window) {
    this.navEnd = router.events.pipe(filter((evt) => evt instanceof NavigationEnd)) as Observable<NavigationEnd>;
    const timer = this.win.setInterval(() => {
      this.loadPercent = Math.min(95, ++this.loadPercent);
    }, 100);
    this.navEnd.subscribe(() => {
      timer && clearInterval(timer);
      this.loadPercent = 100;
    });
  }
}
