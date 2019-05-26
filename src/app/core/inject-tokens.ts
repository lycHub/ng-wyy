/**
 *封装原生window对象
 */
import {InjectionToken} from "@angular/core";

/* 创建一个window服务的token. */
export const WINDOW = new InjectionToken('WindowToken');
export const API_CONFIG = new InjectionToken('ApiConfigToken');
export const ICON_FONT = new InjectionToken('IconFontToken');