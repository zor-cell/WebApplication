import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PlayerConfig, Version} from "../../../dto/connect4/data";
import {SliderCheckboxComponent} from "../../global/slider-checkbox/slider-checkbox.component";
import {NgIf} from "@angular/common";

@Component({
    selector: 'connect4-player-settings',
    imports: [
        SliderCheckboxComponent,
        NgIf
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
    @Output() makeMoveEvent = new EventEmitter<PlayerConfig>();

    get config(): PlayerConfig {
        return {
            value: this.playerValue,
            isAi: this.isAi,
            maxTime: this.maxTime,
            maxMemory: this.maxMemory,
            version: this.version
        };
    }

    ngOnInit() {
        this.sendConfig();
    }

    updateIsAi(checked: boolean) {
        this.isAi = checked;

        this.sendConfig();
    }

    sendConfig() {
        this.settingsEvent.emit(this.config);
    }

    sendMakeMove() {
        this.makeMoveEvent.emit(this.config);
    }
}
