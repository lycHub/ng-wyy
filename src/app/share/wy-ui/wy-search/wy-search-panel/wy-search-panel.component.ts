import { Component, OnInit, Input, OnChanges, Output, EventEmitter, OnDestroy } from '@angular/core';
import { WySerchBusService } from '../wy-serch-bus.service';

@Component({
  selector: 'app-wy-search-panel',
  templateUrl: './wy-search-panel.component.html',
  styleUrls: ['./wy-search-panel.component.less']
})
export class WySearchPanelComponent implements OnInit, OnChanges, OnDestroy {
 
  
  @Input() test = 'defTest';

  // evtSub = new Subject();
  @Output('out') out = new EventEmitter<string>();

  constructor(private searchBusServe: WySerchBusService) { }

  ngOnInit() {
    
  }
  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    console.log('test change :', changes['test']);
  }

  outEvent() {
    this.searchBusServe.broadcast('clicked xxx');
  }

  ngOnDestroy(): void {
    // this.evtSub.unsubscribe();
  }
}
