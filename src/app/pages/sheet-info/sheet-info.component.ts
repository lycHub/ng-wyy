import { Component } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import { SongService } from 'src/app/service/song/song.service';
import { SongSheet } from 'src/app/service/data.models';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-sheet-info',
  templateUrl: './sheet-info.component.html',
  styleUrls: ['./sheet-info.component.less']
})
export class SheetInfoComponent {
  sheetInfo: SongSheet;
  description = {
    short: '',
    long: ''
  }

  controlDesc = {
    isExpand: false,
    label: '展开',
    iconCls: 'down'
  }
  
  constructor(private route: ActivatedRoute) {
    this.route.data.pipe(map(res => res.sheetInfo)).subscribe(res => {
      this.sheetInfo = res;
      console.log('添加歌曲 vue-app 10-6');
      this.changeDesc(res.description);
    });
  }

  // 控制简介的展开和隐藏
  toggleDesc() {
    this.controlDesc.isExpand = !this.controlDesc.isExpand;
    if (this.controlDesc.isExpand) {
      this.controlDesc.label = '收起';
      this.controlDesc.iconCls = 'up';
    } else {
      this.controlDesc.label = '展开';
      this.controlDesc.iconCls = 'down';
    }
  }

  private changeDesc(desc: string) {
    const str = '<b>介绍：</b>' + desc.replace(/\n/g, '<br />');
    this.description.short = str.slice(0, 99) + '...';
    this.description.long = str;
  }

}
