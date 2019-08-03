import { Component, EventEmitter, OnInit, Input, Output, OnChanges, SimpleChanges, ElementRef, ViewContainerRef, Inject, ViewChild, TemplateRef, Type, ComponentFactoryResolver, ComponentRef, Injector, Renderer2 } from '@angular/core';
import { InputBoolean } from 'ng-zorro-antd/core';
import { OverlayRef, Overlay, OverlayKeyboardDispatcher, BlockScrollStrategy, OverlayConfig } from '@angular/cdk/overlay';
import { DOCUMENT } from '@angular/common';
import { FocusTrap, FocusTrapFactory } from '@angular/cdk/a11y';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NzModalRef } from 'ng-zorro-antd';
import { WINDOW } from '../../../../core/inject-tokens';

type AnimationState = 'enter' | 'leave' | null;
type DomSize = { w: number; h: number };
@Component({
  selector: 'app-wy-layer-modal',
  templateUrl: './wy-layer-modal.component.html',
  styleUrls: ['./wy-layer-modal.component.less']
})
export class WyLayerModalComponent<T = any, R = any> implements OnInit, OnChanges {
  @Input() @InputBoolean() isVisib = false;
  @Input() nzGetContainer: HTMLElement | OverlayRef; // [STATIC]
  @Input() nzContent: string | TemplateRef<{}> | Type<T>;
  @Output() readonly nzAfterOpen = new EventEmitter<void>(); // Trigger when modal open(visible) after animations
  @Output() readonly nzAfterClose = new EventEmitter(); // Trigger when modal leave-animation over
  @Output() readonly nzVisibleChange = new EventEmitter<boolean>();
  maskAnimationClassMap: object | null;
  modalAnimationClassMap: object | null;

  hidden = !this.isVisib;

  private container: HTMLElement | OverlayRef;
  private overlayRef: OverlayRef;
  private scrollStrategy: BlockScrollStrategy;
  private previouslyFocusedElement: HTMLElement;
  private focusTrap: FocusTrap;
  private unsubscribe$ = new Subject<void>();
  private animationState: AnimationState; // Current animation state
  private contentComponentRef: ComponentRef<T>; 
  private resizeHandler: () => void;
  @ViewChild('modalContainer', { static: true }) modalContainer: ElementRef;
  @ViewChild('bodyContainer', { static: false, read: ViewContainerRef }) bodyContainer: ViewContainerRef;
  constructor(
    private overlay: Overlay,
    private overlayKeyboardDispatcher: OverlayKeyboardDispatcher,
    private elementRef: ElementRef,
    private viewContainer: ViewContainerRef,
    private focusTrapFactory: FocusTrapFactory,
    private cfr: ComponentFactoryResolver,
    private rd: Renderer2,
    @Inject(DOCUMENT) private doc: Document,
    @Inject(WINDOW) private win: Window
  ) {
    this.nzGetContainer = this.overlay.create();
    this.scrollStrategy = this.overlay.scrollStrategies.block();
  }

  ngOnInit() {
    if (this.isComponent(this.nzContent)) {
      this.createDynamicComponent(this.nzContent as Type<T>); // Create component along without View
    }

    this.container = this.nzGetContainer;
    if (this.container instanceof OverlayRef) {
      this.setOverlayRef(this.container);
      this.container.overlayElement.appendChild(this.elementRef.nativeElement);
      // this.container.attach(new ComponentPortal(this.elementRef.nativeElement, this.viewContainer));
    }

    if (this.overlayRef) {
      this.overlayRef
        .keydownEvents()
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(e => this.keydownListener(e));
    }
    
  }


  ngAfterViewInit(): void {
    // If using Component, it is the time to attach View while bodyContainer is ready
    if (this.contentComponentRef) {
      this.bodyContainer.insert(this.contentComponentRef.hostView);
    }

    const modal = this.modalContainer.nativeElement;
    const modalSize = this.getHideDomSize(modal);
    this.keepCenter(modal, modalSize);
    this.resizeHandler = this.rd.listen('window', 'resize', () => {
      this.keepCenter(modal, modalSize);
    });

    
    
    /* if (this.autoFocusButtonOk) {
      (this.autoFocusButtonOk.nativeElement as HTMLButtonElement).focus();
    } */
  }


  private keepCenter(modal: HTMLElement, size: DomSize) {
    const left = (this.getWindowSize().w - size.w) / 2;
    const top = (this.getWindowSize().h - size.h) / 2;
    modal.style.left = left + 'px';
    modal.style.top = top + 'px';
  }

  private createDynamicComponent(component: Type<T>): void {
    console.log('component :', component);
    const factory = this.cfr.resolveComponentFactory(component);
    this.contentComponentRef = factory.create(Injector.create({
      providers: [{ provide: NzModalRef, useValue: this }],
      parent: this.viewContainer.parentInjector
    }));
    // Do the first change detection immediately (or we do detection at ngAfterViewInit, multi-changes error will be thrown)
    this.contentComponentRef.changeDetectorRef.detectChanges();
  }

  private setOverlayRef(overlayRef: OverlayRef): void {
    this.overlayRef = overlayRef;
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isVisib']) {
      this.handleVisibleStateChange(changes['isVisib'].currentValue, !changes.isVisib.firstChange);
    }
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

