import { Component, OnInit, Input, TemplateRef, ViewChild, ElementRef, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { fromEvent } from 'rxjs';
import { pluck, debounceTime, distinctUntilChanged } from 'rxjs/internal/operators';

@Component({
  selector: 'app-wy-search',
  templateUrl: './wy-search.component.html',
  styleUrls: ['./wy-search.component.less']
})
export class WySearchComponent implements OnInit, AfterViewInit {
  @Input() customView: TemplateRef<any>;
  @Output() onSearch = new EventEmitter<string>();
  @ViewChild('nzInput', { static: false }) private nzInput: ElementRef;
  constructor() {}

  ngOnInit() {
  }

  ngAfterViewInit() {
    console.log(' nzInput:', this.nzInput.nativeElement);
    fromEvent(this.nzInput.nativeElement,'input')
    .pipe(debounceTime(300), distinctUntilChanged(), pluck('target', 'value'))
    .subscribe((value: string) => {
      this.onSearch.emit(value);
    });
  }

}
