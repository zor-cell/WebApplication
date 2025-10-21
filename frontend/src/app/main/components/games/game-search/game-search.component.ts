import {Component, inject, input, OnInit, output, signal} from '@angular/core';
import {NgbPopover} from "@ng-bootstrap/ng-bootstrap";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {GameFilters} from "../../../dto/games/GameFilters";
import {Options} from "@popperjs/core";
import {GameType} from "../../../dto/games/GameType";
import {DurationPipe} from "../../../pipes/DurationPipe";
import {NgForOf, NgIf} from "@angular/common";
import {PlayerService} from "../../../services/player.service";
import {PlayerDetails} from "../../../dto/all/PlayerDetails";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'game-search',
  imports: [
    NgbPopover,
    ReactiveFormsModule,
    NgForOf,
    NgIf
  ],
  templateUrl: './game-search.component.html',
  standalone: true,
  styleUrl: './game-search.component.css'
})
export class GameSearchComponent implements OnInit {
  private fb = inject(FormBuilder);
  private playerService = inject(PlayerService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  public showMultiGameTypes = input<boolean>(true);
  public changeFiltersEvent = output<GameFilters>();

  protected players = signal<PlayerDetails[]>([]);
  protected searchForm = this.fb.group({
    text: this.fb.control<string | null>(null),
    dateFrom: this.fb.control<Date | null>(null),
    dateTo: this.fb.control<Date | null>(null),
    minDuration: this.fb.control<string | null>(null),
    maxDuration: this.fb.control<string | null>(null),
    gameTypes: this.fb.control<GameType[] | null>(null, Validators.required),
    players: this.fb.control<string[] | null>(null, Validators.required)
  });
  protected popperOptions = (options: Partial<Options>) => {
    options.placement = 'bottom-end';

    return options;
  };
  protected isPopoverOpen: boolean = false;
  protected allGameTypes = Object.values(GameType);

  ngOnInit() {
    const params = this.route.snapshot.queryParams;

    const filters: any = {
      text: params['text'] ?? null,
      dateFrom: params['dateFrom'] ? new Date(params['dateFrom']) : null,
      dateTo: params['dateTo'] ? new Date(params['dateTo']) : null,
      minDuration: params['minDuration'] ?? null,
      maxDuration: params['maxDuration'] ?? null,
      gameTypes: [params['gameTypes'] ?? null],
      players: [params['players'] ?? null]
    };

    if(filters.gameTypes.every((x: GameType[] | null) => x !== null) && filters.players.every((x: string | null) => x !== null)) {
      this.searchForm.setValue(filters, {emitEvent: false});
      this.submit();
    }

    this.searchForm.valueChanges.subscribe(filters => {
      const queryParams: any = {
        text: filters.text,
        dateFrom: filters.dateFrom,
        dateTo: filters.dateTo,
        minDuration: filters.minDuration,
        maxDuration: filters.maxDuration,
        gameTypes: filters.gameTypes,
        players: filters.players,
      };

      this.router.navigate([], {
        relativeTo: this.route,
        queryParams,
        queryParamsHandling: "merge",
        replaceUrl: true
      });
    });

    this.getPlayers();
  }

  protected popOverOpen() {
    this.isPopoverOpen = true;
  }

  protected popOverClose() {
    this.isPopoverOpen = false;
  }

  protected clear() {
    this.searchForm.reset({
      text: this.searchForm.controls.text.value
    });
  }

  protected submit(popover: NgbPopover | null = null) {
    const filters = this.searchForm.getRawValue() as GameFilters;

    if(this.searchForm.invalid) return;


    //apply ISO standards
    filters.dateFrom = filters.dateFrom ? new Date(filters.dateFrom).toISOString() : null;
    filters.dateTo = filters.dateTo ? new Date(filters.dateTo).toISOString() : null;
    filters.minDuration = filters.minDuration ? DurationPipe.toIsoFormat(filters.minDuration) : null;
    filters.maxDuration = filters.maxDuration ? DurationPipe.toIsoFormat(filters.maxDuration) : null;

    this.changeFiltersEvent.emit(filters);

    if(popover) {
      popover.close();
    }
  }

  private getPlayers() {
    this.playerService.getPlayers().subscribe(res => {
      this.players.set(res);
    })
  }
}
