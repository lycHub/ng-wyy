import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-wy-layer-register',
  templateUrl: './wy-layer-register.component.html',
  styleUrls: ['./wy-layer-register.component.less']
})
export class WyLayerRegisterComponent {

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
