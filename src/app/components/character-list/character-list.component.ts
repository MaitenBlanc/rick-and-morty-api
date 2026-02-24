import { Component, inject, OnInit, signal } from '@angular/core';
import { CharacterCard } from '../character-card/character-card.component';
import { Character } from '../../core/models/character.model';
import { ApiService } from '../../core/services/api.services';
import { PaginationComponent } from '../pagination/pagination.component';
import { Router } from '@angular/router';
import { Breadcrumb } from '../breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-character-list',
  standalone: true,
  imports: [CharacterCard, Breadcrumb, PaginationComponent],
  templateUrl: './character-list.component.html',
  styleUrl: './character-list.component.css',
})
export class CharacterList implements OnInit {
  characters = signal<Character[]>([]);
  currentPage = signal<number>(1);
  searchTerm = signal<string>('');

  private characterService = inject(ApiService);
  private router = inject(Router);

  ngOnInit(): void {
    this.loadCharacters();
  }

  loadCharacters(): void {
    this.characterService.getCharacters(this.currentPage(), this.searchTerm()).subscribe({
      next: (data) => {
        this.characters.set(data.results);
      },
      error: (err) => {
        (console.error('Error loading characters:', err), this.characters.set([]));
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

    if (nextPage >= 1) {
      this.currentPage.set(nextPage);
      this.loadCharacters();
    }
  }

  navigateToDetails(id: number): void {
    this.router.navigate(['/characters', id]);
  }
}
