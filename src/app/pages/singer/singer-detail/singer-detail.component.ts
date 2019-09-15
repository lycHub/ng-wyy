import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/internal/operators';
import { SingerDetail } from '../../../services/data-types/common.types';

@Component({
  selector: 'app-singer-detail',
  templateUrl: './singer-detail.component.html',
  styleUrls: ['./singer-detail.component.less']
})
export class SingerDetailComponent implements OnInit {
  singerDetail: SingerDetail;
  constructor(private route: ActivatedRoute) {
    this.route.data.pipe(map(res => res.singerDetail)).subscribe(detail => {
      this.singerDetail = detail;
    });
  }

  ngOnInit() {
  }

}
