import {Component, inject, output} from '@angular/core';
import {NgbPopover} from "@ng-bootstrap/ng-bootstrap";
import {FormBuilder, ReactiveFormsModule} from "@angular/forms";
import {GameFilters} from "../../../dto/games/GameFilters";
import {Options} from "@popperjs/core";
import {GameType} from "../../../dto/games/GameType";
import {DurationPipe} from "../../../pipes/DurationPipe";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'game-search',
  imports: [
    NgbPopover,
    ReactiveFormsModule,
    NgForOf
  ],
  templateUrl: './game-search.component.html',
  standalone: true,
  styleUrl: './game-search.component.css'
})
export class GameSearchComponent {
  private fb = inject(FormBuilder);

  public changeFiltersEvent = output<GameFilters>();

  protected searchForm = this.fb.group({
    text: this.fb.control<string | null>(null),
    dateFrom: this.fb.control<Date | null>(null),
    dateTo: this.fb.control<Date | null>(null),
    minDuration: this.fb.control<string | null>(null),
    maxDuration: this.fb.control<string | null>(null),
    gameTypes: this.fb.control<GameType[] | null>(null),
  });
  protected popperOptions = (options: Partial<Options>) => {
    options.placement = 'bottom-end';

    return options;
  };
  protected isPopoverOpen: boolean = false;
  protected allGameTypes = Object.values(GameType);

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

  protected submit() {
    const filters = this.searchForm.getRawValue() as GameFilters;

    //apply ISO standards
    filters.dateFrom = filters.dateFrom ? new Date(filters.dateFrom).toISOString() : null;
    filters.dateTo = filters.dateTo ? new Date(filters.dateTo).toISOString() : null;
    filters.minDuration = filters.minDuration ? DurationPipe.toIsoFormat(filters.minDuration) : null;
    filters.maxDuration = filters.maxDuration ? DurationPipe.toIsoFormat(filters.maxDuration) : null;

    this.changeFiltersEvent.emit(filters);
  }
}
