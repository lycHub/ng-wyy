import { Component, OnInit, Input, OnChanges, Output, EventEmitter, OnDestroy } from '@angular/core';
import { WySerchBusService } from '../wy-serch-bus.service';

@Component({
  selector: 'app-wy-search-panel',
  templateUrl: './wy-search-panel.component.html',
  styleUrls: ['./wy-search-panel.component.less']
})
export class WySearchPanelComponent implements OnInit, OnDestroy {
  constructor(private searchBusServe: WySerchBusService) {
    
  }

  ngOnInit() {
    this.searchBusServe.subData().subscribe(res => {
      console.log('sub data:', res);
    });
  }

  outEvent() {
    this.searchBusServe.broadcast('clicked xxx');
  }

  ngOnDestroy(): void {
    // this.evtSub.unsubscribe();
  }
}
