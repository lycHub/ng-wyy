import { Component, OnInit, Input, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-wy-search',
  templateUrl: './wy-search.component.html',
  styleUrls: ['./wy-search.component.less']
})
export class WySearchComponent implements OnInit {
  @Input() customView: TemplateRef<any>;
  
  constructor() {}

  ngOnInit() {
  }

}
