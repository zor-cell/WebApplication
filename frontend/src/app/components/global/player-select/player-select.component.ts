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
import {Team} from "../../../dto/global/Team";

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

  @Output() selectedTeamEvent = new EventEmitter<Team[]>();

  allPlayers: PlayerDetails[] = []
  availablePlayers: PlayerDetails[] = [];
  selectedTeams: Team[] = [];

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
      },
      error: err => {
        this.globals.handleError(err);
      }
    });
  }

  drop(event: CdkDragDrop<Team[]>) {
    moveItemInArray(this.selectedTeams, event.previousIndex, event.currentIndex);

    this.selectedTeamEvent.emit(this.selectedTeams);
  }

  mergeTeam(teamIndex: number) {
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

  private generateTeamName(players: PlayerDetails[]): string {
    if (players.length === 0) return '';
    if (players.length === 1) return players[0].name;

    return players.map(player => {
      const name = player.name.slice(0, 3);
      return  name;
    }).join('');
  }

  makeHost(teamIndex: number) {
    if(this.teamHostIndex === teamIndex) {
      this.teamHostIndex = -1;
    } else {
      this.teamHostIndex = teamIndex;
    }
  }

  changePlayer(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedName = selectElement.options[selectElement.selectedIndex].text;

    const found = this.availablePlayers.find(p => p.name === selectedName);
    if(found) {
      this.currentPlayer = this.copy(found);
    }
  }

  addPlayer() {
    if(this.selectedTeams.length >= this.maxPlayers || this.currentPlayer === null) {
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

  private copy<T>(obj: T): T {
    return {...obj};
  }
}
