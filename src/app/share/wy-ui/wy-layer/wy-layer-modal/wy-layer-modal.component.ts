import { Component, EventEmitter, OnInit, Input, Output, ElementRef, ViewContainerRef, Inject, ViewChild, TemplateRef, Type, ComponentRef, Renderer2 } from '@angular/core';
import { OverlayRef, Overlay, OverlayKeyboardDispatcher, BlockScrollStrategy, OverlayConfig, OverlayContainer } from '@angular/cdk/overlay';
import { DOCUMENT } from '@angular/common';
import { ESCAPE } from '@angular/cdk/keycodes';
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { WINDOW } from '../../../../core/inject-tokens';
import { trigger, transition, animate, style, state } from '@angular/animations';
import { AppStoreModule } from 'src/app/store';
import { Store, select } from '@ngrx/store';
import { getModalVisible } from 'src/app/store/selectors/member.selector';
import { SetModalVisible, SetModalType } from 'src/app/store/actions/member.actions';
import { ModalTypes } from 'src/app/store/reducers/member.reducer';
import { getModalType } from '../../../../store/selectors/member.selector';
import { MultipleReducersService } from 'src/app/store/multiple-reducers.service';

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
export class WyLayerModalComponent implements OnInit {
  @Input() nzGetContainer: HTMLElement | OverlayRef; // [STATIC]
  @Input() nzContent: TemplateRef<{}>;
  @Input() showSpin = false;


  @Output() readonly onAfterOpen = new EventEmitter<void>(); // Trigger when modal open(visible) after animations
  @Output() readonly onAfterClose = new EventEmitter(); // Trigger when modal leave-animation over
  @Output() readonly onVisibleChange = new EventEmitter<boolean>();
  @Output() readonly onLoadSheetList = new EventEmitter<void>();
  

  showModal: 'show' | 'hide';
  modalTitle = {
    register: '注册',
    loginByPhone: '手机登陆',
    share: '分享',
    like: '收藏',
    default: ''
  }
  private isVisible = false;
  private overlayRef: OverlayRef;
  private scrollStrategy: BlockScrollStrategy;
  private unsubscribe$ = new Subject<void>();
  private resizeHandler: () => void;
  private modalSize: DomSize;

  currentModal = ModalTypes.Default;
  private overLayContainerEl: HTMLElement;
  private appStore$: Observable<AppStoreModule>;
  private destroy$ = new Subject<void>();

  @ViewChild('modalContainer', { static: true }) modalContainer: ElementRef;
  @ViewChild('bodyContainer', { static: false, read: ViewContainerRef }) bodyContainer: ViewContainerRef;
  constructor(
    private overlay: Overlay,
    private overlayKeyboardDispatcher: OverlayKeyboardDispatcher,
    private elementRef: ElementRef,
    private rd: Renderer2,
    private store$: Store<AppStoreModule>,
    private multipleReducerServe: MultipleReducersService,
    private overLayContainerServe: OverlayContainer,
    @Inject(DOCUMENT) private doc: Document,
    @Inject(WINDOW) private win: Window
  ) {
    this.overlayRef = this.overlay.create();
    this.scrollStrategy = this.overlay.scrollStrategies.block();
    this.appStore$ = this.store$.pipe(select('member'), takeUntil(this.destroy$));
    this.appStore$.pipe(select(getModalVisible)).subscribe(visible => this.watchModalVisible(visible));
    this.appStore$.pipe(select(getModalType)).subscribe(type => this.watchModalType(type));
  }

  ngOnInit() {
    this.overlayRef.overlayElement.appendChild(this.elementRef.nativeElement);
    this.overlayRef
    .keydownEvents()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(e => this.keydownListener(e));
  }


  ngAfterViewInit(): void {
    const modal = this.modalContainer.nativeElement;
    this.modalSize = this.getHideDomSize(modal);
    this.keepCenter(modal, this.modalSize);
    this.resizeHandler = this.rd.listen('window', 'resize', () => {
      this.keepCenter(modal, this.modalSize);
    });
    this.overLayContainerEl = this.overLayContainerServe.getContainerElement();
  }

  private watchModalVisible(visible: boolean) {
    this.isVisible = visible;
    this.handleVisibleStateChange(visible);
  }
  
  private watchModalType(type: ModalTypes) {
    if (type === ModalTypes.Like) {
      this.onLoadSheetList.emit();
    }
    this.currentModal = type;
  }


  private keepCenter(modal: HTMLElement, size: DomSize) {
    const left = (this.getWindowSize().w - size.w) / 2;
    const top = (this.getWindowSize().h - size.h) / 2;
    modal.style.left = left + 'px';
    modal.style.top = top + 'px';
  }

  private handleVisibleStateChange(visible: boolean) {
    if (visible) {
      this.showModal = 'show';
      this.changePointerEvents('auto');

      // Hide scrollbar at the first time when shown up
      this.scrollStrategy.enable();
      this.overlayKeyboardDispatcher.add(this.overlayRef);
      this.onAfterOpen.emit();
    } else {
      this.showModal = 'hide';
      this.changePointerEvents();
      this.overlayKeyboardDispatcher.remove(this.overlayRef);
      this.onAfterClose.emit();
      this.scrollStrategy.disable();
    }
  }

  private changePointerEvents(type = 'none') {
    if (this.overLayContainerEl) {
      this.overLayContainerEl.style.pointerEvents = type;
    }
  }
  
  private keydownListener(event: KeyboardEvent): void {
    if (event.keyCode === ESCAPE) {
      this.hide();
    }
  }

  hide() {
    this.multipleReducerServe.controlModal(ModalTypes.Default, false);
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

  
  ngOnDestroy(): void {
    this.overlayRef.dispose();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    if (this.resizeHandler) {
      this.resizeHandler();
    }
    this.destroy$.next();
    this.destroy$.complete();
    this.changePointerEvents();
  }
}
