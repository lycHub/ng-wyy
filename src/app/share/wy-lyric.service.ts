const timeExp = /\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?]/g;

const tagRegMap = {
  title: 'ti',
  artist: 'ar',
  album: 'al',
  offset: 'offset',
  by: 'by'
};

type Handler = (arg: { txt: string; lineNum: number }) => void;

export class LyricParser {
  private lrc: string;
  private tags = {};
  lines = [];
  private handler: Handler;
  private playing = false;
  private curNum: number;
  private startStamp: number;
  private pauseStamp: number;
  private timer: any;
  constructor(lrc: string, handler?: Handler) {
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
      const result = timeExp.exec(line);
      if (result) {
        const txt = line.replace(timeExp, '').trim();
        if (txt) {
          let tirdResult = result[3] || '0'; // 数字的 0 查询长度会变为 undefined，感觉不如直接指定 '0'
          let length = tirdResult.length;
          let _tirdResult = parseInt(tirdResult, 10);
          _tirdResult = length > 2 ? Number(_tirdResult) : Number(_tirdResult) * 10;

          this.lines.push({
            // time: result[1] * 60 * 1000 + result[2] * 1000 + (result[3] || 0) * 10 + offset,
            time: Number(result[1]) * 60 * 1000 + Number(result[2]) * 1000 + _tirdResult,
            txt
          })
        }
      }
    }
    
    this.lines.sort((a, b) => {
      return a.time - b.time
    })
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
  
 /* updateLineNum(offset) {
    this.curNum = this.findCurNum(offset);
    this.handler({
      txt: this.lines[this.curNum].txt,
      lineNum: this.curNum
    });
  }*/
}
