import {Component, OnInit} from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {AuthService} from "./services/auth.service";
import {Globals} from "./classes/globals";

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, RouterLink],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
    title = 'frontend';

    constructor(private globals: Globals, private authService: AuthService) {}

    ngOnInit() {
        this.authService.loadUser().subscribe({
            next: res => {

            },
            error: err => {
                this.globals.handleError(err, true);
            }
        })
    }
}
