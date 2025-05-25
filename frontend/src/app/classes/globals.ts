import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class Globals {
    readonly backendUri: string = this.getBackendUrl();

    private getBackendUrl(): string {
        if (window.location.port === '4200') { // local `ng serve`, backend at localhost:8080
            return 'http://localhost:8080';
        } else {
            return 'https://server.zorphy.net';
        }
    }

    handleError(error: any): void {
        console.error(error);
    }
}