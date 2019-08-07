import {Injectable, Inject} from '@angular/core';
import { WINDOW } from '../core/inject-tokens';
import { ServiceModule } from './service.module';

export type AnyJson = {
  [key: string]: any;
}

@Injectable({
  providedIn: ServiceModule
})
export class StorageService {
  constructor(@Inject(WINDOW) private win: Window) { }
  getStorage(key: string, type = 'local') {
    return this.win[type + 'Storage'].getItem(key);
  }

  setStroge(params: AnyJson | Array<AnyJson>, type = 'local') {
    const kv = Array.isArray(params) ? params : [params];
    for (const { key, value } of kv) {
      this.win[type + 'Storage'].setItem(key, value.toString());
    }
  }

  removeStroge(keys: string | string[], type = 'local') {
    const kv = Array.isArray(keys) ? keys : [keys];
    for (const item of kv) {
      this.win[type + 'Storage'].removeItem(item);
    }
  }
}
