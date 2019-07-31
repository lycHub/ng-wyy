import {ShareModule} from "./share.module";
import {Injectable} from "@angular/core";


const timeExp = /\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?]/g;

const STATE_PAUSE = 0;
const STATE_PLAYING = 1;

const tagRegMap = {
  title: 'ti',
  artist: 'ar',
  album: 'al',
  offset: 'offset',
  by: 'by'
};


@Injectable({
  providedIn: ShareModule
})

export class Lyric {
  private lrc: string;
  private tags = {};
  private lines = [];
  private handler: (arg: { txt: string; lineNum: number }) => void;
  private state = STATE_PAUSE;
  private curLine = 0;
  
  private curNum: number;
  private startStamp: number;
  private pauseStamp: number;
  private timer: any;
  constructor(lrc: string, handler) {
    this.lrc = lrc;
    this.handler = handler;
    this.init();
  }
  
  private init() {
    this.initTag();
    this.initLines();
  }
  
  private initTag() {
    for (let tag in tagRegMap) {
      const matches = this.lrc.match(new RegExp(`\\[${tagRegMap[tag]}:([^\\]]*)]`, 'i'));
      this.tags[tag] = matches && matches[1] || '';
    }
  }
  
  private initLines() {
    const lines = this.lrc.split('\n');
    const offset = parseInt(this.tags['offset']) || 0;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      let result = timeExp.exec(line);
      if (result) {
        const txt = line.replace(timeExp, '').trim();
        if (txt) {
          this.lines.push({
            time: result[1] * 60 * 1000 + result[2] * 1000 + (result[3] || 0) * 10 + offset,
            txt
          })
        }
      }
    }
    
    this.lines.sort((a, b) => {
      return a.time - b.time
    })
  }
  
  private findCurNum(time) {
    for (let i = 0; i < this.lines.length; i++) {
      if (time <= this.lines[i].time) {
        return i
      }
    }
    return this.lines.length - 1
  }
  
  private callHandler(i) {
    if (i < 0) {
      return;
    }
    this.handler({
      txt: this.lines[i].txt,
      lineNum: i
    });
  }
  
  private playRest() {
    let line = this.lines[this.curNum];
    let delay = line.time - (+new Date() - this.startStamp);
    
    this.timer = setTimeout(() => {
      this.callHandler(this.curNum++);
      if (this.curNum < this.lines.length && this.state === STATE_PLAYING) {
        this.playRest();
      }
    }, delay);
  }
  
  play(startTime = 0, skipLast = false) {
    if (!this.lines.length) {
      return;
    }
    this.state = STATE_PLAYING;
    
    this.curNum = this.findCurNum(startTime);
    this.startStamp = +new Date() - startTime;
    
    if (!skipLast) {
      this.callHandler(this.curNum - 1);
    }
    
    if (this.curNum < this.lines.length) {
      clearTimeout(this.timer);
      this.playRest();
    }
  }
  
  togglePlay() {
    const now = +new Date();
    if (this.state === STATE_PLAYING) {
      this.stop();
      this.pauseStamp = now;
    } else {
      this.state = STATE_PLAYING;
      this.play((this.pauseStamp || now) - (this.startStamp || now), true);
      this.pauseStamp = 0;
    }
  }
  
  stop() {
    this.state = STATE_PAUSE;
    clearTimeout(this.timer);
  }
  
  seek(offset) {
    this.play(offset);
  }
}
