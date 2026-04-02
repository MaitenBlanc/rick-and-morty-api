import { CommonModule } from '@angular/common';
import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EpisodeService } from '../../core/services/episode.service';
import { ApiService } from '../../core/services/api.service';
import { Episode } from '../../core/interfaces/episode.interface';
import { Character } from '../../core/models/character.model';
import { Breadcrumb } from '../../shared/components/breadcrumb/breadcrumb.component';
import { FavoriteService } from '../../core/services/favorite.service';
import { EpisodeComments } from '../episode-comments/episode-comments';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'episode-details',
  imports: [CommonModule, Breadcrumb, EpisodeComments],
  templateUrl: 'episode-details.html',
  styleUrl: './episode-details.css',
})
export class EpisodeDetails implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private episodeService = inject(EpisodeService);
  private charatcerService = inject(ApiService);
  public favoriteService = inject(FavoriteService);
  private destroyRef = inject(DestroyRef);

  public episode = signal<Episode | null>(null);
  public characters = signal<Character[]>([]);
  public isLoading = signal(true);

  breadcrumbSteps = computed(() => {
    const currentEpisode = this.episode();

    if (currentEpisode) {
      return [
        // { label: 'Home', url: '/' },
        { label: 'Episodes', url: '/episodes' },
        { label: `Episode ${currentEpisode.id} - ${currentEpisode.name}` },
      ];
    }

    return [{ label: 'Episodes', url: '/episodes' }, { label: 'Loading details...' }];
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadEpisodeData(id);
    }
  }

  loadEpisodeData(id: string) {
    this.episodeService
      .getEpisodeById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (ep) => {
          this.episode.set(ep);
          this.loadCharacters(ep.characters);
        },
        error: () => {
          this.episode.set(null);
          this.router.navigate(['/404']);
        },
      });
  }

  loadCharacters(urls: string[]) {
    this.charatcerService
      .GetCharactersFromUrls(urls)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (chars) => {
          this.characters.set(chars);
          this.isLoading.set(false);
        },
        error: (err) => {
          console.log('Error loading characters: ', err);
          this.isLoading.set(false);
        },
      });
  }

  navigateToCharacters(id: number) {
    this.router.navigate(['/characters', id]);
  }
}
