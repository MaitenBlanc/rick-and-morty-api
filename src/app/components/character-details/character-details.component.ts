import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Character } from '../../core/models/character.model';
import { ApiService } from '../../core/services/api.service';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { Breadcrumb } from '../../shared/components/breadcrumb/breadcrumb.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-character-details',
  standalone: true,
  imports: [CommonModule, Breadcrumb, TranslatePipe],
  templateUrl: './character-details.component.html',
  styleUrl: './character-details.component.css',
})
export class CharacterDetails implements OnInit {
  private route = inject(ActivatedRoute);
  private apiService = inject(ApiService);
  private destroyRef = inject(DestroyRef);

  public character = signal<Character | null>(null);
  public episodes = signal<any[]>([]);
  public showAllEpisodes = signal<boolean>(false);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.apiService
        .getCharacterById(+idParam)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (data) => {
            this.character.set(data);
            this.loadEpisodes(data.episode);
          },
          error: (err) => console.error('Error: ', err),
        });
    }
  }

  loadEpisodes(urls: string[]): void {
    const urlsToFetch = this.showAllEpisodes() ? urls : urls.slice(0, 15);

    this.apiService
      .getEpisodesMetadata(urlsToFetch)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.episodes.set(Array.isArray(data) ? data : [data]);
        },
        error: (err) => console.error('Error: ', err),
      });
  }

  onShowMore(): void {
    this.showAllEpisodes.set(true);
    const allUrls = this.character()?.episode || [];
    this.loadEpisodes(allUrls);
  }
}
