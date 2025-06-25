import {Injectable} from '@angular/core';
import {ToastrService} from "ngx-toastr";
import {HttpContext} from "@angular/common/http";
import {SILENT_ERROR_HANDLER} from "./interceptors";

@Injectable({
    providedIn: 'root'
})
export class Globals {
    readonly backendUri: string = this.getBackendUrl();

    constructor(private toastr: ToastrService) {}

    private getBackendUrl(): string {
        if (window.location.port === '4200') { // local `ng serve`, backend at localhost:8080
            return 'http://localhost:8080';
        } else {
            return 'https://server.zorphy.net';
        }
    }

    get silentErrorContext(): HttpContext {
        return new HttpContext().set(SILENT_ERROR_HANDLER, true);
    }

    handleError(error: any, silent: boolean = false): void {
        if(!silent) {
            const message: string = error instanceof Object ? error.error : error;
            const status = error.status;

            this.toastr.error(message, status + ' ERROR');
        }
    }
}