  private handleVisibleStateChange(visible: boolean, animation: boolean = true, closeResult?: R): Promise<void> {
    if (visible) {
      this.hidden = false;


      // Hide scrollbar at the first time when shown up
      this.scrollStrategy.enable();
      // this.savePreviouslyFocusedElement();
      this.trapFocus();
      if (this.container instanceof OverlayRef) {
        this.overlayKeyboardDispatcher.add(this.overlayRef);
      }
      
    } else {
      if (this.container instanceof OverlayRef) {
        this.overlayKeyboardDispatcher.remove(this.overlayRef);
      }
    }
    

    // animation ? this.animateTo(visible) : undefined
    return Promise.resolve(animation ? this.animateTo(visible) : undefined).then(() => {
      // Emit open/close event after animations over
      if (visible) {
        this.nzAfterOpen.emit();
      } else {
        this.nzAfterClose.emit(closeResult);
        this.restoreFocus();
        this.scrollStrategy.disable();
        this.hidden = true;
      }
    });
  }


  private animateTo(isVisible: boolean): Promise<void> {
    if (isVisible) {
      // Figure out the lastest click position when shows up
      // setTimeout(() => this.updateTransformOrigin()); // [NOTE] Using timeout due to the document.click event is fired later than visible change, so if not postponed to next event-loop, we can't get the lastest click position
    }

    this.changeAnimationState(isVisible ? 'enter' : 'leave');
    return new Promise(resolve =>
      setTimeout(() => {
          // Return when animation is over
          this.changeAnimationState(null);
          resolve();
        }, 200)
    );
  }


  private changeAnimationState(state: AnimationState): void {
    this.animationState = state;
    if (state) {
      this.maskAnimationClassMap = {
        [`fade-${state}`]: true,
        [`fade-${state}-active`]: true
      };
      this.modalAnimationClassMap = {
        [`zoom-${state}`]: true,
        [`zoom-${state}-active`]: true
      };
    } else {
      this.maskAnimationClassMap = this.modalAnimationClassMap = null;
    }
  }


   // Update transform-origin to the last click position on document
  /*  private updateTransformOrigin(): void {
    const modalElement = this.modalContainer.nativeElement as HTMLElement;
    if (this.previouslyFocusedElement) {
      const previouslyDOMRect = this.previouslyFocusedElement.getBoundingClientRect();
      const lastPosition = getElementOffset(this.previouslyFocusedElement);
      const x = lastPosition.left + previouslyDOMRect.width / 2;
      const y = lastPosition.top + previouslyDOMRect.height / 2;
      this.transformOrigin = `${x - modalElement.offsetLeft}px ${y - modalElement.offsetTop}px 0px`;
    }
  } */



 /*  private savePreviouslyFocusedElement(): void {
    if (this.document) {
      this.previouslyFocusedElement = this.document.activeElement as HTMLElement;
    }
  } */


  private trapFocus(): void {
    if (!this.focusTrap) {
      this.focusTrap = this.focusTrapFactory.create(this.elementRef.nativeElement);
    }
    this.focusTrap.focusInitialElementWhenReady();
  }

  private restoreFocus(): void {
    // We need the extra check, because IE can set the `activeElement` to null in some cases.
    if (this.previouslyFocusedElement && typeof this.previouslyFocusedElement.focus === 'function') {
      this.previouslyFocusedElement.focus();
    }
    if (this.focusTrap) {
      this.focusTrap.destroy();
    }
  }

  
  keydownListener(event: KeyboardEvent): void {
    console.log('keyCode :', event.keyCode);
    /* if (event.keyCode === ESCAPE && this.nzKeyboard) {
      this.onClickOkCancel('cancel');
    } */
  }

  
  // Change nzVisible from inside
  private changeVisibleFromInside(visible: boolean, closeResult?: R): Promise<void> {
    if (this.isVisib !== visible) {
      // Change nzVisible value immediately
      this.isVisib = visible;
      this.nzVisibleChange.emit(visible);
      return this.handleVisibleStateChange(visible, true, closeResult);
    }
    return Promise.resolve();
  }

  private getWindowSize(): DomSize {
    return {
      w: this.win.innerWidth || this.doc.documentElement.clientWidth || this.doc.body.offsetWidth,
      h: this.win.innerHeight || this.doc.documentElement.clientHeight || this.doc.body.offsetHeight
    }
  }


  private getHideDomSize(dom: HTMLElement) {
    dom.style.visibility = 'hidden';
    this.rd.removeClass(dom, 'hide');
    const size = {
      w: dom.offsetWidth,
      h: dom.offsetHeight,
    }
    dom.style.visibility = 'visible';
    this.rd.addClass(dom, 'hide');
    return size;
  }

  
  ngOnDestroy(): void {
    // Close self before destructing
    this.changeVisibleFromInside(false).then(() => {
      // this.modalControl.deregisterModal(this);

      if (this.container instanceof OverlayRef) {
        this.container.dispose();
      }

      this.unsubscribe$.next();
      this.unsubscribe$.complete();

      if (this.resizeHandler) {
        this.resizeHandler();
      }
    });
  }


  /* public onClickOkCancel(type: 'ok' | 'cancel'): void {
    const trigger = { ok: this.nzOnOk, cancel: this.nzOnCancel }[type];
    const loadingKey = { ok: 'nzOkLoading', cancel: 'nzCancelLoading' }[type];
    if (trigger instanceof EventEmitter) {
      trigger.emit(this.getContentComponent());
    } else if (typeof trigger === 'function') {
      const result = trigger(this.getContentComponent());
      const caseClose = (doClose: boolean | void | {}) => doClose !== false && this.close(doClose as R); // Users can return "false" to prevent closing by default
      if (isPromise(result)) {
        this[loadingKey] = true;
        const handleThen = (doClose: boolean | void | {}) => {
          this[loadingKey] = false;
          caseClose(doClose);
        };
        (result as Promise<void>).then(handleThen).catch(handleThen);
      } else {
        caseClose(result);
      }
    }
  } */
}
