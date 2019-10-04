import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

const CODELEN = 4;

@Component({
  selector: 'app-wy-code',
  templateUrl: './wy-code.component.html',
  styleUrls: ['./wy-code.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WyCodeComponent implements OnInit {
  inputArr = [];
  constructor() {
    this.inputArr = Array(CODELEN).fill('');
  }

  ngOnInit() {
  }

}
