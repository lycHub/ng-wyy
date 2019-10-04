import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { ShareInfo } from '../../../../store/reducers/member.reducer';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ShareParams } from 'src/app/services/member.service';

const MAX_MSG = 140;

@Component({
  selector: 'app-wy-layer-share',
  templateUrl: './wy-layer-share.component.html',
  styleUrls: ['./wy-layer-share.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WyLayerShareComponent implements OnInit {
  @Input() shareInfo: ShareInfo;
  @Output() onCancel = new EventEmitter<void>();
  @Output() onShare = new EventEmitter<ShareParams>();
  formModel: FormGroup;
  surplusMsgCount = MAX_MSG;
  constructor() {
    this.formModel = new FormGroup({
      msg: new FormControl('', Validators.maxLength(MAX_MSG))
    });
    this.formModel.get('msg').valueChanges.subscribe(msg => {
      this.surplusMsgCount = MAX_MSG - msg.length;
    });
  }

  ngOnInit() {
  }

  onSubmit() {
    if (this.formModel.valid) {
      this.onShare.emit({
        id: this.shareInfo.id,
        msg: this.formModel.get('msg').value,
        type: this.shareInfo.type
      });
    }
  }
}
