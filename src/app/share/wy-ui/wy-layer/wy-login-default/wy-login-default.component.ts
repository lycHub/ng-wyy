import { Component, OnInit, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { ModalTypes } from 'src/app/store/reducers/member.reducer';

@Component({
  selector: 'app-wy-login-default',
  template: `<div class="cnzt">
    <div class="select-log">
      <div class="mid-wrap">
        <div class="pic">
          <img appImgDefault src="../assets/images/platform.png" />
        </div>
        <div class="methods">
          <button nz-button nzType="primary" nzSize="large" nzBlock (click)="onChangeModalType.emit('loginByPhone')">手机号登陆</button>
          <button nz-button nzSize="large" nzBlock (click)="onChangeModalType.emit('register')">注册</button>
        </div>
      </div>
    </div>
  </div>`,
  styleUrls: ['./wy-login-default.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WyLoginDefaultComponent implements OnInit {
  @Output() onChangeModalType = new EventEmitter<string | void>();
  constructor() { }

  ngOnInit() {}
}
