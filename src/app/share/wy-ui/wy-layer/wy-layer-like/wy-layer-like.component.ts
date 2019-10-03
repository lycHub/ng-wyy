import { Component, OnInit, ChangeDetectionStrategy, Input, OnChanges } from '@angular/core';
import { SongSheet } from '../../../../services/data-types/common.types';

@Component({
  selector: 'app-wy-layer-like',
  templateUrl: './wy-layer-like.component.html',
  styleUrls: ['./wy-layer-like.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WyLayerLikeComponent implements OnInit, OnChanges {
 
  @Input() mySheets: SongSheet[];
  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    console.log('mySheets :', changes['mySheets'].currentValue);
  }
}
