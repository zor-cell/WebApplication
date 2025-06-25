import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {PlayerService} from "../../../services/player.service";
import {Globals} from "../../../classes/globals";
import {PlayerDetails} from "../../../dto/global/PlayerDetails";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {
  CdkDrag,
  CdkDragDrop,
  CdkDragPreview,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray
} from "@angular/cdk/drag-drop";
import {Team} from "../../../dto/global/Team";
import {PopupDialogComponent} from "../popups/popup-dialog.component";
import {NewPlayerPopupComponent} from "../popups/new-player-popup/new-player-popup.component";
import {AuthService} from "../../../services/auth.service";

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
    NgClass,
    ReactiveFormsModule,
    PopupDialogComponent,
    NewPlayerPopupComponent,
    NewPlayerPopupComponent
  ],
  templateUrl: './player-select.component.html',
  standalone: true,
  styleUrl: './player-select.component.css'
})
export class PlayerSelectComponent implements OnInit, OnChanges {
  @ViewChild('playerPopup') playerPopup!: NewPlayerPopupComponent;

  @Input() minTeams: number = 2;
  @Input() maxTeams: number = 4;
  @Input() allowTeams: boolean = true;
  @Input() selectedTeams: Team[] = [];

  @Output() selectedTeamEvent = new EventEmitter<Team[]>();

  allPlayers: PlayerDetails[] = []
  availablePlayers: PlayerDetails[] = [];
  currentPlayer: PlayerDetails | null = null;

  teamHostIndex: number = -1;

  constructor(private globals: Globals,
              private playerService: PlayerService,
              public authService: AuthService) {}

  ngOnInit() {
    this.getPlayers();
  }

  ngOnChanges(changes: SimpleChanges): void {
    //remove duplicate players from available
    if (changes['selectedTeams'] && this.allPlayers.length > 0) {
      this.availablePlayers = this.availablePlayers
          .filter(player => !this.selectedTeams.some(team => team.players.some(p => p.name === player.name)))
          .map(player => this.copy(player));
    }
  }

  mergeTeam(teamIndex: number) {
    if(!this.allowTeams) return;

    if(this.teamHostIndex >= 0) {
      const hostTeam= this.selectedTeams[this.teamHostIndex]
      const memberTeam = this.copy(this.selectedTeams[teamIndex]);

      //merge team
      hostTeam.name = this.generateTeamName([...hostTeam.players, ...memberTeam.players]);
      hostTeam.players.push(...memberTeam.players);

      this.selectedTeams.splice(teamIndex, 1);

      this.teamHostIndex = -1;
    }
  }

  //drag and drop reordering logic
  drop(event: CdkDragDrop<Team[]>) {
    moveItemInArray(this.selectedTeams, event.previousIndex, event.currentIndex);

    this.selectedTeamEvent.emit(this.selectedTeams);
  }

  addPlayer() {
    if(this.selectedTeams.length >= this.maxTeams || this.currentPlayer === null) {
      return;
    }

    const playerToAdd = this.copy(this.currentPlayer);

    //add to selected teams
    this.selectedTeams.push({
      name: playerToAdd.name,
      players: [playerToAdd]
    });
    this.selectedTeamEvent.emit(this.selectedTeams);

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

  removePlayer(teamIndex: number) {
    //add back to available
    const team = this.selectedTeams[teamIndex];
    this.availablePlayers.push(...team.players);

    //remove from selected
    this.selectedTeams.splice(teamIndex, 1);
    this.selectedTeamEvent.emit(this.selectedTeams);

    this.currentPlayer = this.availablePlayers[0];
  }

  updateCurrentPlayer(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedName = selectElement.options[selectElement.selectedIndex].text;

    const found = this.availablePlayers.find(p => p.name === selectedName);
    if(found) {
      this.currentPlayer = this.copy(found);
    }
  }

  makeHost(teamIndex: number) {
    if(!this.allowTeams) return;

    if(this.teamHostIndex === teamIndex) {
      this.teamHostIndex = -1;
    } else {
      this.teamHostIndex = teamIndex;
    }
  }

  getPlayers() {
    this.playerService.getPlayers().subscribe({
      next: res => {
        this.allPlayers = res;
        this.availablePlayers = this.allPlayers.map(player => this.copy(player));

        if(this.availablePlayers.length > 0) {
          this.currentPlayer = this.copy(this.availablePlayers[0]);
        }
      }
    });
  }

  openPlayerPopup() {
    this.playerPopup.openPopup();
  }

  private generateTeamName(players: PlayerDetails[]): string {
    if (players.length === 0) return '';
    if (players.length === 1) return players[0].name;

    return players.map(player => {
      return player.name.slice(0, 3);
    }).join('');
  }

  private copy<T>(obj: T): T {
    return {...obj};
  }
}
