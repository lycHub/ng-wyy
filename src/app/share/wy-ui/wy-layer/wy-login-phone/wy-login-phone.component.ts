import { Component, Output, EventEmitter, Inject, OnChanges, SimpleChanges, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { codeJson } from 'src/app/utils/base64';
import { ModalTypes } from '../../../../store/reducers/member.reducer';


export type LoginParams = {
  phone: number | string;
  password: string;
  remember: boolean;
}


@Component({
  selector: 'app-wy-login-phone',
  templateUrl: './wy-login-phone.component.html',
  styleUrls: ['./wy-login-phone.component.less']
})
export class WyLoginPhoneComponent implements OnChanges {
  formModel: FormGroup;
  @Input() wyUserLogin: LoginParams;
  @Output() onLogin = new EventEmitter<LoginParams>();
  @Output() onChangeModalType = new EventEmitter<string | void>();
  constructor(private fb: FormBuilder) {
    
    
  }


  ngOnChanges(changes: SimpleChanges): void {
    const newUserLoginParams = changes['wyUserLogin'];
    if (newUserLoginParams) {
      let phone = '';
      let password = '';
      let remember = true;
      if (newUserLoginParams.currentValue) {
        const wyUserLogin = codeJson(newUserLoginParams.currentValue, 'decode');
        phone = wyUserLogin.phone;
        password = wyUserLogin.password;
        remember = wyUserLogin.remember;
      }
      this.setModel({ phone, password, remember });
    }
    
  }


  private setModel({ phone, password, remember }: LoginParams) {
    this.formModel = this.fb.group({
      phone: [phone, [Validators.required, Validators.pattern(/^1\d{10}$/)]],
      password: [password, [Validators.required, Validators.minLength(6)]],
      remember: [remember]
    });
  }

  
  submitForm(): void {
    const model = this.formModel;
    if (model.valid) {
      this.onLogin.emit({
        phone: model.get('phone').value,
        password: model.get('password').value,
        remember: model.get('remember').value
      });
    }
  }
}
