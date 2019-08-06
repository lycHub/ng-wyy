import { Component, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';


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

  constructor(private fb: FormBuilder) {
    this.formModel = this.fb.group({
      phone: ['', [Validators.required, Validators.pattern(/^1\d{10}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      remember: [true]
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
