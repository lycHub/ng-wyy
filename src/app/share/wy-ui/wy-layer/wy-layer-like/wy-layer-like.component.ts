import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { SongSheet } from 'src/app/service/data-modals/common.models';
import { Store, select } from '@ngrx/store';
import { AppStoreModule } from 'src/app/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { getLikeId } from '../../../../store/selectors/member.selector';
import { MemberService } from 'src/app/service/member.service';
import { NzMessageService } from 'ng-zorro-antd';
import { SetModalVisible } from '../../../../store/actions/member.actions';
import { ModalTypes } from 'src/app/store/reducers/member.reducer';
import { MultipleReducersService } from '../../../../store/multiple-reducers.service';

@Component({
  selector: 'app-wy-layer-like',
  templateUrl: './wy-layer-like.component.html',
  styleUrls: ['./wy-layer-like.component.less']
})
export class WyLayerLikeComponent implements OnInit, OnDestroy {
  sheetName = '';
  creating = false;
  likeId: string;
  @Input() mySheets: SongSheet[];
  private appStore$: Observable<AppStoreModule>;
  private destroy$ = new Subject<void>();
  constructor(
    private store$: Store<AppStoreModule>,
    private memberServe: MemberService,
    private messageServe: NzMessageService,
    private multipleReducerServe: MultipleReducersService
  ) {
    this.appStore$ = this.store$.pipe(select('member'), takeUntil(this.destroy$));
    this.appStore$.pipe(select(getLikeId)).subscribe(id => this.watchLikeId(id));
  }

  ngOnInit() {
  }

  private watchLikeId(id: string) {
    this.likeId = id;
  }

  // 收藏歌曲
  onLike(id: number) {
    this.memberServe.likeSongs(id, this.likeId).subscribe(code => {
      if (code === 200) {
        this.alertMessage('success', '收藏成功');
        this.multipleReducerServe.controlModal(ModalTypes.Default, false);
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
