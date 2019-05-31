import { Component, OnInit, ViewEncapsulation, Input, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { NzSliderTrackStyle } from './wy-slider-definitions';

@Component({
  selector: 'app-wy-slider-track',
  template: `<div class="wy-slider-track" [ngStyle]="style"></div>`,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WySliderTrackComponent implements OnInit {
  @Input() nzOffset: number;
  @Input() nzLength: number;
  @Input() nzVertical = false;

  style: NzSliderTrackStyle = {};
  constructor() { }

  ngOnInit() {
  }

  
  ngOnChanges(changes: SimpleChanges): void {
    // console.log('changes track :', changes);
    if (changes.nzVertical || changes.nzLength) {
      if (this.nzVertical) {
        this.style.height = `${this.nzLength}%`;
        this.style.left = null;
        this.style.width = null;
      } else {
        this.style.width = `${this.nzLength}%`;
        this.style.bottom = null;
        this.style.height = null;
      }
    }
  }

}
