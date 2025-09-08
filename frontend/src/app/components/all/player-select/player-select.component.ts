import {
    Component, computed, effect,
    forwardRef,
    inject,
    input,
    Input,
    OnChanges,
    OnInit, signal,
    SimpleChanges,
    viewChild,
    ViewChild
} from '@angular/core';
import {PlayerService} from "../../../services/player.service";
import {PlayerDetails} from "../../../dto/all/PlayerDetails";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule} from "@angular/forms";
import {CdkDrag, CdkDragDrop, CdkDragPreview, CdkDropList, moveItemInArray} from "@angular/cdk/drag-drop";
import {Team} from "../../../dto/all/Team";
import {NewPlayerPopupComponent} from "../popups/new-player-popup/new-player-popup.component";
import {AuthService} from "../../../services/all/auth.service";

@Component({
    selector: 'app-player-select',
    imports: [
        NgForOf,
        FormsModule,
        NgIf,
        CdkDrag,
        CdkDropList,
        CdkDragPreview,
        NgClass,
        ReactiveFormsModule,
        NewPlayerPopupComponent,
        NewPlayerPopupComponent
    ],
    templateUrl: './player-select.component.html',
    standalone: true,
    styleUrl: './player-select.component.css',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => PlayerSelectComponent),
            multi: true
        }
    ]
})
export class PlayerSelectComponent implements ControlValueAccessor, OnInit {
    private playerService = inject(PlayerService);
    protected authService = inject(AuthService);

    playerPopup = viewChild.required<NewPlayerPopupComponent>('playerPopup');
    minTeams = input<number>(2);
    maxTeams = input<number>(4);
    allowTeams = input<boolean>(true);

    allPlayers = signal<PlayerDetails[]>([]);
    selectedTeams = signal<Team[]>([]);
    availablePlayers = computed(() => {
        const all = this.allPlayers();
        const taken = this.selectedTeams().flatMap(t => t.players.map(p => p.id));
        return all.filter(p => !taken.includes(p.id)).sort((a,b) => a.name.localeCompare(b.name));
    });

    teamHostIndex = signal<number>(-1);
    currentPlayer = signal<PlayerDetails | null>(null);

    private onChange: (value: Team[]) => void = () => {};

    constructor() {
        effect(() => {
            if(this.availablePlayers()) {
                this.currentPlayer.set(this.availablePlayers()[0]);
            }
        });
    }

    writeValue(value: Team[]): void {
        this.selectedTeams.set(value.map(team => ({
            name: team.name,
            players: team.players.map(p => ({...p}))
        })))
    }

    registerOnChange(fn: (value: Team[]) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {

    }

    setDisabledState?(isDisabled: boolean): void {

    }

    ngOnInit() {
        this.getPlayers();
    }

    mergeTeam(teamIndex: number) {
        if (!this.allowTeams()) return;

        const hostIndex = this.teamHostIndex();
        if (hostIndex >= 0) {
            const teams  = this.selectedTeams();
            const hostTeam = teams[hostIndex]
            const memberTeam = this.copy(teams[teamIndex]);

            //merge team
            hostTeam.name = this.generateTeamName([...hostTeam.players, ...memberTeam.players]);
            hostTeam.players.push(...memberTeam.players);

            this.teamHostIndex.set(-1);

            teams.splice(teamIndex, 1);
            this.selectedTeams.set(teams);
            this.onChange(this.selectedTeams());
        }
    }

    //drag and drop reordering logic
    drop(event: CdkDragDrop<Team[]>) {
        const teams = [...this.selectedTeams()];
        moveItemInArray(teams, event.previousIndex, event.currentIndex);

        this.selectedTeams.set(teams);
        this.onChange(this.selectedTeams());
    }

    addPlayer() {
        const player = this.currentPlayer();
        if (this.selectedTeams().length >= this.maxTeams() || player === null) {
            return;
        }

        const playerToAdd = this.copy(player);

        //add to selected teams
        this.selectedTeams.update(teams => {
            return [...teams, {name: playerToAdd.name, players: [playerToAdd]}]
        })
        this.onChange(this.selectedTeams());
    }

    removePlayer(teamIndex: number) {
        const teams = [...this.selectedTeams()];
        teams.splice(teamIndex, 1);

        this.selectedTeams.set(teams);
        this.onChange(this.selectedTeams());
    }

    updateCurrentPlayer(event: Event) {
        const selectElement = event.target as HTMLSelectElement;
        const selectedId = selectElement.options[selectElement.selectedIndex].value;

        const found = this.availablePlayers().find(p => p.id === selectedId);
        if (found) {
            this.currentPlayer.set(this.copy(found))
        }
    }

    makeHost(teamIndex: number) {
        if (!this.allowTeams()) return;

        this.teamHostIndex.update(index => index === teamIndex ? -1 : teamIndex);
    }

    getPlayers() {
        this.playerService.getPlayers().subscribe({
            next: res => {
                this.allPlayers.set(res);
            }
        });
    }

    openPlayerPopup() {
        this.playerPopup().openPopup();
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
