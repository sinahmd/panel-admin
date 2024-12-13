import { CanActivateFn, Router } from '@angular/router';
import { AutheticationService } from '../services/authetication.service';
import { inject } from '@angular/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
export const roleGuard: CanActivateFn = (route, state) => {
  const roles = route.data[0] as number;
  const authService = inject(AutheticationService);
  const router = inject(Router);
  const matSnackBar = inject(MatSnackBarModule);
  const mat = inject(MatSnackBar);
  const userRole = authService.getUserRole();
  if (!authService.isAuthenticated()) {
    router.navigate(['/login']);

    return false;
  }
  if (roles === 1) return true;

  router.navigate(['/']);
  mat.open('you do not have permission');

  return false;
};
