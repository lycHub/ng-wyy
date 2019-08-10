import { Component, Input, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { recordVal } from 'src/app/service/data-modals/member.models';
import { RecordType } from 'src/app/service/member/member.service';
import { Song } from 'src/app/service/data-modals/common.models';

@Component({
  selector: 'app-records',
  templateUrl: './records.component.html',
  styleUrls: ['./records.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecordsComponent {
  @Input() userRecord: recordVal[];
  @Input() listenSongs = 0;
  @Input() currentIndex: number;
  @Input() recordType = RecordType.weekData;

  @Output() onChangeRecordType = new EventEmitter<number>();
  @Output() onAddSong = new EventEmitter<[Song, boolean]>();
  @Output() onLikeSong = new EventEmitter<number>();
}
