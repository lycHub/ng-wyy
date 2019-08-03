import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { InputBoolean } from 'ng-zorro-antd/core';

@Component({
  selector: 'app-wy-layer-modal',
  templateUrl: './wy-layer-modal.component.html',
  styleUrls: ['./wy-layer-modal.component.less']
})
export class WyLayerModalComponent implements OnInit, OnChanges {
  
  @Input() @InputBoolean() isVisib = false;
  constructor() { }

  ngOnInit() {
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isVisib'] && changes['isVisib'].currentValue) {
      this.showModal();
    }
  }

  private showModal() {
    
  }
}
