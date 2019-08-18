import { Component, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MemberService } from '../../../../service/member/member.service';
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
      console.log('phone', this.formModel.get('phone'));
      console.log('password', this.formModel.get('password'));
      this.sendCode();
    }
  }

  sendCode() {
    this.memberServe.sendCode(this.formModel.get('phone').value).subscribe(code => {
      console.log('sendCode :', code);
      this.timing = 60;
      if (!this.showCode) {
        this.showCode = true;
      }
      interval(1000).pipe(take(60)).subscribe(res => this.timing--);
    }, error => {
      this.messageServe.error(error.message);
    });
  }

  otherMethod() {
    this.onChangeModalType.emit();
    this.showCode = false;
    this.formModel.reset();
  }
}
