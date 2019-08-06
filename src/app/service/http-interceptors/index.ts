import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { CatchErrorInterceptor } from './catch-error-interceptor';

export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: CatchErrorInterceptor, multi: true },
];