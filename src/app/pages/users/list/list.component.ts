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

  navigateToEdit(userId: number): void {
    if (this.isAdmin) {
      this.router.navigate([`/users/edit/${userId}`]);
    } else {
      this.snackBarService.openSnackBar('you can not edit.', false);
    }
  }

  startEditing(userId: number): void {
    this.router.navigate([`/users/edit/${userId}`]);
  }
  
}
