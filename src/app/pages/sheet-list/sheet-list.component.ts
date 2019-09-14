import { Component, OnInit } from '@angular/core';
import { SheetParams, SheetService } from '../../services/sheet.service';
import { ActivatedRoute } from '@angular/router';
import { SheetList } from 'src/app/services/data-types/common.types';

@Component({
  selector: 'app-sheet-list',
  templateUrl: './sheet-list.component.html',
  styleUrls: ['./sheet-list.component.less']
})
export class SheetListComponent implements OnInit {
  listParams: SheetParams = {
    cat: '全部',
    order: 'hot',
    offset: 1,
    limit: 35
  }
  sheets: SheetList;
  constructor(
    private route: ActivatedRoute,
    private sheetServe: SheetService
  ) {
    this.listParams.cat = this.route.snapshot.queryParamMap.get('cat') || '全部';
    this.getList();
  }

  ngOnInit() {
  }

  private getList() {
    this.sheetServe.getSheets(this.listParams).subscribe(sheets => this.sheets = sheets);
  }
}
