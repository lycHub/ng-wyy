import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import {Observable} from "rxjs/index";
import { SongSheet } from 'src/app/service/data-modals/common.models';
import { SheetService } from '../../service/sheet.service';


@Injectable()
export class SheetInfoResolverService implements Resolve<SongSheet> {
  constructor(private sheetService: SheetService) {}
  
  resolve(route: ActivatedRouteSnapshot): Observable<SongSheet> {
    return this.sheetService.getSongSheetDetail(Number(route.paramMap.get('id')));
  }
}