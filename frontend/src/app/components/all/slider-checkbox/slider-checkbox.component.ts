import {Component, effect, EventEmitter, forwardRef, input, output, Output} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
    selector: 'app-slider-checkbox',
    imports: [],
    templateUrl: './slider-checkbox.component.html',
    standalone: true,
    styleUrl: './slider-checkbox.component.css',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SliderCheckboxComponent),
            multi: true
        }
    ]
})
export class SliderCheckboxComponent implements ControlValueAccessor {
    unCheckedText = input('F');
    checkedText = input('T');
    isChecked = input(false);
    checkedEvent = output<boolean>();

    protected isCheckedLocal: boolean = false;
    private onChange: (value: boolean) => void = () => {};

    constructor() {
        effect(() => {
            //this.isCheckedLocal = this.isChecked();
        })
    }

    get label() {
        const label = this.isCheckedLocal ? this.checkedText() : this.unCheckedText();
        return '"' + label + '"';
    }

    writeValue(value: boolean): void {
        this.isCheckedLocal = value;
    }

    registerOnChange(fn: (value: boolean) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        //throw new Error('Method not implemented.');
    }

    setDisabledState?(isDisabled: boolean): void {
        //throw new Error('Method not implemented.');
    }

    updateChecked(event: Event) {
        const checkbox = event.target as HTMLInputElement;
        this.isCheckedLocal = checkbox.checked;

        this.checkedEvent.emit(this.isCheckedLocal);
        this.onChange(this.isCheckedLocal);
    }
}
