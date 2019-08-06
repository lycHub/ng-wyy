import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { User } from 'src/app/service/data-modals/member.models';
import { MemberService } from 'src/app/service/member/member.service';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.less']
})
export class MemberCardComponent implements OnInit {
  @Input() user: User;
  @Output() openModal = new EventEmitter<void>();

  hasSignIn = false;
  constructor(private memberServe: MemberService, private message: NzMessageService,) { }

  ngOnInit() {
  }

  onSignIn() {
    this.memberServe.signIn().subscribe(res => {
      console.log('signIn :', res);
      this.alertMessage('success', '签到成功');
    }, error => {
      console.error('signIn error :', error);
      this.alertMessage('error', '签到失败');
    });
  }

  private alertMessage(type: string, msg: string) {
    this.message.create(type, msg);
    this.hasSignIn = true
  }
}
