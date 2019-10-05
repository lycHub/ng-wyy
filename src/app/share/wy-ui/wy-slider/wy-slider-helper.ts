export function sliderEvent(e: Event) {
  e.stopPropagation();
  e.preventDefault();
}


export function getElementOffset(el: HTMLElement): { top: number; left: number; } {
  if (!el.getClientRects().length) {
    return {
      top: 0,
      left: 0
    };
  }

  const rect = el.getBoundingClientRect();
  const win = el.ownerDocument.defaultView;

  return {
    top: rect.top + win.pageYOffset,
    left: rect.left + win.pageXOffset
  };
}

