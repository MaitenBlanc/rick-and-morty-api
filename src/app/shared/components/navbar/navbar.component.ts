import { Component, effect, inject, signal } from '@angular/core';
import {RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ApiService } from '../../../core/services/api.services';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class Navbar {
  authService = inject(AuthService);
  private apiService = inject(ApiService);

  user = this.authService.user;

  counts = signal({
    characters: 0,
    episodes: 0,
  });

  constructor() {
    effect(() => {
      const user = this.authService.user();
      if (user && this.counts().characters === 0) {
        this.fetchGlobalCounts();
      }
    });
  }

  fetchGlobalCounts() {
    this.apiService.getGlobalCounts().subscribe({
      next: (res) => {
        this.counts.set(res);
      },
      error: (error) => {
        console.error('Error fetching counts:', error);
      },
    });
  }

  onLogout() {
    this.authService.logout();
  }
}
