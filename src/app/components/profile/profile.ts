import { Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import { FavoriteService } from '../../core/services/favorite.service';
import { EpisodeService } from '../../core/services/episode.service';
import { Episode } from '../../core/interfaces/episode.interface';
import { RouterLink } from '@angular/router';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'profile',
  providers: [provideNativeDateAdapter()],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    RouterLink,
    MatTooltip
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  public favoriteService = inject(FavoriteService);
  public episodeService = inject(EpisodeService);

  isEditing = signal(false);
  isPosting = signal(false);
  hasError = signal(false);
  favoriteEpisodesData = signal<Episode[]>([]);
  isLoadingFavorites = signal(true);

  user = this.authService.user;
  defaultImg = 'assets/img/avatar.svg';

  public profileForm = this.fb.group({
    nickname: [this.user()?.nickname || ''],
    imgProfile: [this.user()?.imgProfile || '', [Validators.required]],
    city: [this.user()?.city || '', [Validators.minLength(3)]],
    state: [this.user()?.state || '', [Validators.minLength(3)]],
    birthdate: [this.user()?.birthdate || ''],
  });

  constructor() {
    effect(
      () => {
        const isLoadedFromDB = this.favoriteService.isInitialLoadDone();
        const ids = this.favoriteService.favoriteIds();

        if (!isLoadedFromDB) {
          this.isLoadingFavorites.set(true);
          return;
        }

        if (ids.length === 0) {
          this.favoriteEpisodesData.set([]);
          this.isLoadingFavorites.set(false);
          return;
        }

        this.isLoadingFavorites.set(true);

        this.episodeService.getEpisodesMultiple(ids).subscribe({
          next: (episodes) => {
            this.favoriteEpisodesData.set(episodes);
            this.isLoadingFavorites.set(false);
          },
          error: (err) => {
            this.isLoadingFavorites.set(false);
          },
        });
      }
    );
  }

  // Métodos para favoritos
  loadFavorites() {
    this.isLoadingFavorites.set(true);

    const ids = this.favoriteService.favoriteIds();

    if (ids.length === 0) {
      setTimeout(() => {
        this.favoriteEpisodesData.set([]);
        this.isLoadingFavorites.set(false);
      }, 800);
      return;
    }

    this.episodeService.getEpisodesMultiple(ids).subscribe({
      next: (episodes) => {
        this.favoriteEpisodesData.set(episodes);
        this.isLoadingFavorites.set(false);
      },
      error: (err) => {
        console.error('Error loading favorite episodes:', err);
        this.isLoadingFavorites.set(false);
      },
    });
  }

  removeFavorite(episodeId: number) {
    this.favoriteService.toggleFavorite(episodeId);
    this.favoriteEpisodesData.update((episodes) => episodes.filter((ep) => ep.id !== episodeId));
  }

  private loadFavoritesEffect = effect(() => {
    const isLoadedFromDB = this.favoriteService.isInitialLoadDone();
    const ids = this.favoriteService.favoriteIds();

    if (!isLoadedFromDB) {
      this.isLoadingFavorites.set(true);
      return;
    }

    if (ids.length === 0) {
      this.favoriteEpisodesData.set([]);
      this.isLoadingFavorites.set(false);
      return;
    }

    this.isLoadingFavorites.set(true);

    this.episodeService.getEpisodesMultiple(ids).subscribe({
      next: (episodes) => {
        this.favoriteEpisodesData.set(episodes);
        this.isLoadingFavorites.set(false);
      },
      error: (err) => {
        console.error('Error loading favorite episodes:', err);
        this.isLoadingFavorites.set(false);
      },
    });
  });

  // Métodos del perfil
  onUpdateProfile() {
    if (this.profileForm.invalid) return;
    console.log('Profile updated', this.profileForm.value);
  }

  toggleEdit() {
    this.isEditing.update((val) => !val);
  }

  onSave() {
    if (this.profileForm.invalid || !this.user()?.id) {
      this.showError();
      return;
    }

    this.isPosting.set(true);
    const updatedData = this.profileForm.getRawValue() as any;

    const body = {
      ...updatedData,
      birthdate:
        updatedData.birthdate instanceof Date
          ? updatedData.birthdate.toISOString().split('T')[0]
          : updatedData.birthdate,
    };

    this.authService.updateProfile(this.user()!.id, body).subscribe({
      next: (user) => {
        console.log('DB updated', user);
        this.isEditing.set(false);
        this.isPosting.set(false);
      },
      error: (err) => {
        console.error('Error:', err);
        this.isPosting.set(false);
        this.showError();
      },
    });

    console.log('Profile saved', updatedData);
    this.isEditing.set(false);
    this.isPosting.set(true);
  }

  private showError() {
    this.hasError.set(true);
    setTimeout(() => this.hasError.set(false), 2000);
  }
}
