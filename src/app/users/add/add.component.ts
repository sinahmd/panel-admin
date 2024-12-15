import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { User } from '../../../models/user.medel';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatCardContent, MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Observer } from 'rxjs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
@Component({
  selector: 'app-add',
  imports: [
    FormsModule,
    MatInputModule,
    MatCardContent,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatSnackBarModule,
    MatSelectModule,
    MatFormFieldModule,
    MatIconModule,
    MatOptionModule,
  ],
  templateUrl: './add.component.html',
  styleUrl: './add.component.scss',
})
export class AddComponent {
  constructor(
    private userService: UserService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}
  ngOnInit(): void {}

  formGroup: FormGroup = new FormGroup<User>({
    mobile: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    username: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    firstName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    lastName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    role: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    nationalCode: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });
  openSnackBar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 2000,
      panelClass: ['error-snackbar'],
    });
  }

  userObserver: Observer<any> = {
    next: (res) => {
      this.userService.getUsers().subscribe({
        next: (users) => {
          console.log('Updated users:', users);
          this.router.navigate(['/users']);
        },
        error: (err) => {
          console.error('Error fetching updated users:', err);
        },
      });
    },
    error: (err: any) => {
      console.log(err, 'err');
      this.openSnackBar(`${err?.error?.error ?? err?.message}`);
    },
    complete: () => {},
  };

  onSubmit(): void {
    console.log(this.formGroup, 'formGroup');
    // this.userService.addUser(this.user);
    if (this.formGroup.invalid) {
      this.openSnackBar(`fill the fields`);
    }
    if (this.formGroup.valid) {
      this.userService
        .addUser(this.formGroup.value)
        .subscribe(this.userObserver);
    }
  }
}

