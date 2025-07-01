import {Component, OnInit, ViewChild} from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {AuthService} from "./services/auth.service";
import {Globals} from "./classes/globals";
import {LoginPopupComponent} from "./components/global/popups/login-popup/login-popup.component";

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, RouterLink, LoginPopupComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
    @ViewChild('loginPopup') loginPopup!: LoginPopupComponent;

    title = 'frontend';

    constructor(private globals: Globals, public authService: AuthService) {
    }

    ngOnInit() {
        this.authService.loadUser().subscribe({
            next: res => {

            }
        })
    }

    openLoginPopup() {
        this.loginPopup.openPopup();
    }

    loggedIn() {
        window.location.reload();
    }
}
