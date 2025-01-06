import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AutheticationService } from './core/auth/authetication.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
imports: [
    RouterOutlet,
    RouterLink,
    MatSnackBarModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'crud';
  isLoggedIn: boolean = false;
  isLoginPage: boolean = false;
  isAdmin: boolean = false;
  isLoading: boolean = true; 

  constructor(private auth: AutheticationService, private router: Router) {}

  ngOnInit(): void {

    this.auth.getUserRole().subscribe({
      next: (role) => {
        this.isAdmin = role === 1;
        this.isLoggedIn = this.auth.isAuthenticated(); 
        this.isLoading = false; 
      },

      error: () => {
        this.isLoggedIn = false;
        this.isLoading = false;
      }
    });

    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.isLoginPage = this.router.url === '/login';
    });
  }


  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

}
