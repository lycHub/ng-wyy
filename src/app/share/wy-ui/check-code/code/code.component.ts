import { Component, ElementRef, AfterViewInit, ViewChild, OnDestroy, ChangeDetectionStrategy, forwardRef, Output, EventEmitter } from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BACKSPACE } from '@angular/cdk/keycodes';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'app-code',
  template: `<div class="code-wrap clearfix" #codeWrap>
    <div class="u-word" *ngFor="let item of inputArr; index as i" [class.focus]="result[i]">
      <input class="item" maxlength="1" />
    </div>
  </div>`,
  styleUrls: ['./code.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CodeComponent),
      multi: true
    }
  ]
})
export class CodeComponent implements AfterViewInit, ControlValueAccessor, OnDestroy {
  inputArr = ['', '', '', ''];
  inputs: HTMLElement[];
  result: string[] = [];
  private code: string;
  currentFocusIndex = 0;
  private destroy$ = new Subject<void>();

  @Output() onInput = new EventEmitter<string>();
  @ViewChild('codeWrap', { static: true }) private codeWrap: ElementRef;
  constructor() {}

  ngAfterViewInit() {
    this.inputs = this.codeWrap.nativeElement.getElementsByClassName('item') as HTMLElement[];
    this.inputs[0].focus();
    for (let a = 0; a < this.inputs.length; a++) {
      const item = this.inputs[a];
      fromEvent(item, 'keyup').pipe(takeUntil(this.destroy$)).subscribe((event: KeyboardEvent) => this.listenKeyUp(event));
      fromEvent(item, 'click').pipe(takeUntil(this.destroy$)).subscribe(() => this.listenClick(a));
    }
  }

  private listenKeyUp(event: KeyboardEvent) {
    const target = <HTMLInputElement>event.target;
    const value = target.value;
    const isBackSpace = event.keyCode === BACKSPACE;
    this.onInput.emit(value);
    if (/\D/.test(value)) {
      target.value = '';
      this.result[this.currentFocusIndex] = '';
    } else if (value) {
      // this.currentFocusIndex = Math.min(this.currentFocusIndex + 1, 3);
      this.result[this.currentFocusIndex] = value;
      this.currentFocusIndex = (this.currentFocusIndex + 1) % this.inputArr.length;
      this.inputs[this.currentFocusIndex].focus();
      
    }else if (isBackSpace) {
      this.result[this.currentFocusIndex] = '';
      this.currentFocusIndex = Math.max(this.currentFocusIndex - 1, 0);
      this.inputs[this.currentFocusIndex].focus();
    }
    this.checkResult(this.result);
  }

  private listenClick(index: number) {
    this.currentFocusIndex = index;
  }

  private checkResult(result: string[]) {
    const codeStr = result.join('');
    this.setValue(codeStr);
  }

  private setValue(code: string) {
    this.code = code;
    this.onValueChange(this.code);
  }


  writeValue(value: string): void {
    this.setValue(value);
  }

  onValueChange(_value: string): void {};

  onTouched(): void {};
  registerOnChange(fn: (value: string) => void): void {
    this.onValueChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
