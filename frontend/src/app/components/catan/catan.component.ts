import { Component } from '@angular/core';
import {GameSettingsComponent} from "./game-settings/game-settings.component";

@Component({
  selector: 'app-catan',
  imports: [
    GameSettingsComponent
  ],
  templateUrl: './catan.component.html',
  standalone: true,
  styleUrl: './catan.component.css'
})
export class CatanComponent {

}
