import { Component, OnInit, Input, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { SongSheet } from '../../../services/data-types/common.types';

@Component({
  selector: 'app-single-sheet',
  templateUrl: './single-sheet.component.html',
  styleUrls: ['./single-sheet.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SingleSheetComponent implements OnInit {
  @Input() sheet: SongSheet;
  @Output() onPlay = new EventEmitter<number>();
  constructor() { }

  ngOnInit() {
  }

  playSheet(id: number) {
    this.onPlay.emit(id);
  }
}
