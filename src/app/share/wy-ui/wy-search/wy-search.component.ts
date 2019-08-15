import { Component, OnInit, Input, TemplateRef, ViewContainerRef, ViewChild, ElementRef, AfterViewInit, OnDestroy, ComponentRef, Output, EventEmitter } from '@angular/core';
import { OverlayConfig, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { WySearchPanelComponent } from './wy-search-panel/wy-search-panel.component';
import { Subscription, fromEvent } from 'rxjs/index';
import { pluck, debounceTime, distinctUntilChanged } from 'rxjs/operators';


@Component({
  selector: 'app-wy-search',
  templateUrl: './wy-search.component.html',
  styleUrls: ['./wy-search.component.less']
})
export class WySearchComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() handlerView: TemplateRef<any>;
  @Input() connectedTo: ElementRef;

  @Output() onSearch = new EventEmitter<string>();

  private overlayRef: OverlayRef;
  private panelRef: ComponentRef<WySearchPanelComponent>;
  private panelPortal: ComponentPortal<WySearchPanelComponent>;

  private search$: Subscription;
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
      if (value) {
        this.onSearch.emit(value);
      }
    });
  }

  onKeyUp(evt) {
    const val = evt.target.value;
    /* if (evt.target.value) {
      this.onSearch.emit(val);
    } */
    // this.searchServe.search()
    // this.showOverlayPanel();
  }
  onBlur() {
    console.log('onBlur');
    // this.dismissOverlayPanel();
  }


  showOverlayPanel() {
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
    this.panelRef.instance.list = [1, 2, 3];
    this.panelRef.instance.onSelected.subscribe(selected => {
      console.log('selected :', selected);
    });
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
