import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-wy-check-code',
  templateUrl: './wy-check-code.component.html',
  styleUrls: ['./wy-check-code.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WyCheckCodeComponent implements OnInit, OnChanges {
  private phoneHideStr = '';

  formModel: FormGroup;
  showRepeatBtn = false;
  showErrorTip = false;
  @Input() codePass = false;
  @Input() timing: number;
  @Input ()
  set phone(phone: string) {
    const arr = phone.split('');
    arr.splice(3, 4, '****');
    this.phoneHideStr = arr.join('');
  }

  get phone() {
    return this.phoneHideStr;
  }

  @Output() onCheckCode = new EventEmitter<string>();
  @Output() onReatSendCode = new EventEmitter<string>();
  @Output() onCheckExist = new EventEmitter<void>();
  constructor() {
    this.formModel = new FormGroup({
      code: new FormControl('', [Validators.required, Validators.pattern(/\d{4}/)])
    });

    const codeControl = this.formModel.get('code');
    codeControl.statusChanges.subscribe(status => {
      if (status === 'VALID') {
        this.onCheckCode.emit(this.formModel.value.code);
      }
    });
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.timing) {
      this.showRepeatBtn = this.timing <= 0;
    }

    if (changes.codePass && !changes.codePass.firstChange) {
      this.showErrorTip = !this.codePass;
    }
  }
  onSubmit() {
    if (this.formModel.valid && this.codePass) {
       this.onCheckExist.emit();
    }
  }
}
