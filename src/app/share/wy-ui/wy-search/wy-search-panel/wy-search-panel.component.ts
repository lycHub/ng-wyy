import { Component, OnInit } from '@angular/core';
import { SearchResult } from '../../../../services/data-types/common.types';
import { Router } from '@angular/router';
import { JumpService } from '../jump.service';

@Component({
  selector: 'app-wy-search-panel',
  templateUrl: './wy-search-panel.component.html',
  styleUrls: ['./wy-search-panel.component.less']
})
export class WySearchPanelComponent implements OnInit {
  searchResult: SearchResult;
  constructor(private router: Router, private jumpServe: JumpService) { }

  ngOnInit() {
  }

  // 跳转
  toInfo(path: [string, number]) {
    if (path[1]) {
      this.jumpServe.jump();
      this.router.navigate(path);
    }
  }

}
