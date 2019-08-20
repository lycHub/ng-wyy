import { Component, OnInit, ViewEncapsulation, Input, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { wySliderTrackStyle } from './wy-slider-definitions';

@Component({
  selector: 'app-wy-slider-handle',
  template: `<div class="wy-slider-handle" [ngStyle]="style"></div>`,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WySliderHandleComponent implements OnInit {
  @Input() wyOffset: number;
  @Input() wyVertical: string;

  style: wySliderTrackStyle = {};
  constructor() { }

  ngOnInit() {
  }

  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['wyOffset']) {
      this.style[this.wyVertical ? 'bottom' : 'left'] = `${this.wyOffset}%`;
    }
  }

}
