import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { SingerDetail } from '../../../service/singer/singer.service';
import { Singer } from 'src/app/service/data-modals/common.models';

@Component({
  selector: 'app-singer-detail',
  templateUrl: './singer-detail.component.html',
  styleUrls: ['./singer-detail.component.less']
})
export class SingerDetailComponent implements OnInit {
  detail: SingerDetail;
  simiSingers: Singer[];
  alias = '';
  constructor(private route: ActivatedRoute) {
    this.route.data.pipe(map(res => res.singerDatas)).subscribe(([detail, singers]) => {
      this.detail = detail;
      this.simiSingers = singers;
      console.log('singers :', singers);
      if (this.detail) {
        this.alias = this.detail.artist.alias.join('；');
      }
    });
  }

  ngOnInit() {
  }

}
