import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AutheticationService } from '../services/authetication.service';
import {  MatCardModule } from '@angular/material/card';
import { ListComponent } from '../users/list/list.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-home',
  imports: [MatCardModule,MatButtonModule,MatToolbarModule,RouterLink,ListComponent, RouterOutlet],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  isAdmin: boolean = false;
  isLoggedIn: boolean = false;
  constructor(private authService: AutheticationService, private router: Router) {}

  ngOnInit(): void {
    // this.isAdmin = this.authService.getUserRole() === 1; TODO: fix it
    console.log(this.authService.isAuthenticated(), "wht auth?")
    this.isLoggedIn = this.authService.isAuthenticated()
  }

  navigateToUsers() {
    console.log("Navigating to /home/users");
    this.router.navigate(['users'], { relativeTo: this.router.routerState.root });
  }

  navigateToAddUser() {
    if (this.isAdmin) {
      this.router.navigate(['/home/users/add']);
    } else {
      alert("You don't have permission to add users.");
    }
  }

  logout() {
    this.authService.logout(); 
    this.router.navigate(['/login']);
  }
}
