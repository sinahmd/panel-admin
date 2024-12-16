import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { AutheticationService } from '../../../core/auth/authetication.service';
import { MatCard, MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../../../core/models/user.medel';
import { SnackBarService } from '../../../core/services/snackbar.service';

@Component({
  selector: 'list',
  imports: [RouterModule, CommonModule, FormsModule, MatCard, MatCardModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
})
export class ListComponent implements OnInit {

  users: User[] = []
  isAdmin = false
  editingStates: any[] = [];

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
        console.error('Error fetching user role:', err);
        this.router.navigate(['/login']);
      }
    });


    if (this.authService.isAuthenticated()) {
      this.userService.getUsers().subscribe({
        next: (data) => {
          this.users = data;
        },
        error: (err) => {
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


  startEditing(index: number, item: any): void {
    if (!this.editingStates[index]) {
      this.editingStates[index] = { editingIndex: index, editingRow: { ...item } };
    }
  }
  // TODO: ask for add it or not?
  // deleteRow(index: number, userId: number): void {
  //   if (confirm('Are you sure you want to delete this user?')) {
  //     const userId = this.users[index].id;

  //     this.userService.deleteUser(userId).subscribe({
  //       next: () => {
  //         console.log('User deleted successfully');
  //         this.users.splice(index, 1);
  //       },
  //       error: (err) => {
  //         console.error('Error deleting user:', err);
  //       }
  //     });
  //   }
  // }

  saveEditing(index: number, item: any): void {
    const updatedUser = this.editingStates[index].editingRow;

    this.userService.updateUser(updatedUser).subscribe({
      next: (updatedUser) => {
        this.users[index] = updatedUser;
        this.cancelEditing(index);
        this.snackBarService.openSnackBar('Updated successfully', true)
      },
      error: (err) => {
        this.snackBarService.openSnackBar(`Updated failed: ${err.error || err.message}`, false);
      }
    });
  }


  cancelEditing(index: number): void {
    this.editingStates[index] = null;
  }
}
