import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-wy-search-panel',
  templateUrl: './wy-search-panel.component.html',
  styleUrls: ['./wy-search-panel.component.less']
})
export class WySearchPanelComponent implements OnInit, OnDestroy {
 
  @Input() list = [];

  @Output() onSelected = new EventEmitter<any>();
  constructor() {
    
  }

  ngOnInit() {
   
  }




  onClick() {
    this.onSelected.emit('clicked aaa');
  }

  ngOnDestroy(): void {
    // this.evtSub.unsubscribe();
  }
}
