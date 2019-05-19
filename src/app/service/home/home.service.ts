import {Inject, Injectable} from '@angular/core';
import {ServiceModule} from "../service.module";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Banner} from "./data.models";
import {Observable} from "rxjs/index";
import {catchError, map} from "rxjs/internal/operators";

@Injectable({
  providedIn: ServiceModule
})
export class HomeService {
  constructor(private http: HttpClient, @Inject('API_CONFIG') private config: string) { }
  
  getBanners(): Observable<Banner[]> {// bgColor
    const bgColor = ['#f1f0ee', '#5e786b', '#040404', '#eff1fd', '#202441', '#f1eee9', '#c17335', '#f1f1e7', '#5a5a5a'];
    return this.http.get(this.config + 'banner')
      .pipe(map((res: {banners: Banner[]; code: number;}) => {
        res.banners.forEach((item, key) => {
          item.bgColor = bgColor[key]
        });
        return res.banners;
      }), catchError(this.handleError));
  }
  
  private handleError(error: HttpErrorResponse): never {
    console.error(error);
    throw new Error(error.error.message);
  };
}
