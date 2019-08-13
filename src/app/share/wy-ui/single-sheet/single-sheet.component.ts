import { Component, ChangeDetectionStrategy, Output, Input, EventEmitter } from '@angular/core';
import { SongSheet } from 'src/app/service/data-modals/common.models';

@Component({
  selector: 'app-single-sheet',
  template: `
  <ng-container>
    <a class="cover">
      <img src="{{sheet.picUrl || sheet.coverImgUrl}}" alt="{{sheet.name}}" appImgDefault />
      <div class="bottom">
        <div class="num">
          <i class="icon erji"></i>
          <span>{{sheet.playCount | PlayCount}}</span>
        </div>
        <i class="icon play" (click)="play($event)"></i>
      </div>
    </a>
    <span class="dec">{{sheet.name}}</span>
  </ng-container>`,
  styleUrls: ['./single-sheet.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SingleSheetComponent {
  @Input() sheet: SongSheet;
  @Output() onPlay = new EventEmitter<number>();
  constructor() { }
  play(evt: MouseEvent) {
    evt.stopPropagation();
    this.onPlay.emit(this.sheet.id);
  }
}
