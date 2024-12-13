import { Component } from '@angular/core';
import { User } from '../../../models/user.medel';
import { AutheticationService } from '../../services/authetication.service';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { UserService } from '../../services/user.service';
import { MatCard, MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-list',
  imports: [RouterOutlet,RouterModule, MatCard,MatCardModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {

  users: any[] = []
  isAdmin = false
  constructor(
    private userService: UserService,
    private authService: AutheticationService,
    private router: Router
  ) {}
  // ngOnInit(){
  //   this.userService.getUsers().subscribe({
  //     next: (d) => {
  //       console.log(d)
  //       return this.users = d
  //     }
  //   })
  // }
  
  ngOnInit(): void {
    // Check if the user is authenticated and if they have the Admin role
    this.isAdmin = this.authService.getUserRole() === 1;
    console.log('isAdmin:', this.isAdmin);

    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }


    this.userService.getUsers().subscribe({
      next: (data) => {
        console.log('fetchedusers', data);
        this.users = data; 
      },
      error: (err) => {
        console.error('erroor', err);
      }
    });
  }

  onDelete(userId: number): void {
    this.userService.deleteUser(userId);
  }

  navigateToAdd(): void {
    if (this.isAdmin) {
      this.router.navigate(['/users/add']);
    } else {
      this.router.navigate(['/users']);
    }
  }
 
}
