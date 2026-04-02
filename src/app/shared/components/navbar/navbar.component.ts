import { Component, computed, DestroyRef, effect, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ApiService } from '../../../core/services/api.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, MatTooltipModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class Navbar {
  private authService = inject(AuthService);
  private apiService = inject(ApiService);
  private destroyRef = inject(DestroyRef);

  user = this.authService.user;

  isAdmin = computed(() => {
    const roles = this.user()?.roles;
    return roles ? roles.includes('admin') : false;
  });

  public counts = signal({
    characters: 0,
    episodes: 0,
  });

  constructor() {
    effect(() => {
      const user = this.user();
      if (user && this.counts().characters === 0) {
        this.fetchGlobalCounts();
      }
    });
  }

  fetchGlobalCounts() {
    this.apiService
      .getGlobalCounts()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
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
