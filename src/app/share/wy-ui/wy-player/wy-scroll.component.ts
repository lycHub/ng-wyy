import {
  AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import BScroll from '@better-scroll/core';
import MouseWheel from '@better-scroll/mouse-wheel';
import ScrollBar from '@better-scroll/scroll-bar';
BScroll.use(MouseWheel);
BScroll.use(ScrollBar);
@Component({
  selector: 'app-wy-scroll',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: '<div #wrap class="wy-scroll"><ng-content></ng-content></div>',
  styles: [`.wy-scroll{ width:100%; height: 100%; overflow: hidden; }`]
})
export class WyScrollComponent implements AfterViewInit, OnChanges {
  @Input() private readonly data: any[];
  @Input() private readonly refreshDelay = 50;
  @Input() private readonly clickable = true;
  @Input() private readonly scrollbar: object | boolean = {
    fade: false,
    interactive: true
  };
  
  private bs: BScroll;
  @ViewChild('wrap', { static: true }) private wrapRef: ElementRef;
  
  @Output() private onScrollEnd = new EventEmitter<number>();
  constructor(readonly el: ElementRef) {}
  ngAfterViewInit(): void {
    const wrap = this.wrapRef.nativeElement;
    this.bs = new BScroll(wrap, {
      click: this.clickable,
      scrollbar: this.scrollbar,
      mouseWheel: {}
    });
    
    this.bs.on('scrollEnd', ({ y }) => this.onScrollEnd.emit(y));
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) this.refreshScroll();
  }
  
  refresh() {
    this.bs.scroller.refresh();
  }
  
  scrollTo(...args) {
    this.bs.scroller.scrollTo.apply(this.bs.scroller, args);
  }
  
  scrollToElement(...args) {
    this.bs.scroller.scrollToElement.apply(this.bs.scroller, args);
  }
  
  // 刷新
  private refreshScroll(): void {
    setTimeout(() => {
      this.refresh();
    }, this.refreshDelay);
  }
}
