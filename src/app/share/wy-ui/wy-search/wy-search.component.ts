import { Component, OnInit, Input, TemplateRef, ViewContainerRef, ViewChild, ElementRef, AfterViewInit, OnDestroy, ComponentRef } from '@angular/core';
import { OverlayConfig, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { WySearchPanelComponent } from './wy-search-panel/wy-search-panel.component';


@Component({
  selector: 'app-wy-search',
  templateUrl: './wy-search.component.html',
  styleUrls: ['./wy-search.component.less']
})
export class WySearchComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() handlerView: TemplateRef<any>;
  @Input() connectedTo: ElementRef;

  private overlayRef: OverlayRef;

  private panelRef: ComponentRef<WySearchPanelComponent>;
  private panelPortal: ComponentPortal<WySearchPanelComponent>;

  @ViewChild('search', { static: false }) private defaultRef: ElementRef;


  constructor(private overlay: Overlay, private viewContainerRef: ViewContainerRef) { }

  ngOnInit() {
    
    
  }



  ngAfterViewInit(): void {
    
  }

  onKeyUp() {
    console.log('onKeyUp');
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
    config.scrollStrategy = this.overlay.scrollStrategies.reposition(); // 更随滑动的策略
    this.overlayRef = this.overlay.create(config);
    this.panelPortal = new ComponentPortal(WySearchPanelComponent, this.viewContainerRef);
    this.panelRef = this.overlayRef.attach(this.panelPortal);
    this.panelRef.instance.list = [1, 2, 3];
    this.panelRef.instance.onSelected.subscribe(selected => {
      console.log('selected :', selected);
    });
  }
  onBlur() {
    console.log('onBlur');
    // this.dismissOverlayPanel();
  }


  showOverlayPanel() {
   

    
   
    
  }

  dismissOverlayPanel() {
    if (this.overlayRef && this.overlayRef.hasAttached()) {
      this.overlayRef.dispose();
    }
  }


  ngOnDestroy(): void {
    this.dismissOverlayPanel();
  }
}
