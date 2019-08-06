import { Observable } from 'rxjs';
export interface MouseTouchObserverConfig {
  end: string;
  move: string;
  pluckKey: string[];
  start: string;

  startPlucked$?: Observable<number>;
  moveResolved$?: Observable<number>;
  end$?: Observable<Event>;

  filter?(e: Event): boolean;
}




/**
 * Silent an event by stopping and preventing it.
 */
export function silentEvent(e: Event): void {
  e.stopPropagation();
  e.preventDefault();
}


export function getElementOffset(elem: HTMLElement): { top: number; left: number } {
  if (!elem.getClientRects().length) {
    return { top: 0, left: 0 };
  }

  const rect = elem.getBoundingClientRect();
  const win = elem.ownerDocument!.defaultView;  // window
  return {
    top: rect.top + win!.pageYOffset,
    left: rect.left + win!.pageXOffset
  };
}