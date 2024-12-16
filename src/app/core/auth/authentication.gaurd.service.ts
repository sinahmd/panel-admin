import { Injectable } from '@angular/core';
import { AutheticationService } from './authetication.service';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable, map, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationGaurdService implements CanActivate {
  constructor(private auth: AutheticationService, private router: Router) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const requiredRole = route.data['roles']; 
    return this.auth.getUserRole().pipe(
      take(1), 
      map(currentRole => {
        
        if (this.auth.isAuthenticated() && requiredRole === currentRole) { 
          return true;
        } else {
          this.router.navigate(['/login']);
          return false;
        }
      })
    );
  }
}
