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

  user: User[] = []
  isAdmin = false

  constructor(
    private userService: UserService,
    private authService: AutheticationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log(this.isAdmin,"is admin")
console.log(this.authService.isAuthenticated())
    this.isAdmin = this.authService.getUserRole() === 1;
    console.log(this.authService.getUserRole(), "rol?")

    this.userService.getUsers().subscribe((users) => (this.user = users));
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
