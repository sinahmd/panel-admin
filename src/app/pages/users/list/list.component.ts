import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { AutheticationService } from '../../../core/auth/authetication.service';
import { MatCard, MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../../../core/models/user.medel';
import { SnackBarService } from '../../../core/services/snackbar.service';
import { RolePipe } from '../../../core/pipes/role.pipe';

@Component({
  selector: 'list',
  imports: [RouterModule, CommonModule, FormsModule, MatCard, MatCardModule, RolePipe],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
})
export class ListComponent implements OnInit {

  users: User[] = []
  isAdmin: boolean = false

  constructor(
    private userService: UserService,
    private authService: AutheticationService,
    private router: Router,
    private snackBarService: SnackBarService
  ) { }

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    this.authService.getUserRole().subscribe({
      next: (role) => {
        this.isAdmin = role === 1;
      },
      error: (err) => {
        this.snackBarService.openSnackBar("you do not have permission", false)
        this.router.navigate(['/login']);
      }
    });


    if (this.authService.isAuthenticated()) {
      this.userService.getUsers().subscribe({
        next: (data) => {
          this.users = data;
        },
        error: (err) => {
          this.snackBarService.openSnackBar("Error fetching users", false)
          console.error('Error fetching users:', err);
        }
      });
    }
  }

  navigateToAdd(): void {
    if (this.isAdmin) {
      this.router.navigate(['/users/add']);
    }
  }

  navigateToEdit(userId: number): void {
    if (this.isAdmin) {
      this.router.navigate([`/users/edit/${userId}`]);
    } else {
      this.snackBarService.openSnackBar('you can not edit.', false);
    }
  }

  deleteUser(userId: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(userId).subscribe({
        next: () => {
          this.snackBarService.openSnackBar('User deleted successfully', true);
          this.userService.getUsers();  
        },
        error: (err) => {
          this.snackBarService.openSnackBar('Error deleting user', false);
          console.error('Error deleting user:', err);
        }
      });
    }
  }

}
