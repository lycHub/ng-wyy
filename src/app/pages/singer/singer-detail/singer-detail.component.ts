import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/internal/operators';

@Component({
  selector: 'app-singer-detail',
  templateUrl: './singer-detail.component.html',
  styleUrls: ['./singer-detail.component.less']
})
export class SingerDetailComponent implements OnInit {

  constructor(private route: ActivatedRoute) {
    this.route.data.pipe(map(res => res.singerDetail)).subscribe(res => {
      console.log('res :', res);
    });
  }

  ngOnInit() {
  }

}
