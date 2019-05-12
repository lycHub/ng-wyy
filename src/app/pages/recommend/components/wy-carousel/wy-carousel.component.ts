import {Component, EventEmitter, Input, Output, TemplateRef, ViewChild} from '@angular/core';

@Component({
  selector: 'wy-carousel',
  templateUrl: './wy-carousel.component.html',
  styleUrls: ['./wy-carousel.component.less']
})
export class WyCarouselComponent {
  @ViewChild('dot') dotRef: TemplateRef<any>;
  @Input() activeIndex: number;
  @Input() bgColor: string;
  @Output() changeSlide = new EventEmitter<string>();
  onChangeSlide(type: string) {
    this.changeSlide.emit(type);
  }
}
