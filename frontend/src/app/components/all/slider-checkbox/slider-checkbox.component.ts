import {Component, effect, forwardRef, input, output} from '@angular/core';
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

    protected isChecked: boolean = false;
    private onChange: (value: boolean) => void = () => {};

    get label() {
        const label = this.isChecked ? this.checkedText() : this.unCheckedText();
        return '"' + label + '"';
    }

    writeValue(value: boolean): void {
        this.isChecked = value;
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
        this.isChecked = checkbox.checked;

        this.onChange(this.isChecked);
    }
}
