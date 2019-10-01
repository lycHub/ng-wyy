import { Component, OnInit, ChangeDetectionStrategy, ElementRef, ChangeDetectorRef, AfterViewInit, ViewChild, Renderer2, Inject } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppStoreModule } from '../../../../store/index';
import { getModalVisible, getModalType } from '../../../../store/selectors/member.selector';
import { ModalTypes } from '../../../../store/reducers/member.reducer';
import { Overlay, OverlayRef, OverlayKeyboardDispatcher, BlockScrollStrategy } from '@angular/cdk/overlay';
import { BatchActionsService } from 'src/app/store/batch-actions.service';
import { ESCAPE } from '@angular/cdk/keycodes';
import { DOCUMENT } from '@angular/common';
import { WINDOW } from 'src/app/services/services.module';

@Component({
  selector: 'app-wy-layer-modal',
  templateUrl: './wy-layer-modal.component.html',
  styleUrls: ['./wy-layer-modal.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WyLayerModalComponent implements OnInit, AfterViewInit {
  showModal = false;
  private visible = false;
  private currentModalType = ModalTypes.Default;
  private overlayRef: OverlayRef;
  private scrollStrategy: BlockScrollStrategy;
  private resizeHandler: () => void;
  @ViewChild('modalContainer', { static: false }) private modalRef: ElementRef;
  constructor(
    @Inject(WINDOW) private win: Window,
    @Inject(DOCUMENT) private doc: Document,
    private store$: Store<AppStoreModule>,
    private overlay: Overlay,
    private elementRef: ElementRef,
    private overlayKeyboardDispatcher: OverlayKeyboardDispatcher,
    private cdr: ChangeDetectorRef,
    private batchActionsServe: BatchActionsService,
    private rd: Renderer2
  ) {
    const appStore$ = this.store$.pipe(select('member'));
    appStore$.pipe(select(getModalVisible)).subscribe(visib => this.watchModalVisible(visib));
    appStore$.pipe(select(getModalType)).subscribe(type => this.watchModalType(type));
    this.scrollStrategy = this.overlay.scrollStrategies.block();
  }

  ngOnInit() {
    this.createOverlay();
  }


  ngAfterViewInit() {
    this.listenResizeToCenter();
  }


  private createOverlay() {
    this.overlayRef = this.overlay.create();
    this.overlayRef.overlayElement.appendChild(this.elementRef.nativeElement);
    this.overlayRef.keydownEvents().subscribe(e => this.keydownListener(e));
  }

  private keydownListener(evt: KeyboardEvent) {
    if (evt.keyCode === ESCAPE) {
      this.hide();
    }
  }


  private watchModalVisible(visib: boolean) {
    if (this.visible !== visib) {
      this.visible = visib;
      this.handleVisibleChange(visib);
    }
  }
  private watchModalType(type: ModalTypes) {
    if (this.currentModalType !== type) {
      this.currentModalType = type;
    }
  }


  private handleVisibleChange(visib: boolean) {
    this.showModal = visib;
    if (visib) {
      this.scrollStrategy.enable();
      this.overlayKeyboardDispatcher.add(this.overlayRef);
      this.listenResizeToCenter();
    } else {
      this.scrollStrategy.disable();
      this.overlayKeyboardDispatcher.remove(this.overlayRef);
      this.resizeHandler();
    }
    this.cdr.markForCheck();
  }


  hide() {
    this.batchActionsServe.controlModal(false);
  }


  private listenResizeToCenter() {
    const modal = this.modalRef.nativeElement;
    const modalSize = this.getHideDomSize(modal);
    this.keepCenter(modal, modalSize);
    this.resizeHandler = this.rd.listen('window', 'resize', () => this.keepCenter(modal, modalSize));
  }

  private keepCenter(modal: HTMLElement, size: { w: number, h: number }) {
    const left = (this.getWIndowSize().w - size.w) / 2;
    const top = (this.getWIndowSize().h - size.h) / 2;
    modal.style.left = left + 'px';
    modal.style.top = top + 'px';
  }


  private getHideDomSize(dom: HTMLElement) {
    console.log('dom :', dom);
    return {
      w: dom.offsetWidth,
      h: dom.offsetHeight
    }
  }
  private getWIndowSize() {
    return {
      w: this.win.innerWidth || this.doc.documentElement.clientWidth || this.doc.body.offsetWidth,
      h: this.win.innerHeight || this.doc.documentElement.clientHeight || this.doc.body.offsetHeight
    }
  }
}
