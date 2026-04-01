import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EpisodeService } from '../../core/services/episode.service';
import { ApiService } from '../../core/services/api.services';
import { Episode } from '../../core/interfaces/episode.interface';
import { Character } from '../../core/models/character.model';
import { Breadcrumb } from '../../shared/components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'episode-details',
  imports: [Breadcrumb],
  templateUrl: 'episode-details.html',
  styleUrl: './episode-details.css',
})
export class EpisodeDetails implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private episodeService = inject(EpisodeService);
  private charatcerService = inject(ApiService);

  episode = signal<Episode | null>(null);
  characters = signal<Character[]>([]);
  isLoading = signal(true);

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
    this.episodeService.getEpisodeById(id).subscribe({
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
    this.charatcerService.GetCharactersFromUrls(urls).subscribe({
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
