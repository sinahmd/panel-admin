import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { SnackBarService } from '../../../core/services/snackbar.service';
import { User } from '../../../core/models/user.medel';
import { MatCardContent, MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatOptionModule } from '@angular/material/core';

@Component({
  selector: 'app-user-form',
  imports: [
    FormsModule,
    MatInputModule,
    // MatCardContent,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatSnackBarModule,
    MatSelectModule,
    MatFormFieldModule,
    MatIconModule,
    MatOptionModule,
  ],
  templateUrl: './user.form.component.html',
  styleUrls: ['./user.form.component.scss'],
})
export class UserFormComponent implements OnInit {
  formGroup!: FormGroup;
  userId?: number;
  isEditMode = false;  

  constructor(
    private userService: UserService,
    private snackBarService: SnackBarService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.userId = +this.activatedRoute.snapshot.paramMap.get('id')!;
    this.isEditMode = !!this.userId;

    this.formGroup = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      role: new FormControl(0, [Validators.required]),
      nationalCode: new FormControl('', [Validators.required]),
      mobile: new FormControl('', [Validators.required]),
    });

    if (this.isEditMode) {
      this.loadUserData();
    }
  }

  loadUserData(): void {
    if (!this.userId) return;

    this.userService.getUserById(this.userId).subscribe({
      next: (user: User) => {
        this.formGroup.patchValue({
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          username: user.username || '',
          password: user.password || '',
          role: user.role || 0,
          nationalCode: user.nationalCode || '',
          mobile: user.mobile || '',
        });
      },
      error: (err) => {
        this.snackBarService.openSnackBar('Error fetching user data', false);
      }
    });
  }

  onSubmit(): void {
    if (this.formGroup.invalid) {
      this.snackBarService.openSnackBar('Please fill in all fields', false);
      return;
    }

    const formData = this.formGroup.value;
    const user: User = { ...formData };

    if (this.isEditMode && this.userId) {
      user.id = this.userId;
      this.userService.updateUser(user).subscribe({
        next: () => {
          this.snackBarService.openSnackBar('User updated successfully!', true);
          this.router.navigate(['/users']);
        },
        error: (err) => {
          this.snackBarService.openSnackBar('Error updating user', false);
        }
      });
    } else {
      this.userService.addUser(user).subscribe({
        next: () => {
          this.snackBarService.openSnackBar('User created successfully!', true);
          this.router.navigate(['/users']);
        },
        error: (err) => {
          this.snackBarService.openSnackBar('Error creating user', false);
        }
      });
    }
  }
}
