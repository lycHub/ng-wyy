import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-wy-player-panel',
  templateUrl: './wy-player-panel.component.html',
  styleUrls: ['./wy-player-panel.component.less']
})
export class WyPlayerPanelComponent implements OnInit {
  arr = Array(100).fill(3);
  constructor() { }

  ngOnInit() {
  }

}
