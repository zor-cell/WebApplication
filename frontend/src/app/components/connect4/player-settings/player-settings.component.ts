import {Component, Input} from '@angular/core';
import {Version} from "../../../dto/connect4/data";
import {SliderCheckboxComponent} from "../../global/slider-checkbox/slider-checkbox.component";

@Component({
    selector: 'connect4-player-settings',
    imports: [
        SliderCheckboxComponent
    ],
    templateUrl: './player-settings.component.html',
    standalone: true,
    styleUrl: './player-settings.component.css'
})
export class PlayerSettingsComponent {
    @Input() isAi: boolean = false;
    @Input() maxTime: number = 3000;
    @Input() maxMemory: number = 64;
    @Input() version: Version = Version.V2_1;

    test(checked: boolean) {

    }
}
