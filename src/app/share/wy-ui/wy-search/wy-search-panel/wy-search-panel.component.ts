import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { SearchResult } from '../../../../service/search.service';
import {Router} from "@angular/router";
@Component({
  selector: 'app-wy-search-panel',
  template: `
  <div class="search-panel">
    <div class="list-wrap">
      <div class="list-item clearfix" [hidden]="!searchResult?.songs">
        <div class="hd">
          <i class="ico ico-song"></i>
          <span>单曲</span>
        </div>
        <ul>
          <li class="ellipsis" *ngFor="let item of searchResult?.songs" [innerHTML]="item.name" (mousedown)="toInfo('songInfo', item.id)"></li>
        </ul>
      </div>
      <div class="list-item clearfix" [hidden]="!searchResult?.artists">
        <div class="hd">
          <i class="ico ico-singer"></i>
          <span>歌手</span>
        </div>
        <ul>
          <li class="ellipsis" *ngFor="let item of searchResult?.artists" [innerHTML]="item.name" (mousedown)="toInfo('singer', item.id)"></li>
        </ul>
      </div>
      <div class="list-item clearfix" [hidden]="!searchResult?.playlists">
        <div class="hd">
          <i class="ico ico-sheet"></i>
          <span>歌单</span>
        </div>
        <ul>
          <li class="ellipsis" *ngFor="let item of searchResult?.playlists" [innerHTML]="item.name" (mousedown)="toInfo('sheetInfo', item.id)"></li>
        </ul>
      </div>
    </div>
  </div>`,
  styleUrls: ['./wy-search-panel.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WySearchPanelComponent {
  @Input() searchResult: SearchResult;
  constructor(private router: Router) {
    
  }

  toInfo(path: string, id: number) {
    this.router.navigate(['/' + path, id]);
  }
}
