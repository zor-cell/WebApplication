import {AbstractControl, ValidationErrors, ValidatorFn} from "@angular/forms";

export function minArrayLengthValidator(min: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;
        if (Array.isArray(value) && value.length >= min) {
            return null; // valid
        }
        return { minArrayLength: { requiredLength: min, actualLength: value?.length ?? 0 } };
    }
}