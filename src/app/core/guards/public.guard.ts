import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';

export const publicGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (token) {
    router.navigateByUrl('/characters');
    return false;
  }
  return true;
};
