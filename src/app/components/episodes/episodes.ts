import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { EpisodeService } from '../../core/services/episode.service';
import { Episode } from '../../core/interfaces/episode.interface';
import { Breadcrumb } from '../../shared/components/breadcrumb/breadcrumb.component';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { FavoriteService } from '../../core/services/favorite.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'episodes',
  imports: [CommonModule, Breadcrumb, PaginationComponent, MatTooltipModule, RouterLink],
  templateUrl: './episodes.html',
  styleUrl: './episodes.css',
})
export class Episodes implements OnInit {
  private episodeService = inject(EpisodeService);
  public favoriteService = inject(FavoriteService);
  private destroyRef = inject(DestroyRef);

  public searchTerm = signal<string>('');
  public episodes = signal<Episode[]>([]);
  public currentPage = signal(1);
  public totalPages = signal(0);
  public isLoading = signal(false);

  ngOnInit(): void {
    this.loadEpisodes(this.currentPage());
  }

  loadEpisodes(page: number, name: string = this.searchTerm()) {
    this.isLoading.set(true);
    this.episodeService
      .getEpisodes(page, name)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (resp) => {
          this.episodes.set(resp.results);
          this.totalPages.set(resp.info.pages);
          this.currentPage.set(page);
          this.isLoading.set(false);
        },
        error: () => {
          this.episodes.set([]);
          this.totalPages.set(0);
          this.isLoading.set(false);
        },
      });
  }

  changePage(next: number): void {
    const nextPage = this.currentPage() + next;

    if (nextPage >= 1 && nextPage <= this.totalPages()) {
      this.currentPage.set(nextPage);
      this.loadEpisodes(nextPage);
    }
  }

  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.loadEpisodes(this.currentPage() + 1);
    }
  }

  prevPage() {
    if (this.currentPage() > 1) {
      this.loadEpisodes(this.currentPage() - 1);
    }
  }

  onSearch(name: string): void {
    this.searchTerm.set(name);
    this.currentPage.set(1);
    this.loadEpisodes(1, name);
  }
}
