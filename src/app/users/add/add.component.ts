import { Component, OnInit } from '@angular/core';
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
import { SnackBarService } from '../../services/snackbar.service';
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
export class AddComponent implements OnInit {
  formGroup!: FormGroup;

  constructor(
    private userService: UserService,
    private snackBarService: SnackBarService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      role: new FormControl(0, [Validators.required]),
      nationalCode: new FormControl('', [Validators.required]),
      mobile: new FormControl('', [Validators.required]),
    });
  }

  onSubmit(): void {
    if (this.formGroup.invalid) {
      this.snackBarService.openSnackBar('Please fill in all fields', false);
      return;
    }

    const newUser: User = this.formGroup.value;

    this.userService.addUser(newUser).subscribe({
      next: (user) => {
        this.snackBarService.openSnackBar('User created successfully!', true);
        this.router.navigate(['/users'], { queryParams: { created: true } });
      },
      error: (err) => {
        console.error('Error creating user:', err);
        this.snackBarService.openSnackBar('Error creating user', false);
      },
    });
  }
}