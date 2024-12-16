import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function notEmptyValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    return control.value && control.value.trim() ? null : { notEmpty: true };
  };
}