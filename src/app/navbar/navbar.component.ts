import { Component } from '@angular/core';
import { AutheticationService } from '../services/authetication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  isLoggedIn = false;
  isAdmin = false;

  constructor(private authService: AutheticationService, private router: Router) {}
  ngOnInit(): void {
    this.isLoggedIn = this.authService.isAuthenticated();  // Check login status
    this.isAdmin = this.authService.getUserRole() === 1;   // Check if user is an admin
  }
  logout(): void {
    this.authService.logout();  
  }
  goToUserList(): void {
    this.router.navigate(['/users']);
  }

  goToProductList(): void {
    this.router.navigate(['/products']); 
  }

  goToAddUser(): void {
    this.router.navigate(['/users/add']); 
  }

}
