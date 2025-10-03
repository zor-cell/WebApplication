import {ApplicationConfig, importProvidersFrom, InjectionToken, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideHttpClient, withInterceptors} from "@angular/common/http";
import {provideCharts, withDefaultRegisterables} from 'ng2-charts';
import {credentialInterceptor, errorInterceptor} from "./classes/interceptors";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {ToastrModule} from "ngx-toastr";
import {LIGHTBOX_CONFIG, LightboxConfig} from "ng-gallery/lightbox";
import {GALLERY_CONFIG, GalleryConfig} from "ng-gallery";

const galleryProvider: {provide: any, useValue: GalleryConfig} = {
    provide: GALLERY_CONFIG,
    useValue: {
        thumbPosition: 'bottom',
        imageSize: 'contain',
        thumbs: true,
        thumbImageSize: 'cover'
    }
};

const lightBoxProvider: {provide: any, useValue: LightboxConfig} = {
    provide: LIGHTBOX_CONFIG,
    useValue: {
        keyboardShortcuts: false,
        exitAnimationTime: 500
    }
};


export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({eventCoalescing: true}),
        provideRouter(routes),
        provideHttpClient(withInterceptors([credentialInterceptor, errorInterceptor])),
        importProvidersFrom(
            BrowserAnimationsModule,
            ToastrModule.forRoot({closeButton: true})
        ),
        provideCharts(withDefaultRegisterables()),
        galleryProvider,
        lightBoxProvider
    ]
};