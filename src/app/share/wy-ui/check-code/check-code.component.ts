import { Component, ChangeDetectionStrategy, EventEmitter, Input, OnChanges, SimpleChanges, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-check-code',
  templateUrl: './check-code.component.html',
  styleUrls: ['./check-code.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckCodeComponent implements OnChanges {
  @Input() timing = 60;
  @Output() onRepeatSendCode = new EventEmitter<void>();

  showRepeatBtn = false;

  formModel: FormGroup;
  constructor(private fb: FormBuilder) {
    this.formModel = this.fb.group({
      code: ['', [Validators.required]]
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['timing']) {
      this.showRepeatBtn = this.timing <= 0;
    }
  }

  submitForm(): void {
    if (this.formModel.valid) {
      console.log('code', this.formModel.get('code'));
    }
  }

}
