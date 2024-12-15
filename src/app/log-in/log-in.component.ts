import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AutheticationService } from '../services/authetication.service';
import { UserService } from '../services/user.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Login } from '../../models/login.model';
import { Observer } from 'rxjs';


@Component({
  selector: 'app-log-in',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    FormsModule,
    MatCard,
    MatIconModule,
    MatInputModule,
    MatSnackBarModule,
    MatCardModule,
  ],
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss'],
})
export class LogInComponent {

  constructor(
    private auth: AutheticationService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) { }
  formGroup: FormGroup = new FormGroup<Login>({
    username: new FormControl("",
      {
        nonNullable: true,
        validators: [Validators.required]
      }
    ),
    password: new FormControl("",
      {
        nonNullable: true,
        validators: [Validators.required]
      }
    )
  })
  openSnackBar(message: string, isSuccuss: boolean): void {
    const planeClass = isSuccuss ? "succuss-snackbar" : "error-snackbar"
    this.snackBar.open(message, 'Close', {
      duration: 2000,
      panelClass: [planeClass],
    });
  }

  onLogin(): void {
    console.log(this.formGroup, "valid");

    if (this.formGroup.invalid) {
      this.openSnackBar(`fill the fields`, false);
    }
    if (this.formGroup.valid) {
      this.auth.login(this.formGroup.value.username, this.formGroup.value.password).subscribe({

        next: () => {
          this.auth.getUserRole().subscribe(role => {

            this.router.navigate(['/users']);
            this.openSnackBar('Logedin successfully', true)
          });
        },
        error: (err: any) => {
          this.openSnackBar(`Login failed: ${err || err.error || err.message}`, false);
        },
      });
    }
  }
}
