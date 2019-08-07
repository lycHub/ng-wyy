import { Component, Output, EventEmitter, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { WINDOW } from 'src/app/core/inject-tokens';


export type LoginParams = {
  phone: number;
  password: string;
  remember: boolean;
}


@Component({
  selector: 'app-wy-login-phone',
  templateUrl: './wy-login-phone.component.html',
  styleUrls: ['./wy-login-phone.component.less']
})
export class WyLoginPhoneComponent {
  formModel: FormGroup;
  @Output() onLogin = new EventEmitter<LoginParams>();

  constructor(private fb: FormBuilder, @Inject(WINDOW) private win: Window) {
    let phone = '';
    let password = '';
    let remember = true;
    const wyUserLogin = JSON.parse(this.win.localStorage.getItem('wyUserLogin'));
    if (wyUserLogin) {
      phone = wyUserLogin.phone;
      password = wyUserLogin.password;
      remember = wyUserLogin.remember;
    }
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
