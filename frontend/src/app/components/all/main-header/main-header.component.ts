import {Component, inject, input} from '@angular/core';
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
    private location = inject(Location);

    public showBack = input<boolean>(true);

    protected routeBack() {
      this.location.back();
    }
}
