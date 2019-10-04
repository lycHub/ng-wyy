import { Component, OnInit, ChangeDetectionStrategy, Input, OnChanges } from '@angular/core';
import { SongSheet } from '../../../../services/data-types/common.types';
import { AppStoreModule } from '../../../../store/index';
import { Store, select } from '@ngrx/store';
import { getLikeId } from '../../../../store/selectors/member.selector';

@Component({
  selector: 'app-wy-layer-like',
  templateUrl: './wy-layer-like.component.html',
  styleUrls: ['./wy-layer-like.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WyLayerLikeComponent implements OnInit, OnChanges {
  @Input() mySheets: SongSheet[];
  private likeId: string;
  constructor(private store$: Store<AppStoreModule>) {
    this.store$.pipe(select('member'), select(getLikeId)).subscribe(id => {
      if (id) {
        this.likeId = id;
      }
    });
  }

  ngOnInit() {
  }

  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    console.log('mySheets :', changes['mySheets'].currentValue);
  }

  onLike(id: string) {
    
  }
}
