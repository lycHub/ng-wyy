import { from, zip, Subject } from 'rxjs/index';
import { map, skip } from 'rxjs/operators';
const timeExp = /\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?]/;

/* const tagRegMap = {
  title: 'ti',
  artist: 'ar',
  album: 'al',
  offset: 'offset',
  by: 'by'
}; */

// type Handler = (arg: { txt: string; txtCn: string; lineNum: number }) => void;
type Handler = { txt: string; txtCn: string; lineNum: number };
type LyricLine = { txt: string; txtCn: string; time: number; }

type LyricParams = { lyric: string; tlyric: string; };

export class LyricParser {
  private lrc: LyricParams;
  // private tags = {};
  lines: LyricLine[] = [];
  handler = new Subject<Handler>();
  private playing = false;
  private curNum: number;
  private startStamp: number;
  private pauseStamp: number;
  private timer: any;
  constructor(lrc: LyricParams) {
    this.lrc = lrc;
    this.init();
  }
  
  private init() {
    // this.initTag();
    this.initLines();
  }
  
  /* private initTag() {
    for (let tag in tagRegMap) {
      const matches = this.lrc.match(new RegExp(`\\[${tagRegMap[tag]}:([^\\]]*)]`, 'i'));
      this.tags[tag] = matches && matches[1] || '';
    }
  } */
  
  private initLines() {
   if (this.lrc.tlyric) {
     this.generTlyric();
   }else{
    this.generLyric();
   }
  }


  private generTlyric() {
    const lines = this.lrc.lyric.split('\n');
    const tlines = this.lrc.tlyric.split('\n').filter(item => {
      return timeExp.exec(item) !== null;
    });
    const moreLine = lines.length - tlines.length;

    let tempArr = [];
    let zipLines$; 
    if (moreLine >= 0) {
      console.log('line', moreLine);
      tempArr = [lines, tlines];
      
    }else{
      console.log('tline', moreLine);
      tempArr = [tlines, lines];
      
    }
   
    let first = timeExp.exec(tempArr[1][0])[2];

    const skipIndex = tempArr[0].findIndex(item => {
      const exec = timeExp.exec(item);
      if (exec) {
        return exec[2] === first;
      }
    });
    const _skip = skipIndex === -1 ? 0 : skipIndex;
    // console.log('_skip :', _skip);
    let skipItems = [];
    if (moreLine > 0) {
      zipLines$ = zip(from(lines).pipe(skip(_skip)), from(tlines));
      skipItems = lines.slice(0, _skip);
    }else{
      zipLines$ = zip(from(lines), from(tlines).pipe(skip(_skip)));
    }
  
    if (skipItems.length) {
      skipItems.forEach(line => {
        this.makeLine(line);
      });
    }
    // console.log('lines :', this.lines);
    zipLines$
    .pipe(map(([line, tline]) => ({ line, tline })))
    .subscribe(({ line, tline }) => this.makeLine(line, tline));
  }


  private generLyric() {
    // console.log('generLyric', this.lrc.lyric);
    const lines = this.lrc.lyric.split('\n');
    lines.forEach(line => {
      this.makeLine(line);
    });
    // console.log('this.lines :', this.lines);
  }

  private makeLine(line: string, tline = '') {
    const result = timeExp.exec(line);
	  // const tresult = timeExp.exec(tline);
      if (result) {
        const txt = line.replace(timeExp, '').trim();
        const txtCn = tline ? tline.replace(timeExp, '').trim() : '';
        if (txt) {
          let tirdResult = result[3] || '0';
          let length = tirdResult.length;
          let _tirdResult = parseInt(tirdResult, 10);
          _tirdResult = length > 2 ? Number(_tirdResult) : Number(_tirdResult) * 10;

          this.lines.push({
            // time: result[1] * 60 * 1000 + result[2] * 1000 + (result[3] || 0) * 10 + offset,
            time: Number(result[1]) * 60 * 1000 + Number(result[2]) * 1000 + _tirdResult,
            txt,
            txtCn
          });
        }
      }
  }
  
  private findCurNum(time: number) {
    for (let i = 0; i < this.lines.length; i++) {
      if (time <= this.lines[i].time) {
        return i
      }
    }
    return this.lines.length - 1
  }
  
  private callHandler(i) {
    if (i > 0) {
      this.handler.next({
        txt: this.lines[i].txt,
        txtCn: this.lines[i].txtCn,
        lineNum: i
      });
      /* this.handler({
        txt: this.lines[i].txt,
        txtCn: this.lines[i].txtCn,
        lineNum: i
      }); */
    }
  }
  
  private playRest() {
    let line = this.lines[this.curNum];
    let delay = line.time - (+new Date() - this.startStamp);
    
    this.timer = setTimeout(() => {
      this.callHandler(this.curNum++);
      if (this.curNum < this.lines.length && this.playing) {
        this.playRest();
      }
    }, delay);
  }
  
  play(startTime = 0, skipLast = false) {
    if (!this.lines.length) {
      return;
    }
    
    if (!this.playing) {
      this.playing = true;
    }
    
    
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
  
  togglePlay(playing: boolean) {
    const now = +new Date();
    this.playing = playing;
    if (this.playing) {
      this.play((this.pauseStamp || now) - (this.startStamp || now), true);
      this.pauseStamp = 0;
    } else {
      this.stop();
      this.pauseStamp = now;
    }
  }
  
  stop() {
    if (this.playing) {
      this.playing = false;
    }
    clearTimeout(this.timer);
  }
  
  seek(offset) {
    this.play(offset);
  }
}
