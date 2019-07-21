import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-sheet-info',
  templateUrl: './sheet-info.component.html',
  styleUrls: ['./sheet-info.component.less']
})
export class SheetInfoComponent implements OnInit {

  constructor(private route: ActivatedRoute) {
    let id = this.route.snapshot.paramMap.get('id');
    console.log('params', id);
  }

  ngOnInit() {
  }

}
