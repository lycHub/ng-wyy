import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {SongSheetList} from "../../../pages/home/home.component";

@Component({
  selector: 'app-wy-player',
  templateUrl: './wy-player.component.html',
  styleUrls: ['./wy-player.component.less']
})
export class WyPlayerComponent implements OnInit, OnChanges {
  arr = Array(100).fill(3);
  @Input() songSheetList: SongSheetList[];
  constructor() { }
  ngOnInit() {}
  
  ngOnChanges(changes: SimpleChanges): void {
    console.log('change');
    console.log('currentValue', changes.songSheetList.currentValue);
    // console.log('currentValue', changes);
  }
}
