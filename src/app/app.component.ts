import { Component } from '@angular/core';
import { SearchService } from './services/search.service';
import { SearchResult } from './services/data-types/common.types';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  menu = [{
    label: '发现',
    path: '/home'
  }, {
    label: '歌单',
    path: '/sheet'
  }];

  searchResult: SearchResult;

  constructor(
    private searchServe: SearchService
  ) {

  }
  onSearch(keywords: string) {
    console.log('keywords :', keywords);
    if (keywords) {
      this.searchServe.search(keywords).subscribe(res => {
        this.searchResult = res;
      });
    }else {
      this.searchResult = {};
    }
  }
}
