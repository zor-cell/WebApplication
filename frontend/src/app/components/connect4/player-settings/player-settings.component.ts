import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PlayerConfig, Version} from "../../../dto/connect4/data";
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
export class PlayerSettingsComponent implements OnInit {
    @Input({required: true}) playerValue!: number;
    @Input() isAi: boolean = false;
    @Input() maxTime: number = 3000;
    @Input() maxMemory: number = 64;
    @Input() version: Version = Version.V2_1;
    @Output() settingsEvent = new EventEmitter<PlayerConfig>();

    ngOnInit() {
        this.updateConfig();
    }

    updateIsAi(checked: boolean) {
        this.isAi = checked;

        this.updateConfig();
    }

    updateConfig() {
        const settings: PlayerConfig = {
            value: this.playerValue,
            isAi: this.isAi,
            maxTime: this.maxTime,
            maxMemory: this.maxMemory,
            version: this.version
        };

        this.settingsEvent.emit(settings);
    }
}
