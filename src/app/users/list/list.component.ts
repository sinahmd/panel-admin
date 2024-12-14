import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AutheticationService } from '../../services/authetication.service';
import { MatCard, MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'list',
  imports: [RouterOutlet, RouterModule, CommonModule, FormsModule, MatCard, MatCardModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
})
export class ListComponent implements OnInit {

  users: any[] = []
  isAdmin = false
  editingStates: any[] = []; 

  constructor(
    private userService: UserService,
    private authService: AutheticationService,
    private router: Router
  ) { }
  // ngOnInit(){
  //   this.userService.getUsers().subscribe({
  //     next: (d) => {
  //       console.log(d)
  //       return this.users = d
  //     }
  //   })
  // }

  
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
      this.router.navigate(['/home/users/add']);
    } else {
      this.router.navigate(['/home/users']);
    }
  }


  startEditing(index: number, item: any): void {
    if (!this.editingStates[index]) {
      this.editingStates[index] = { editingIndex: index, editingRow: { ...item } };
    }
  }

  deleteRow(index: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.users.splice(index, 1);
      this.editingStates.splice(index, 1);  
    }
  }

  saveEditing(index: number, item: any): void {
    console.log('saved?', item);

  }
  cancelEditing(index: number): void {
    this.editingStates[index] = null; 
  }

}
