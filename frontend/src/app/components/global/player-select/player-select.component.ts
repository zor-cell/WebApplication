import {ChangeDetectorRef, Component, Input, OnInit, QueryList, ViewChildren} from '@angular/core';
import {PlayerService} from "../../../services/player.service";
import {Globals} from "../../../classes/globals";
import {PlayerDetails} from "../../../dto/global/PlayerDetails";
import {NgForOf, NgIf} from "@angular/common";
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
    CdkDropListGroup
  ],
  templateUrl: './player-select.component.html',
  standalone: true,
  styleUrl: './player-select.component.css'
})
export class PlayerSelectComponent implements OnInit {
  @Input() minPlayers: number = 2;
  @Input() maxPlayers: number = 4;
  @Input() allowTeams: boolean = true;

  players: PlayerDetails[] = [];
  selectedPlayers: PlayerDetails[] = [{name: "avory"}, {name: "günther"}, {name: "test"}];
  selectedPlayer: PlayerDetails = {
    name: ''
  };
  team: PlayerDetails[] = [];

  playerIndex: number = -1;
  iconIndex: number = -1;

  constructor(private globals: Globals, private playerService: PlayerService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.playerService.getPlayers().subscribe({
      next: res => {
        this.players = res;
        if(this.players.length > 0) this.selectedPlayer.name = this.players[0].name;
      },
      error: err => {
        this.globals.handleError(err);
      }
    });
  }

  drop(event: CdkDragDrop<PlayerDetails[]>) {
    if(this.iconIndex >= 0) {
      console.log("dropped on icon" + this.iconIndex)
    }

    moveItemInArray(this.selectedPlayers, event.previousIndex, event.currentIndex);
  }

  sortPredicate(index: number, drag: CdkDrag, drop: CdkDropList) {
    console.log(index, drag, drop)

    return true;
  }

  sorted(event: CdkDragSortEvent<PlayerDetails[]>) {
    this.playerIndex = event.currentIndex;
    console.log(this.playerIndex)

    this.cdr.detectChanges();
  }

  iconEnter(iconIndex: number) {
    this.iconIndex = iconIndex;
  }

  iconLeave() {
    this.iconIndex = -1;
  }

  dragEnter(playerIndex: number) {
    this.playerIndex = playerIndex;
    console.log(this.playerIndex)
  }

  dragExit() {
    this.playerIndex = -1;
  }

  changePlayer(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedPlayer.name = selectElement.options[selectElement.selectedIndex].text;
  }

  addPlayer() {
    const player: PlayerDetails = {
      name: this.selectedPlayer.name
    }
    this.selectedPlayers.push(player);

    //const index = this.players.findIndex(p => p.name === this.selectedPlayer.name);
    //this.players.splice(index, 1);
  }

  protected readonly CdkDrag = CdkDrag;
  protected readonly Array = Array;
}
