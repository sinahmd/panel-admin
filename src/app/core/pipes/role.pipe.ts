import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'role'
})
export class RolePipe implements PipeTransform {
  transform(value: number): string {
    if (value === 1) {
      return 'Admin';
    } else if (value === 0) {
      return 'Normal';
    }
    return 'Unknown';
  }
}