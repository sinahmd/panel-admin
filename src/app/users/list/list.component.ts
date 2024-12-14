import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AutheticationService } from '../../services/authetication.service';
import { MatCard, MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-list',
  imports: [RouterOutlet, RouterModule, MatCard, MatCardModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
})
export class ListComponent implements OnInit {
  users: any[] = [];
  isAdmin = false;

  constructor(
    private userService: UserService,
    private authService: AutheticationService,
    private router: Router
  ) {}

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
      this.router.navigate(['/users/add']);
    } else {
      this.router.navigate(['/users']);
    }
  }
}
