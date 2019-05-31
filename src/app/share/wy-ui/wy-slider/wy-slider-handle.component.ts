import { Component, OnInit, ViewEncapsulation, Input, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { NzSliderTrackStyle } from './wy-slider-definitions';

@Component({
  selector: 'app-wy-slider-handle',
  template: `<div class="wy-slider-handle" [ngStyle]="style"></div>`,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WySliderHandleComponent implements OnInit {
  @Input() nzOffset: number;
  @Input() nzVertical: string;

  style: NzSliderTrackStyle = {};
  constructor() { }

  ngOnInit() {
  }

  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['nzOffset']) {
      this.style[this.nzVertical ? 'bottom' : 'left'] = `${this.nzOffset}%`;
    }
  }

}
