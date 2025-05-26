import {Component, EventEmitter, Input, Output} from '@angular/core';
import {PlayerSettings, Version} from "../../../dto/connect4/data";
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
    @Output() settingsEvent = new EventEmitter<PlayerSettings>();

    updateIsAi(checked: boolean) {
        this.isAi = checked;

        this.updateSettings();
    }

    updateSettings() {
        const settings: PlayerSettings = {
            isAi: this.isAi,
            maxTime: this.maxTime,
            maxMemory: this.maxMemory,
            version: this.version
        };

        this.settingsEvent.emit(settings);
    }
}
