import {Component, input} from '@angular/core';
import {Location, NgIf} from "@angular/common";

@Component({
    selector: 'app-main-header',
    imports: [
        NgIf
    ],
    templateUrl: './main-header.component.html',
    standalone: true,
    styleUrl: './main-header.component.css'
})
export class MainHeaderComponent {
    showBack = input<boolean>(true);

    constructor(private location: Location) {
    }

    routeBack() {
      this.location.back();
    }
}
