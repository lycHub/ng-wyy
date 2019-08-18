import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output, TemplateRef, ViewChild} from '@angular/core';

@Component({
  selector: 'wy-carousel',
  templateUrl: './wy-carousel.component.html',
  styleUrls: ['./wy-carousel.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WyCarouselComponent {
  @ViewChild('dot', { static: true }) dotRef: TemplateRef<any>;
  @Input() activeIndex: number;
  @Output() changeSlide = new EventEmitter<string>();
  onChangeSlide(type: string) {
    this.changeSlide.emit(type);
  }
}
