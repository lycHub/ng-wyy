import { Component, OnInit, Input, OnChanges, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-wy-search-panel',
  templateUrl: './wy-search-panel.component.html',
  styleUrls: ['./wy-search-panel.component.less']
})
export class WySearchPanelComponent implements OnInit, OnChanges, OnDestroy {
 
  
  @Input() test = 'defTest';

  // evtSub = new Subject();
  @Output('out') out = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
    
  }
  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    console.log('test change :', changes['test']);
  }

  outEvent() {
    console.log('in click:');
    this.out.emit('outValue');
  }

  ngOnDestroy(): void {
    // this.evtSub.unsubscribe();
  }
}
