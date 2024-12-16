import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackBarService {
  constructor(private snackBar: MatSnackBar) {}

  openSnackBar(message: string, isSuccess: boolean): void {
    const panelClass = isSuccess ? 'succuss-snackbar' : 'error-snackbar';
    this.snackBar.open(message, 'Close', {
      duration: 2000,
      panelClass: [panelClass],
    });
  }
}