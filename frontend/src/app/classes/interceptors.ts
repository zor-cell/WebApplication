import {
    HttpContextToken,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpInterceptorFn,
    HttpRequest
} from "@angular/common/http";
import {inject} from "@angular/core";
import {Globals} from "./globals";
import {catchError, EMPTY, of, throwError} from "rxjs";

export const SILENT_ERROR_HANDLER = new HttpContextToken<boolean>(() => false);

export const credentialInterceptor: HttpInterceptorFn = (req, next) => {
    const modified = req.clone({withCredentials: true});
    return next(modified);
};

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const globals = inject(Globals);

    const silentErrorHandling = req.context.get(SILENT_ERROR_HANDLER);

    return next(req).pipe(
      catchError(err => {
        if(!silentErrorHandling) {
            globals.handleError(err);
        }

        return EMPTY;
        //return throwError(() => err);
      })
  )
};