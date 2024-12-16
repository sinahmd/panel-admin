import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { SnackBarService } from '../../../core/services/snackbar.service';
import { User } from '../../../core/models/user.medel';
import { MatCardContent, MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-edit',
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
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  formGroup!: FormGroup;
  userId!: number;

  constructor(
    private userService: UserService,
    private snackBarService: SnackBarService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.userId = +this.activatedRoute.snapshot.paramMap.get('id')!;

    this.formGroup = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      role: new FormControl(0, [Validators.required]),
      nationalCode: new FormControl('', [Validators.required]),
      mobile: new FormControl('', [Validators.required]),
    });

    this.loadUserData();
  }

  loadUserData(): void {
    this.userService.getUserById(this.userId).subscribe({
      next: (user: User) => {
        console.log(user,"suer edit")
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

    const updatedUser: User = { ...this.formGroup.value, id: this.userId };

    this.userService.updateUser(updatedUser).subscribe({
      next: (updatedUser) => {
        this.snackBarService.openSnackBar('User updated successfully!', true);
        this.router.navigate(['/users']);
      },
      error: (err) => {
        this.snackBarService.openSnackBar('Error updating user', false);
      }
    });
  }
}

