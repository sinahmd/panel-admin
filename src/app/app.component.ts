import { Component } from '@angular/core';
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
export class AppComponent {
  title = 'crud';
  isLoggedIn: boolean = false;
  isLoginPage: boolean = false;
  isAdmin: boolean = false;

  constructor(private auth: AutheticationService, private router: Router) { }
  ngOnInit(): void {
    this.auth.getUserRole().subscribe({
      next: (role) =>{
        this.isAdmin = role === 1
      }
    })
    this.isLoggedIn = this.auth.isAuthenticated()
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.isLoginPage = this.router.url === '/login';
      });
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
