import {ApplicationConfig, importProvidersFrom, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideHttpClient, withInterceptors} from "@angular/common/http";
import {provideCharts, withDefaultRegisterables} from 'ng2-charts';
import {credentialInterceptor, errorInterceptor} from "./classes/interceptors";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {ToastrModule} from "ngx-toastr";

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({eventCoalescing: true}),
        provideRouter(routes),
        provideHttpClient(withInterceptors([credentialInterceptor, errorInterceptor])),
        importProvidersFrom(BrowserAnimationsModule, ToastrModule.forRoot({closeButton: true})),
        provideCharts(withDefaultRegisterables())
    ]
};
