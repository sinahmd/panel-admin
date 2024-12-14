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
          console.log(data,"daata")
          console.log(this.users,"this users")
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
    } else {
      this.router.navigate(['/home/users']);
    }
  }


  startEditing(index: number, item: any): void {
    if (!this.editingStates[index]) {
      this.editingStates[index] = { editingIndex: index, editingRow: { ...item } };
    }
  }

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
        console.log('User updated', updatedUser);
        this.users[index] = updatedUser;
        this.cancelEditing(index); 
      },
      error: (err) => {
        console.error('Error updating user:', err);
      }
    });
  }
  cancelEditing(index: number): void {
    this.editingStates[index] = null; 
  }

}
