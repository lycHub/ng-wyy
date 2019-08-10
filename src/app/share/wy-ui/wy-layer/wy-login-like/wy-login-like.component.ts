import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { SongSheet } from 'src/app/service/data-modals/common.models';
import { Store, select } from '@ngrx/store';
import { AppStoreModule } from 'src/app/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { getLikeId } from '../../../../store/selectors/member.selector';
import { MemberService } from 'src/app/service/member/member.service';
import { MultipleReducersService } from 'src/app/store/multiple-reducers.service';
import { NzMessageService } from 'ng-zorro-antd';
import { SetModalVisible } from '../../../../store/actions/member.actions';

@Component({
  selector: 'app-wy-login-like',
  templateUrl: './wy-login-like.component.html',
  styleUrls: ['./wy-login-like.component.less']
})
export class WyLoginLikeComponent implements OnInit, OnDestroy {
  sheetName = '';
  creating = false;
  likeId: number;
  @Input() mySheets: SongSheet[];
  private appStore$: Observable<AppStoreModule>;
  private destroy$ = new Subject<void>();
  constructor(
    private store$: Store<AppStoreModule>,
    private memberServe: MemberService,
    private multipleReducerServe: MultipleReducersService,
    private messageServe: NzMessageService
  ) {
    this.appStore$ = this.store$.pipe(select('member'), takeUntil(this.destroy$));
    this.appStore$.pipe(select(getLikeId)).subscribe(id => this.watchLikeId(id));
  }

  ngOnInit() {
  }

  private watchLikeId(id: number) {
    this.likeId = id;
  }

  // 收藏歌曲
  onLike(id: number) {
    this.memberServe.likeSong(id, this.likeId).subscribe(code => {
      console.log('code :', code);
      if (code === 200) {
        this.alertMessage('success', '收藏成功');
        this.store$.dispatch(SetModalVisible({ visible: false }));
      }else{
        this.alertMessage('error', '收藏失败');
      }
    }, error => {
      this.alertMessage('error', error.msg || '收藏失败');
    });
  }

  onSubmit() {
    this.memberServe.createSheet(this.sheetName).subscribe(res => {
      if (res.code === 200) {
        this.onLike(res.id);
      }else{
        this.alertMessage('error', res.msg || '新建歌单失败');
      }
    });
  }

  private alertMessage(type: string, msg: string) {
    this.messageServe.create(type, msg);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
