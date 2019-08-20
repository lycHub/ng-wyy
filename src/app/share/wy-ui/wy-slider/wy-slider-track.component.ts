import { Component, OnInit, ViewEncapsulation, Input, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { wySliderTrackStyle } from './wy-slider-definitions';

@Component({
  selector: 'app-wy-slider-track',
  template: `<div class="wy-slider-track" [class.buffer]="wyBuffer" [ngStyle]="style"></div>`,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WySliderTrackComponent implements OnInit {
  @Input() wyBuffer = false;
  @Input() wyLength: number;
  @Input() wyVertical = false;

  style: wySliderTrackStyle = {};
  constructor() { }

  ngOnInit() {
  }

  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.wyVertical || changes.wyLength) {
      if (this.wyVertical) {
        this.style.height = `${this.wyLength}%`;
        this.style.left = null;
        this.style.width = null;
      } else {
        this.style.width = `${this.wyLength}%`;
        this.style.bottom = null;
        this.style.height = null;
      }
    }
  }

}
