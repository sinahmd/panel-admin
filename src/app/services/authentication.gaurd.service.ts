import { Injectable } from '@angular/core';
import { AutheticationService } from './authetication.service';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationGaurdService implements CanActivate {
  constructor(private auth: AutheticationService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const requiredRole = route.data['roles']; // Get the required role from route data
    const currentRole = this.auth.getUserRole();
    if (this.auth.isAuthenticated() && currentRole === requiredRole) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
