import {Component, inject, input, OnInit, output, signal} from '@angular/core';
import {NgbPopover} from "@ng-bootstrap/ng-bootstrap";
import {FormBuilder, ReactiveFormsModule} from "@angular/forms";
import {GameFilters} from "../../../dto/games/GameFilters";
import {Options} from "@popperjs/core";
import {GameType} from "../../../dto/games/GameType";
import {DurationPipe} from "../../../pipes/DurationPipe";
import {NgForOf, NgIf} from "@angular/common";
import {PlayerService} from "../../../services/player.service";
import {PlayerDetails} from "../../../dto/all/PlayerDetails";

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

  public showMultiGameTypes = input<boolean>(true);
  public changeFiltersEvent = output<GameFilters>();

  protected players = signal<PlayerDetails[]>([]);
  protected searchForm = this.fb.group({
    text: this.fb.control<string | null>(null),
    dateFrom: this.fb.control<Date | null>(null),
    dateTo: this.fb.control<Date | null>(null),
    minDuration: this.fb.control<string | null>(null),
    maxDuration: this.fb.control<string | null>(null),
    gameTypes: this.fb.control<GameType[] | null>(null),
    players: this.fb.control<string[] | null>(null)
  });
  protected popperOptions = (options: Partial<Options>) => {
    options.placement = 'bottom-end';

    return options;
  };
  protected isPopoverOpen: boolean = false;
  protected allGameTypes = Object.values(GameType);

  ngOnInit() {
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
