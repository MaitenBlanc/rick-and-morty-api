import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment.prod';

const BASE_URL = environment.baseUrl;

@Injectable({ providedIn: 'root' })
export class FavoriteService {
  private http = inject(HttpClient);
  private favoriteEpisodes = signal<Set<number>>(new Set());
  public isInitialLoadDone = signal(false);

  favoriteIds = computed(() => Array.from(this.favoriteEpisodes()));

  private baseUrl = `${BASE_URL}/favorites`;

  constructor() {
    if (localStorage.getItem('token')) {
      this.loadUserFavorites();
    } else {
      this.isInitialLoadDone.set(true);
    }
  }

  loadUserFavorites() {
    this.http.get<any[]>(this.baseUrl).subscribe({
      next: (data) => {
        const ids = data
          .map((item) => (typeof item === 'number' ? item : item.episodeId))
          .map(Number)
          .filter((id) => !isNaN(id) && id > 0);

        this.favoriteEpisodes.set(new Set(ids));
        this.isInitialLoadDone.set(true);
      },
      error: (err) => {
        console.error('Error loading favorites:', err);
        this.isInitialLoadDone.set(true);
      },
    });
  }

  toggleFavorite(episodeId: number) {
    const isAdding = !this.favoriteEpisodes().has(episodeId);

    this.favoriteEpisodes.update((favs) => {
      const newFavs = new Set(favs);

      isAdding ? newFavs.add(episodeId) : newFavs.delete(episodeId);

      return newFavs;
    });

    if (isAdding) {
      this.http.post(`${this.baseUrl}/${episodeId}`, {}).subscribe({
        error: (err) => {
          console.error('Error guardando favorito en BD:', err);
          this.revertFavoriteToggle(episodeId, false);
        },
      });
    } else {
      this.http.delete(`${this.baseUrl}/${episodeId}`).subscribe({
        error: (err) => {
          console.error('Error deleting favorite:', err);
          this.revertFavoriteToggle(episodeId, true);
        },
      });
    }
  }

  isFavorite(id: number): boolean {
    return this.favoriteEpisodes().has(id);
  }

  private revertFavoriteToggle(episodeId: number, shouldAdd: boolean) {
    this.favoriteEpisodes.update((favs) => {
      const newFavs = new Set(favs);
      shouldAdd ? newFavs.add(episodeId) : newFavs.delete(episodeId);
      return newFavs;
    });
  }
}
