import {inject, Injectable} from '@angular/core';
import {ToastrService} from "ngx-toastr";
import {HttpContext} from "@angular/common/http";
import {SILENT_ERROR_HANDLER} from "./interceptors";

@Injectable({
    providedIn: 'root'
})
export class Globals {
    private toastr = inject(ToastrService);
    public readonly backendUri: string = this.getBackendUrl();

    private getBackendUrl(): string {
        if (window.location.port === '4200') { // local `ng serve`, backend at localhost:8080
            return 'http://localhost:8080/api';
        } else {
            return 'https://server.zorphy.net/api';
        }
    }

    public get silentErrorContext(): HttpContext {
        return new HttpContext().set(SILENT_ERROR_HANDLER, true);
    }

    public handleError(error: any): void {
        const e = error instanceof Object ? error.error : error;
        const status: number = error.status;

        let message = e instanceof ProgressEvent ? error.message : e;
        if (status === 0) {
            // backend unreachable
            message = 'Cannot connect to the server. Please check your internet connection or try again later'
        } else if (error.error && typeof error.error === 'string') {
            // text error response
            message = error.error;
        } else if(error.error && Array.isArray(error.error)) {
            message = error.error;
        } else if (error.error && error.error.message) {
            // JSON error
            message = error.error.message;
        } else if (error.message) {
            message = error.message;
        }

        this.toastr.error(message, 'ERROR ' + status);
    }

    public handleSuccess(message: string) {
        this.toastr.success(message);
    }
}
