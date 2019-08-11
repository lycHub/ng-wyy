import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppStoreModule } from 'src/app/store';
import { SetModalVisible } from 'src/app/store/actions/member.actions';
import { NzMessageService } from 'ng-zorro-antd';
import { MemberService } from 'src/app/service/member/member.service';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { getShareParams } from 'src/app/store/selectors/member.selector';
import { ShareParams } from '../../../../store/reducers/member.reducer';

const MaxMsg = 140;

@Component({
  selector: 'app-wy-layer-share',
  templateUrl: './wy-layer-share.component.html',
  styleUrls: ['./wy-layer-share.component.less']
})
export class WyLayerShareComponent implements OnInit, OnDestroy {
  msg = '';
  surplusTxt = MaxMsg;
  showAlert = false;
  shareParams: ShareParams;
  private appStore$: Observable<AppStoreModule>;
  private destroy$ = new Subject<void>();
  constructor(
    private store$: Store<AppStoreModule>,
    private messageServe: NzMessageService,
    private memberServe: MemberService
  ) {
    this.appStore$ = this.store$.pipe(select('member'), takeUntil(this.destroy$));
    this.appStore$.pipe(select(getShareParams)).subscribe(params => this.watchShareParams(params));
  }

  ngOnInit() {
  }

  private watchShareParams(params: ShareParams) {
    this.shareParams = params;
  }

  onMsgChange(msg: string) {
    this.surplusTxt = MaxMsg - msg.length;
  }

  onShare() {
    if (this.surplusTxt < 0) {
      this.showAlert = true;
    }else{
      this.memberServe.userShare(this.shareParams.id, this.msg, this.shareParams.type).subscribe(code => {
        if (code === 200) {
          this.alertMessage('success', '分享成功');
          this.msg = '';
          this.store$.dispatch(SetModalVisible({ visible: false }));
        }else{
          this.alertMessage('error', '分享失败');
        }
      });
    }
  }

  private alertMessage(type: string, msg: string) {
    this.messageServe.create(type, msg);
  }

  onCancel() {
    this.store$.dispatch(SetModalVisible({ visible: false }));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
