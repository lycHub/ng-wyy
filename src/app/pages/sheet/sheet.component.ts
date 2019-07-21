import { Component, OnInit } from '@angular/core';
import { SheetService, SheetParams } from 'src/app/service/sheet/sheet.service';
import { SongSheet, playlistInfo, Song } from '../../service/data.models';
import { SongService } from 'src/app/service/song/song.service';
import { MultipleReducersService } from 'src/app/store/multiple-reducers.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-sheet',
  templateUrl: './sheet.component.html',
  styleUrls: ['./sheet.component.less']
})
export class SheetComponent implements OnInit {
  radioValue = 'hot';
  private listParams: SheetParams = {
    cat: '全部',
    limit: 35,
    offset: 1,
    order: 'hot'
  }

  playlistInfo: playlistInfo;
  total = 0;

  constructor(private router: Router, private route: ActivatedRoute, private sheetServe: SheetService, private SongServe: SongService, private multipleReducerServe: MultipleReducersService) {
    this.listParams.cat = this.route.snapshot.queryParamMap.get('cat') || '全部';
    this.getList();
  }

  ngOnInit() {
  }

  orderChange(order: 'new' | 'hot') {
    this.listParams.order = order;
    this.listParams.offset = 1;
    this.getList();
  }

  onPageChange(page: number) {
    this.listParams.offset = page;
    this.getList();
  }

  playSong(id: number) {
    this.SongServe.getSongList(id).subscribe(list => {
      this.multipleReducerServe.selectPlay(({ list, index: 0 }));
    });
  }

  private getList() {
    this.sheetServe.getSheetList(this.listParams).subscribe(res => this.playlistInfo = res);
  }
  
  toInfo(id: number) {
    this.router.navigate(['/sheetInfo', id]);
  }

  trackBySongList(index: number, songSheet: SongSheet): number { return songSheet.id; }
}
