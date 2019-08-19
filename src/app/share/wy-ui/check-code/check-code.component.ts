import { Component, ChangeDetectionStrategy, EventEmitter, Input, OnChanges, SimpleChanges, Output, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';
import { MemberService } from '../../../service/member.service';

enum Exist {
  '存在' = 1,
  '不存在' = -1
}

@Component({
  selector: 'app-check-code',
  templateUrl: './check-code.component.html',
  styleUrls: ['./check-code.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckCodeComponent implements OnChanges, OnInit {
  @Input() timing = 60;
  @Input() phone: string;
  @Output() onRepeatSendCode = new EventEmitter<void>();
  @Output() onRegister = new EventEmitter<string>();

  showRepeatBtn = false;
  errorTip = '';
  formModel: FormGroup;

  private hasPassed = false;
  constructor(
    private fb: FormBuilder,
    private messageServe: NzMessageService,
    private memberServe: MemberService
  ) {
    this.formModel = this.fb.group({
      code: ['', [Validators.required, Validators.pattern(/\d{4}/)]]
    });
    const codeControl = this.formModel.get('code');
    codeControl.statusChanges.subscribe(status => {
      if (status === 'VALID') {
        this.checkCode(codeControl.value);
      }
    })
  }

  ngOnInit() {
    
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['timing']) {
      this.showRepeatBtn = this.timing <= 0;
    }
  }


  // 验证验证码
  private checkCode (code: string) {
    this.memberServe.checkCode(Number(this.phone), Number(code)).subscribe(res => {
      this.hasPassed = true;
    }, error => {
      this.errorTip = '验证码错误';
      this.hasPassed = false;
    });
  }

  onInput(value: string) {
    if (/\D/.test(value)) {
      this.errorTip = '请输入数字';
    }else {
      this.errorTip = '';
    }
  }


  submitForm(): void {
    if (this.formModel.valid && this.hasPassed) {
      this.checkExist();
    }else {
      this.errorTip = '验证码错误';
    }
  }

  private checkExist() {
    this.memberServe.checkExist(Number(this.phone)).subscribe(res => {
      if (Exist[res] === '存在') {
        this.messageServe.error('该账号已存在，可直接登陆');
      }else {
        this.onRegister.emit(this.formModel.get('code').value);
      }
    });
  }
}
