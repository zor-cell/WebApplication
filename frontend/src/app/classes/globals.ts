import {Injectable} from '@angular/core';
import {ToastrService} from "ngx-toastr";

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

    handleError(error: any, silent: boolean = false): void {
        if(!silent) {
            this.toastr.error(JSON.stringify(error), 'ERROR')
        }
    }
}