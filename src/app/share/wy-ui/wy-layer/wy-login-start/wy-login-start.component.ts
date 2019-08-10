import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ModalTypes } from 'src/app/store/reducers/member.reducer';

@Component({
  selector: 'app-wy-login-start',
  template: `<div class="cnzt">
  <div class="select-log">
    <div class="mid-wrap">
      <div class="pic">
        <img src="../assets/images/platform.png" />
      </div>
      <div class="methods">
        <button nz-button nzType="primary" nzSize="large" nzBlock (click)="onChangeModalType.emit('loginByPhone')">手机号登陆</button>
        <button nz-button nzSize="large" nzBlock (click)="onChangeModalType.emit('register')">注册</button>
      </div>
    </div>
  </div>
</div>`,
  styleUrls: ['./wy-login-start.component.less']
})
export class WyLoginStartComponent implements OnInit {
  @Output() onChangeModalType = new EventEmitter<ModalTypes>();
  constructor() { }

  ngOnInit() {
  }

}
