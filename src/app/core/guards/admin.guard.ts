import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanMatchFn = (route, segments) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.user();
  if (user && user.roles.includes('admin')) {
    return true;
  }

  return router.createUrlTree(['/']);
};
