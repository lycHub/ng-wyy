import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.less']
})
export class MemberCardComponent implements OnInit {
  @Output() onLogin = new EventEmitter<void>();
  constructor() { }

  ngOnInit() {
  }

}
