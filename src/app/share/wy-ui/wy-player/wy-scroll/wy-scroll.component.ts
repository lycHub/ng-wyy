import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, ViewChild, ElementRef, AfterViewInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import BScroll from '@better-scroll/core';
import ScrollBar from '@better-scroll/scroll-bar';
import MouseWheel from '@better-scroll/mouse-wheel';
BScroll.use(MouseWheel);
BScroll.use(ScrollBar);

@Component({
  selector: 'app-wy-scroll',
  template: `
    <div class="wy-scroll" #wrap>
      <ng-content></ng-content>
    </div>
  `,
  styles: [`.wy-scroll{width: 100%; height: 100%; overflow: hidden;}`],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WyScrollComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() data: any[];
  @Input() refreshDelay = 50;
  private bs: BScroll;

  @ViewChild('wrap', { static: true }) private wrapRef: ElementRef;
  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
   this.bs = new BScroll(this.wrapRef.nativeElement, {
      scrollbar: {
        interactive: true
      },
      mouseWheel: {}
   });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.refreshScroll();
    }
  }

  private refresh() {
    console.log('refresh');
    this.bs.refresh();
  }

  refreshScroll() {
    setTimeout(() => {
      this.refresh();
    }, this.refreshDelay);
  }
}
