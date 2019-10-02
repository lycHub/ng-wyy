import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { User } from 'src/app/services/data-types/member.type';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.less']
})
export class MemberCardComponent implements OnInit {
  @Input() user: User;
  @Output() openModal = new EventEmitter<void>();
  constructor() { }

  ngOnInit() {
  }

}
