import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-wy-login-phone',
  templateUrl: './wy-login-phone.component.html',
  styleUrls: ['./wy-login-phone.component.less']
})
export class WyLoginPhoneComponent {
  formModel: FormGroup;
  constructor(private fb: FormBuilder) {
    this.formModel = this.fb.group({
      phone: ['', [Validators.required, Validators.pattern(/^1\d{10}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      remember: [true]
    });
  }
  submitForm(): void {
    if (this.formModel.valid) {
      console.log('phone', this.formModel.get('phone'));
      console.log('password', this.formModel.get('password'));
    }
  }

}
