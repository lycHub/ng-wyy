import { Component, OnInit, ElementRef, ViewChild, Input, ChangeDetectorRef, PLATFORM_ID, Inject, ChangeDetectionStrategy, SimpleChanges, DoCheck, forwardRef, ViewEncapsulation, Output, EventEmitter, OnDestroy } from '@angular/core';
import { SliderValue } from './wy-slider-definitions';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';
import { MouseTouchObserverConfig, silentEvent, getElementOffset } from '../../../utils/dom';
import { fromEvent, merge, Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, filter, map, pluck, takeUntil, tap } from 'rxjs/operators';
import { ensureNumberInRange, getPercent } from '../../../utils/number';


@Component({
  selector: 'app-wy-slider',
  templateUrl: './wy-slider.component.html',
  styleUrls: ['./wy-slider.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WySliderComponent),
      multi: true
    }
  ],
  encapsulation: ViewEncapsulation.None
})
export class WySliderComponent implements OnInit, ControlValueAccessor, OnDestroy {
  @ViewChild('slider', { static: true }) slider: ElementRef;
  @Input() nzVertical: boolean = false;
  @Input() nzDefaultValue: SliderValue = 0;
  @Input() nzMax = 100;
  @Input() nzMin = 0;
  
  @Input() bufferOffset: SliderValue = 0; // 缓冲条长度百分比

  value: SliderValue = null;
  sliderDOM: HTMLDivElement;
  
  offset: SliderValue = null; // Track和btn的位置

  isDragging = false; // Current dragging state


  private dragStart$: Observable<number>;
  private dragMove$: Observable<number>;
  private dragEnd$: Observable<Event>;
  private dragStart_: Subscription | null;
  private dragMove_: Subscription | null;
  private dragEnd_: Subscription | null;

