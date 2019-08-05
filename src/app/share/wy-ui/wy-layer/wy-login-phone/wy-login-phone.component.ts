import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-wy-login-phone',
  templateUrl: './wy-login-phone.component.html',
  styleUrls: ['./wy-login-phone.component.less']
})
export class WyLoginPhoneComponent implements OnInit {
  validateForm: FormGroup;
  constructor(private fb: FormBuilder) {
    this.validateForm = this.fb.group({
      phone: ['', [Validators.required]],
      password: ['', [Validators.required]],
      remember: [true]
    });
  }

  ngOnInit() {
  }

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
  }

}
