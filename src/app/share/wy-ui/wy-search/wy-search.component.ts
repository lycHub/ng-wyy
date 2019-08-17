import { Component, OnInit, Input, TemplateRef, ViewContainerRef, ViewChild, ElementRef, AfterViewInit, OnDestroy, ComponentRef, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { OverlayConfig, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { WySearchPanelComponent } from './wy-search-panel/wy-search-panel.component';
import { Subscription, fromEvent } from 'rxjs/index';
import { pluck, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { SearchResult } from '../../../service/search.service';
import { isEmptyObj } from '../../../utils/tools';


@Component({
  selector: 'app-wy-search',
  templateUrl: './wy-search.component.html',
  styleUrls: ['./wy-search.component.less']
})
export class WySearchComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  @Input() handlerView: TemplateRef<any>;
  @Input() connectedTo: ElementRef;
  @Input() searchResult: SearchResult;

  @Output() onSearch = new EventEmitter<string>();

  private overlayRef: OverlayRef;
  private panelRef: ComponentRef<WySearchPanelComponent>;
  private panelPortal: ComponentPortal<WySearchPanelComponent>;
  private search$: Subscription;

  private keywords: string;

  @ViewChild('search', { static: false }) private defaultRef: ElementRef;
  @ViewChild('nzInput', { static: false }) private nzInput: ElementRef;


  constructor(
    private overlay: Overlay,
    private viewContainerRef: ViewContainerRef
    ) { }

  ngOnInit() {
    
    
  }



  ngAfterViewInit(): void {
    this.search$ = fromEvent(this.nzInput.nativeElement, 'input')
    .pipe(debounceTime(300), distinctUntilChanged(), pluck('target', 'value'))
    .subscribe((value: string) => {
      this.keywords = value;
      if (value) {
        this.onSearch.emit(value);
      }else {
        this.dismissOverlayPanel();
      }
    });
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['searchResult'] && !changes['searchResult'].firstChange) {
      if (!isEmptyObj(this.searchResult)) {
        this.showOverlayPanel();
      }else {
        this.dismissOverlayPanel();
      }
    }
  }

  onFocus() {
    if (this.searchResult && !isEmptyObj(this.searchResult)) {
      this.showOverlayPanel();
    }
  }

  


  onBlur() {
    this.dismissOverlayPanel();
  }


  showOverlayPanel() {
    if (this.overlayRef && this.overlayRef.hasAttached()) {
      this.dismissOverlayPanel();
    }
    
    const strategy = this.overlay.position()
    .flexibleConnectedTo(this.connectedTo || this.defaultRef)
    .withPositions([{
        originX: 'start',
        originY: 'bottom',
        overlayX: 'start',
        overlayY: 'top',
        offsetX: 0,
        offsetY: 0
    }]);
    // strategy.withLockedPosition(true);  // 锁定位置
    const config = new OverlayConfig({positionStrategy: strategy});
    config.scrollStrategy = this.overlay.scrollStrategies.reposition();   // 更随滑动的策略
    this.overlayRef = this.overlay.create(config);
    this.panelPortal = new ComponentPortal(WySearchPanelComponent, this.viewContainerRef);
    this.panelRef = this.overlayRef.attach(this.panelPortal);
    console.log('searchResult :', this.searchResult);
    this.panelRef.instance.searchResult = this.searchResult;
  }

  dismissOverlayPanel() {
    if (this.overlayRef && this.overlayRef.hasAttached()) {
      this.overlayRef.dispose();
    }
  }


  ngOnDestroy(): void {
    this.dismissOverlayPanel();
    this.search$ && this.search$.unsubscribe();
  }
}