  @Output() readonly nzOnAfterChange = new EventEmitter<SliderValue>();
  constructor(private cdr: ChangeDetectorRef, @Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit() {
    this.sliderDOM = this.slider.nativeElement;
    if (isPlatformBrowser(this.platformId)) {
      this.createDraggingObservables();
    }

    this.subscribeDrag(['start']);

    if (this.value) {
      this.setValue(this.formatValue(null));
    }
  }




  private createDraggingObservables(): void {
    const sliderDOM = this.sliderDOM;
    const orientField = this.nzVertical ? 'pageY' : 'pageX';
    const mouse: MouseTouchObserverConfig = {
      start: 'mousedown',
      move: 'mousemove',
      end: 'mouseup',
      pluckKey: [orientField]
    };
    const touch: MouseTouchObserverConfig = {
      start: 'touchstart',
      move: 'touchmove',
      end: 'touchend',
      pluckKey: ['touches', '0', orientField],
      filter: (e: MouseEvent | TouchEvent) => e instanceof TouchEvent
    };

    [mouse, touch].forEach(source => {
      const { start, move, end, pluckKey, filter: filterFunc = () => true } = source;
      source.startPlucked$ = fromEvent(sliderDOM, start).pipe(

        /* 
          mouse: () => true
          touch: (e: MouseEvent | TouchEvent) => e instanceof TouchEvent
        */

        filter(filterFunc),
        tap(silentEvent),

        // 转成e.pageX或e.touches[0].pagyX
        pluck<Event, number>(...pluckKey),
        map((position: number) => this.findClosestValue(position))
      );
      source.end$ = fromEvent(document, end);
      source.moveResolved$ = fromEvent(document, move).pipe(
        filter(filterFunc),
        tap(silentEvent),
        pluck<Event, number>(...pluckKey),
        distinctUntilChanged(),
        map((position: number) => this.findClosestValue(position)),
        distinctUntilChanged(),
        takeUntil(source.end$)
      );
    });

    this.dragStart$ = merge(mouse.startPlucked$, touch.startPlucked$);
    this.dragMove$ = merge(mouse.moveResolved$, touch.moveResolved$);
    this.dragEnd$ = merge(mouse.end$, touch.end$);
  }


  private findClosestValue(position: number): number {
    // sliderDOM的左或上断点的位置
    const sliderStart = this.getSliderStartPosition();

    // sliderDOM的尺寸
    const sliderLength = this.getSliderLength();

    // 保证滑动的距离比（(position - sliderStart) / sliderLength）在0~1之间
    const ratio = ensureNumberInRange((position - sliderStart) / sliderLength, 0, 1);

    /* 
      求值val：
      (val - this.nzMin) / (this.nzMax - this.nzMin) = (position - sliderStart) / sliderLength
    */
    return (this.nzMax - this.nzMin) * (this.nzVertical ? 1 - ratio : ratio) + this.nzMin;
  }


  private subscribeDrag(periods: string[] = ['start', 'move', 'end']): void {
    if (periods.indexOf('start') !== -1 && this.dragStart$ && !this.dragStart_) {
      this.dragStart_ = this.dragStart$.subscribe(this.onDragStart.bind(this));
    }

    if (periods.indexOf('move') !== -1 && this.dragMove$ && !this.dragMove_) {
      this.dragMove_ = this.dragMove$.subscribe(this.onDragMove.bind(this));
    }

    if (periods.indexOf('end') !== -1 && this.dragEnd$ && !this.dragEnd_) {
      this.dragEnd_ = this.dragEnd$.subscribe(this.onDragEnd.bind(this));
    }
  }

  



  private onDragStart(value: number): void {
    this.toggleDragMoving(true);
    this.setActiveValue(value);
  }

  private onDragMove(value: number): void {
    if (this.isDragging) {
      this.setActiveValue(value);
      this.cdr.markForCheck();
    }
  }

  private onDragEnd(): void {
    this.nzOnAfterChange.emit(this.value);
    this.toggleDragMoving(false);
    this.cdr.markForCheck();
  }


  private setActiveValue(pointerValue: number): void {
    this.setValue(pointerValue);
  }


  private toggleDragMoving(movable: boolean): void {
    const periods = ['move', 'end'];
    if (movable) {
      this.isDragging = true;
      this.subscribeDrag(periods);
    } else {
      this.isDragging = false;
      this.unsubscribeDrag(periods);
    }
  }


  private unsubscribeDrag(periods: string[] = ['start', 'move', 'end']): void {
    if (periods.indexOf('start') !== -1 && this.dragStart_) {
      this.dragStart_.unsubscribe();
      this.dragStart_ = null;
    }

    if (periods.indexOf('move') !== -1 && this.dragMove_) {
      this.dragMove_.unsubscribe();
      this.dragMove_ = null;
    }

    if (periods.indexOf('end') !== -1 && this.dragEnd_) {
      this.dragEnd_.unsubscribe();
      this.dragEnd_ = null;
    }
  }


  private getSliderStartPosition(): number {
    const offset = getElementOffset(this.sliderDOM);
    return this.nzVertical ? offset.top : offset.left;
  }

  private getSliderLength(): number {
    const sliderDOM = this.sliderDOM;
    return this.nzVertical ? sliderDOM.clientHeight : sliderDOM.clientWidth;
  }


  /* private getValue(cloneAndSort: boolean = false): SliderValue {
    if (cloneAndSort && this.value && isValueARange(this.value)) {
      return shallowCopyArray(this.value).sort((a, b) => a - b);
    }
    return this.value!;
  } */

  private setValue(value: SliderValue, isWriteValue: boolean = false): void {
    if (isWriteValue) {
      if (this.isDragging) return;
      
      // 赋值给this.value
      this.value = this.formatValue(value);
      this.updateTrackAndHandles();
    } else if (!this.valuesEqual(this.value, value)) {
      this.value = value;
      this.updateTrackAndHandles();
      this.onValueChange(this.value);
    }
  }


  private valuesEqual(valA: SliderValue, valB: SliderValue): boolean {
    if (typeof valA !== typeof valB) {
      return false;
    }
    return valA === valB;
  }


  /**
   * 跟新滑块和track的dom
   */
  private updateTrackAndHandles(): void {
    const value = this.value;
    
    // value转成百分比
    this.offset = this.getValueToOffset(value);
    this.cdr.markForCheck();
  }


   /**
   * Clone & sort current value and convert them to offsets, then return the new one.
   */
  private getValueToOffset(value?: SliderValue): SliderValue {
    let normalizedValue = value;

    if (typeof normalizedValue === 'undefined') {
      normalizedValue = this.value;
    }

    return getPercent(this.nzMin, this.nzMax, normalizedValue);
  }



  private formatValue(value: SliderValue): SliderValue {
    let res = value;
    if (!this.assertValueValid(value)) { // 如果value是NAN
      res = this.nzDefaultValue || this.nzMin;
    } else {
      res = ensureNumberInRange(value, this.nzMin, this.nzMax);
    }
    return res;
  }

  private assertValueValid(value: SliderValue): boolean {
    return !isNaN(typeof value !== 'number' ? parseFloat(value) : value);
  }


  ngOnDestroy(): void {
    this.unsubscribeDrag();
  }



  writeValue(val: SliderValue | null): void {
    this.setValue(val, true);
  }

  onValueChange(_value: SliderValue): void {};

  onTouched(): void {};

  registerOnChange(fn: (value: SliderValue) => void): void {
    this.onValueChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}
