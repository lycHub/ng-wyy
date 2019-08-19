import { Component, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MemberService } from '../../../../service/member.service';
import { NzMessageService } from 'ng-zorro-antd';
import { interval } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-wy-layer-register',
  templateUrl: './wy-layer-register.component.html',
  styleUrls: ['./wy-layer-register.component.less']
})
export class WyLayerRegisterComponent {
  formModel: FormGroup;
  showCode = false;
  timing: number;


  @Output() onChangeModalType = new EventEmitter<void>();

  constructor(
    private fb: FormBuilder,
    private messageServe: NzMessageService,
    private memberServe: MemberService) {
    this.formModel = this.fb.group({
      phone: ['', [Validators.required, Validators.pattern(/^1\d{10}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      remember: [true]
    });
  }
  submitForm(): void {
    if (this.formModel.valid) {
      this.sendCode();
    }
  }

  sendCode() {
    this.memberServe.sendCode(this.getFormValue('phone')).subscribe(code => {
      this.timing = 60;
      if (!this.showCode) {
        this.showCode = true;
      }
      interval(1000).pipe(take(60)).subscribe(() => this.timing--);
    }, error => {
      this.messageServe.error(error.message);
    });
  }


  // 注册
  onRegister(captcha: string) {
    this.memberServe.register({
      phone: this.getFormValue('phone'),
      password: this.getFormValue('password'),
      captcha
    }).subscribe(res => {
    }, error => {
      this.messageServe.error(error.message);
    });
  }

  private getFormValue(key: string): any {
    return this.formModel.get(key).value;
  }

  otherMethod() {
    this.onChangeModalType.emit();
    this.showCode = false;
    this.formModel.reset();
  }
}
