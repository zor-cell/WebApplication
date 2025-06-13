import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
  ViewChildren
} from '@angular/core';
import {PlayerService} from "../../../services/player.service";
import {Globals} from "../../../classes/globals";
import {PlayerDetails} from "../../../dto/global/PlayerDetails";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {
  CdkDrag,
  CdkDragDrop,
  CdkDragPreview, CdkDragSortEvent,
  CdkDropList, CdkDropListGroup,
  moveItemInArray,
  transferArrayItem
} from "@angular/cdk/drag-drop";
import {Subscription, timer} from "rxjs";

@Component({
  selector: 'app-player-select',
  imports: [
    NgForOf,
    FormsModule,
    NgIf,
    CdkDrag,
    CdkDropList,
    CdkDragPreview,
    CdkDropListGroup,
    NgClass
  ],
  templateUrl: './player-select.component.html',
  standalone: true,
  styleUrl: './player-select.component.css'
})
export class PlayerSelectComponent implements OnInit {
  @Input() minPlayers: number = 2;
  @Input() maxPlayers: number = 4;
  @Input() allowTeams: boolean = true;

  @Output() selectedPlayersEvent = new EventEmitter<PlayerDetails[]>();

  allPlayers: PlayerDetails[] = []
  availablePlayers: PlayerDetails[] = [];
  selectedPlayers: PlayerDetails[] = [];

  currentPlayer: PlayerDetails | null = null;
  team: PlayerDetails[] = [];

  teamHostIndex: number = -1;

  constructor(private globals: Globals, private playerService: PlayerService) {}

  ngOnInit() {
    this.playerService.getPlayers().subscribe({
      next: res => {
        this.allPlayers = res;
        this.availablePlayers = this.allPlayers.map(player => this.copy(player));

        if(this.availablePlayers.length > 0) {
          this.currentPlayer = this.copy(this.availablePlayers[0]);
        }

        console.log(this.currentPlayer)
        console.log(this.allPlayers)
        console.log(this.availablePlayers)
      },
      error: err => {
        this.globals.handleError(err);
      }
    });
  }

  drop(event: CdkDragDrop<PlayerDetails[]>) {
    moveItemInArray(this.selectedPlayers, event.previousIndex, event.currentIndex);

    this.selectedPlayersEvent.emit(this.selectedPlayers);
  }

  playerClicked(playerIndex: number) {
    if(this.teamHostIndex >= 0) {

    }
  }

  teamClicked(playerIndex: number) {
    if(this.teamHostIndex === playerIndex) {
      this.teamHostIndex = -1;
    } else {
      this.teamHostIndex = playerIndex;
    }
  }

  changePlayer(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedName = selectElement.options[selectElement.selectedIndex].text;

    const found = this.availablePlayers.find(p => p.name === selectedName);
    if(found) {
      this.currentPlayer = this.copy(found);
    }

    console.log(this.currentPlayer)
  }

  addPlayer() {
    if(this.selectedPlayers.length >= this.maxPlayers && this.currentPlayer != null) {
      return;
    }

    const playerToAdd = this.copy(this.currentPlayer);

    //add to selected players
    this.selectedPlayers.push(playerToAdd);
    this.selectedPlayersEvent.emit(this.selectedPlayers);

    //remove from available list
    const index = this.availablePlayers.findIndex(p => p.name === playerToAdd.name);
    if(index >= 0) {
      this.availablePlayers.splice(index, 1);
    }

    //update current player to next in list
    if(this.availablePlayers.length > 0) {
      this.currentPlayer = this.copy(this.availablePlayers[0]);
    } else {
      this.currentPlayer = null;
    }
  }

  removePlayer(playerIndex: number) {
    //add back to available
    const player = this.selectedPlayers[playerIndex];
    this.availablePlayers.push(player);

    //remove from selected
    this.selectedPlayers.splice(playerIndex, 1);
    this.selectedPlayersEvent.emit(this.selectedPlayers);
  }

  private copy(obj: any) {
    return {...obj};
  }
}
