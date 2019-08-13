import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appImgDefault]'
})
export class ImgDefaultDirective {

  constructor() {
    console.log('img');
  }

  @HostListener('mousedown', ['$event']) onMouseDown(evt) {
    evt.preventDefault();
  }

}
