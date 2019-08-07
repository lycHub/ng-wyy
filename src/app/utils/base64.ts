import { Base64 } from 'js-base64';
import { AnyJson } from '../service/storage.service';

export function codeJson(source: Object, type = 'encode'): AnyJson {
  const obj = {};
    for(const attr in source) {
      obj[Base64[type](attr)] = Base64[type](source[attr]);
    }
    return obj;
}