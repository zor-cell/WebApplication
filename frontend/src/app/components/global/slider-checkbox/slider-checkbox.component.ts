import {Component, ElementRef, EventEmitter, Input, Output, Renderer2} from '@angular/core';

@Component({
  selector: 'app-slider-checkbox',
  imports: [],
  templateUrl: './slider-checkbox.component.html',
  standalone: true,
  styleUrl: './slider-checkbox.component.css'
})
export class SliderCheckboxComponent {
  @Input() isChecked: boolean = false;
  @Input() unCheckedText: string = 'F'
  @Input() checkedText: string = 'T';
  @Output() checkedEvent = new EventEmitter<boolean>

  constructor(private renderer: Renderer2, private el: ElementRef) {}

  get label() {
    const label = this.isChecked ? this.checkedText : this.unCheckedText;
    return '"' + label + '"';
  }

  updateChecked(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    this.isChecked = checkbox.checked;

    this.checkedEvent.emit(this.isChecked);
  }
}
