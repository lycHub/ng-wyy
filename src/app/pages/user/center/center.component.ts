import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-center',
  templateUrl: './center.component.html',
  styleUrls: ['./center.component.less']
})
export class CenterComponent implements OnInit {

  constructor(private route: ActivatedRoute,) {
    this.route.data.pipe(map(res => res.user)).subscribe(id => {
      console.log('center :', id);
    });
  }

  ngOnInit() {
  }

}
