import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-code',
  template: `<div class="code-wrap clearfix">
    <div class="u-word">
      <input />
    </div>
    <div class="u-word">
      <input />
    </div>
    <div class="u-word">
      <input />
    </div>
    <div class="u-word">
      <input />
    </div>
  </div>`,
  styleUrls: ['./code.component.less']
})
export class CodeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
