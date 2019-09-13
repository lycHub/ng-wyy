import { Lyric } from '../../../../services/data-types/common.types';
import { findIndex } from '../../../../utils/array';
import { from, zip } from 'rxjs';
import { skip } from 'rxjs/internal/operators';
// [00:34.940]
const timeExp = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/;


export interface BaseLyricLine {
  txt: string;
  txtCn: string;
}

interface LyricLine extends BaseLyricLine {
  time: number;
}



export class WyLyric {
  private lrc: Lyric;
  lines: LyricLine[] = [];
  constructor(lrc: Lyric) {
    this.lrc = lrc;
    this.init();
  }


  private init() {
    if (this.lrc.tlyric) {
      this.generTLyric();
    }else {
      this.generLyric();
    }
  }

  private generLyric() {
    const lines = this.lrc.lyric.split('\n');
    lines.forEach(line => this.makeLine(line));
    // console.log('lines :', this.lines);
  }

  private generTLyric() {
    const lines = this.lrc.lyric.split('\n');
    const tlines = this.lrc.tlyric.split('\n').filter(item => timeExp.exec(item) !== null);
    console.log('lines :', lines);
    console.log('tlines :', tlines);

    const moreLine = lines.length - tlines.length;

    let tempArr = [];
    if (moreLine >= 0) {
      tempArr = [lines, tlines];
    }else {
      tempArr = [tlines, lines];
    }

    const first = timeExp.exec(tempArr[1][0])[0];
    console.log('first :', first);

    const skipIndex = tempArr[0].findIndex(item => {
      const exec = timeExp.exec(item);
      if (exec) {
        return exec[0] === first;
      }
    });

    const _skip= skipIndex === -1 ? 0 : skipIndex;
    const skipItems = tempArr[0].slice(0, _skip);
    if (skipItems.length) {
      skipItems.forEach(line => this.makeLine(line));
    }
    // console.log('this.lines :', this.lines);

    let zipLines$;
    if (moreLine > 0) {
      zipLines$ = zip(from(lines).pipe(skip(_skip)), from(tlines));
    }else {
      zipLines$ = zip(from(lines), from(tlines).pipe(skip(_skip)));
    }
    // zipLines$.subscribe(([line, tline]))
    zipLines$.subscribe(([line, tline]) => this.makeLine(line, tline));
  }


  private makeLine(line: string, tline = '') {
    const result = timeExp.exec(line);
    // console.log('result :', result);
    if (result) {
      const txt = line.replace(timeExp, '').trim();
      const txtCn = tline ? tline.replace(timeExp, '').trim() : '';
      if (txt) {
        const thirdResult = result[3] || '00';
        const len = thirdResult.length;
        const _thirdResult = len > 2 ? parseInt(thirdResult) : parseInt(thirdResult) * 10;
        const time = Number(result[1]) * 60 * 1000 + Number(result[2]) * 1000 + _thirdResult;
        this.lines.push({ txt, txtCn, time });
      }
    }
  }
}