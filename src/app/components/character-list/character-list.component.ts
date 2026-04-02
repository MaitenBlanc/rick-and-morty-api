import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CharacterCard } from '../character-card/character-card.component';
import { Character } from '../../core/models/character.model';
import { ApiService } from '../../core/services/api.service';
import { Router } from '@angular/router';
import { Breadcrumb } from '../../shared/components/breadcrumb/breadcrumb.component';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-character-list',
  standalone: true,
  imports: [CharacterCard, Breadcrumb, PaginationComponent],
  templateUrl: './character-list.component.html',
  styleUrl: './character-list.component.css',
})
export class CharacterList implements OnInit {
  public characters = signal<Character[]>([]);
  public currentPage = signal<number>(1);
  public totalPages = signal(0);
  public searchTerm = signal<string>('');

  private characterService = inject(ApiService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.loadCharacters();
  }

  loadCharacters(): void {
    this.characterService
      .getCharacters(this.currentPage(), this.searchTerm())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.characters.set(data.results);
          this.totalPages.set(data.info.pages);
          // console.log(data);
        },
        error: (err) => {
          console.error('Error loading characters:', err);
          this.characters.set([]);
          this.totalPages.set(0);
        },
      });
  }

  onSearch(name: string): void {
    this.searchTerm.set(name);
    this.currentPage.set(1);
    this.loadCharacters();
  }

  changePage(next: number): void {
    const nextPage = this.currentPage() + next;

    if (nextPage >= 1 && nextPage <= this.totalPages()) {
      this.currentPage.set(nextPage);
      this.loadCharacters();
    }
  }

  navigateToDetails(id: number): void {
    this.router.navigate(['/characters', id]);
  }
}
