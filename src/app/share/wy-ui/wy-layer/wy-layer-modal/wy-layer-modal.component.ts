import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppStoreModule } from '../../../../store/index';
import { getModalVisible, getModalType } from '../../../../store/selectors/member.selector';

@Component({
  selector: 'app-wy-layer-modal',
  templateUrl: './wy-layer-modal.component.html',
  styleUrls: ['./wy-layer-modal.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WyLayerModalComponent implements OnInit {

  constructor(
    private store$: Store<AppStoreModule>
  ) {
    const appStore$ = this.store$.pipe(select('member'));
    appStore$.pipe(select(getModalVisible)).subscribe(visib => {
      console.log('visib :', visib);
    });
    appStore$.pipe(select(getModalType)).subscribe(type => {
      console.log('type :', type);
    });
  }

  ngOnInit() {
  }

}
