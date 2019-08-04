import { Component, EventEmitter, OnInit, Input, Output, OnChanges, SimpleChanges, ElementRef, ViewContainerRef, Inject, ViewChild, TemplateRef, Type, ComponentFactoryResolver, ComponentRef, Injector, Renderer2 } from '@angular/core';
import { InputBoolean } from 'ng-zorro-antd/core';
import { OverlayRef, Overlay, OverlayKeyboardDispatcher, BlockScrollStrategy, OverlayConfig } from '@angular/cdk/overlay';
import { DOCUMENT } from '@angular/common';
import { ESCAPE } from '@angular/cdk/keycodes';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NzModalRef } from 'ng-zorro-antd';
import { WINDOW } from '../../../../core/inject-tokens';
import { trigger, transition, animate, style, state } from '@angular/animations';
import { CdkDragMove, CdkDrag, CdkDragStart } from '@angular/cdk/drag-drop';

type DomSize = { w: number; h: number };

@Component({
  selector: 'app-wy-layer-modal',
  templateUrl: './wy-layer-modal.component.html',
  styleUrls: ['./wy-layer-modal.component.less'],
  animations: [trigger('showHide', [
    state('show', style({ transform: 'scale(1)', opacity: 1 })),
    state('hide', style({ transform: 'scale(0)', opacity: 0 })),
    transition('show<=>hide', [animate('0.1s')])
  ])]
})
export class WyLayerModalComponent<T = any> implements OnInit, OnChanges {
  @Input() @InputBoolean() isVisib = false;
  @Input() nzGetContainer: HTMLElement | OverlayRef; // [STATIC]
  @Input() nzContent: string | TemplateRef<{}> | Type<T>;
  @Output() readonly onAfterOpen = new EventEmitter<void>(); // Trigger when modal open(visible) after animations
  @Output() readonly onAfterClose = new EventEmitter(); // Trigger when modal leave-animation over
  @Output() readonly onVisibleChange = new EventEmitter<boolean>();
  maskAnimationClassMap: object | null;
  modalAnimationClassMap: object | null;

  showModal: 'show' | 'hide';
  private overlayRef: OverlayRef;
  private scrollStrategy: BlockScrollStrategy;
  private unsubscribe$ = new Subject<void>();
  private contentComponentRef: ComponentRef<T>; 
  private resizeHandler: () => void;
  private modalSize: DomSize;
  disableDrag = false;
  @ViewChild('modalContainer', { static: true }) modalContainer: ElementRef;
  @ViewChild('bodyContainer', { static: false, read: ViewContainerRef }) bodyContainer: ViewContainerRef;
  constructor(
    private overlay: Overlay,
    private overlayKeyboardDispatcher: OverlayKeyboardDispatcher,
    private elementRef: ElementRef,
    private viewContainer: ViewContainerRef,
    private cfr: ComponentFactoryResolver,
    private rd: Renderer2,
    @Inject(DOCUMENT) private doc: Document,
    @Inject(WINDOW) private win: Window
  ) {
    this.overlayRef = this.overlay.create();
    this.scrollStrategy = this.overlay.scrollStrategies.block();
  }

  ngOnInit() {
    if (this.isComponent(this.nzContent)) {
      this.createDynamicComponent(this.nzContent as Type<T>); // Create component along without View
    }

    this.overlayRef.overlayElement.appendChild(this.elementRef.nativeElement);
    this.overlayRef
    .keydownEvents()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(e => this.keydownListener(e));
  }


  ngAfterViewInit(): void {
    if (this.contentComponentRef) {
      this.bodyContainer.insert(this.contentComponentRef.hostView);
    }
    
    const modal = this.modalContainer.nativeElement;
    this.modalSize = this.getHideDomSize(modal);
    this.keepCenter(modal, this.modalSize);
    this.resizeHandler = this.rd.listen('window', 'resize', () => {
      this.keepCenter(modal, this.modalSize);
    });
  }


  private keepCenter(modal: HTMLElement, size: DomSize) {
    const left = (this.getWindowSize().w - size.w) / 2;
    const top = (this.getWindowSize().h - size.h) / 2;
    modal.style.left = left + 'px';
    modal.style.top = top + 'px';
  }

  private createDynamicComponent(component: Type<T>): void {
    const factory = this.cfr.resolveComponentFactory(component);
    this.contentComponentRef = factory.create(Injector.create({
      providers: [{ provide: NzModalRef, useValue: this }],
      parent: this.viewContainer.parentInjector
    }));
    // Do the first change detection immediately (or we do detection at ngAfterViewInit, multi-changes error will be thrown)
    this.contentComponentRef.changeDetectorRef.detectChanges();
  }

 /*  private setOverlayRef(overlayRef: OverlayRef): void {
    this.overlayRef = overlayRef;
  } */


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isVisib']) {
      this.handleVisibleStateChange(changes['isVisib'].currentValue);
    }
  }

  private handleVisibleStateChange(visible: boolean) {
    if (visible) {
      this.showModal = 'show';
      // Hide scrollbar at the first time when shown up
      this.scrollStrategy.enable();
      this.overlayKeyboardDispatcher.add(this.overlayRef);
      this.onAfterOpen.emit();
    } else {
      this.showModal = 'hide';
      this.overlayKeyboardDispatcher.remove(this.overlayRef);
      this.onAfterClose.emit();
      this.scrollStrategy.disable();
    }
  }

  
  private keydownListener(event: KeyboardEvent): void {
    if (event.keyCode === ESCAPE) {
      this.hide();
    }
  }

  private hide() {
    this.onVisibleChange.emit(false);
  }


  private getWindowSize(): DomSize {
    return {
      w: this.win.innerWidth || this.doc.documentElement.clientWidth || this.doc.body.offsetWidth,
      h: this.win.innerHeight || this.doc.documentElement.clientHeight || this.doc.body.offsetHeight
    }
  }


  private getHideDomSize(dom: HTMLElement): DomSize {
    dom.style.visibility = 'hidden';
    dom.style.transform = 'scale(1)';
    const size = {
      w: dom.offsetWidth,
      h: dom.offsetHeight,
    }
    dom.style.visibility = 'visible';
    dom.style.transform = 'scale(0)';
    return size;
  }

  isNonEmptyString(value: {}): boolean {
    return typeof value === 'string' && value !== '';
  }

  isTemplateRef(value: {}): boolean {
    return value instanceof TemplateRef;
  }

  isComponent(value: {}): boolean {
    return value instanceof Type;
  }

  
  ngOnDestroy(): void {
    this.overlayRef.dispose();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    if (this.resizeHandler) {
      this.resizeHandler();
    }
  }
}
