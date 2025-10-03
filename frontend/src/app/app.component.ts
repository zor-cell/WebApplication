import {Component, HostListener, inject, OnInit, viewChild, ViewChild} from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {AuthService} from "./services/all/auth.service";
import {Globals} from "./classes/globals";
import {LoginPopupComponent} from "./components/all/popups/login-popup/login-popup.component";
import {HeaderComponent} from "./components/all/header/header.component";

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, HeaderComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {

}
