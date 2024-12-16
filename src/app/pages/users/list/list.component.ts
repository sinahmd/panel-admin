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
        console.log(role, "role in list");
        this.isAdmin = role === 1;
        console.log('isAdmin:', this.isAdmin);
      },
      error: (err) => {
        console.error('Error fetching user role:', err);
        this.router.navigate(['/login']);
      }
    });


    if (this.authService.isAuthenticated()) {
      this.userService.getUsers().subscribe({
        next: (data) => {
          console.log('fetched users:', data);
          this.users = data;
          console.log(data, "daata")
          console.log(this.users, "this users")
        },
        error: (err) => {
          console.error('Error fetching users:', err);
        }
      });
    } else {
      console.log('You are not authorized to view this page.');
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

    if (!updatedUser.firstName || !updatedUser.lastName || !updatedUser.role || !updatedUser.nationalCode || !updatedUser.mobile || !updatedUser.password) {
      this.snackBarService.openSnackBar('Please fill required fields.', false);
      this.markFieldsAsInvalid(index);
      return;
    }

    this.userService.updateUser(updatedUser).subscribe({
      next: (updatedUser) => {
        console.log('User updated', updatedUser);
        this.users[index] = updatedUser;
        this.cancelEditing(index);
        this.snackBarService.openSnackBar('Updated successfully', true)
      },
      error: (err) => {
        this.snackBarService.openSnackBar(`Updated failed: ${err.error || err.message}`, false);

      }
    });
  }

  markFieldsAsInvalid(index: number): void {
    const user = this.editingStates[index].editingRow;

    this.editingStates[index].invalidFields = {
      firstName: !user.firstName,
      lastName: !user.lastName,
      role: !user.role,
      nationalCode: !user.nationalCode,
      mobile: !user.mobile,
      password: !user.password
    };
  }

  cancelEditing(index: number): void {
    this.editingStates[index] = null;
  }
}
