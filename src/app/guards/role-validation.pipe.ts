import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'roleValidation'
})
export class RoleValidationPipe implements PipeTransform {
  transform(value: any, requiredRole: number): boolean {
    return value === requiredRole;
  }
}
