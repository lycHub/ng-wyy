import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { User } from 'src/app/service/data-modals/member.models';
import { MemberService } from 'src/app/service/member.service';
import { NzMessageService } from 'ng-zorro-antd';
import Cookies from 'universal-cookie';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.less']
})
export class MemberCardComponent implements OnInit {
  @Input() user: User;
  @Output() openModal = new EventEmitter<void>();

  hasSignIn = false;
  private cookieIns = new Cookies();
  constructor(private memberServe: MemberService, private message: NzMessageService,) {
    const cookIn = this.cookieIns.get('wySignIn');
    this.hasSignIn = cookIn === 'true';
  }

  ngOnInit() {
   
  }

  onSignIn() {
    this.memberServe.signIn().subscribe(() => {
      this.cookieIns.set('wySignIn', true, { maxAge: 60*60*24 });
      this.alertMessage('success', '签到成功');
    }, error => {
      this.alertMessage('error', error.msg || '签到失败');
    });
  }

  private alertMessage(type: string, msg: string) {
    this.message.create(type, msg);
    this.hasSignIn = true;
  }
}
