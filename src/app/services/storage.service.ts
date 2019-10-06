import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { ServicesModule } from './services.module';
import { AnyJson } from './data-types/common.types';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: ServicesModule
})
export class StorageService {
  private isBrowser: boolean;
  constructor(@Inject(PLATFORM_ID) private plateformId: object) {
    this.isBrowser = isPlatformBrowser(this.plateformId);
  }

  getStorage(key: string, type = 'local'): string {
    if (this.isBrowser) {
      return window[type + 'Storage'].getItem(key);
    }
    return '';
  }

  setStorage(params: AnyJson | AnyJson[], type = 'local') {
    if (this.isBrowser) {
      const kv = Array.isArray(params) ? params : [params];
      for (const { key, value } of kv) {
        window[type + 'Storage'].setItem(key, value.toString());
      }
    }
  }

  removeStorage(params: string | string[], type = 'local') {
    if (this.isBrowser) {
      const kv = Array.isArray(params) ? params : [params];
      for (const key of kv) {
        window[type + 'Storage'].removeItem(key);
      }
    }
  }
}
