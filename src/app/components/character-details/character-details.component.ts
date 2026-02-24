import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Character } from '../../core/models/character.model';
import { ApiService } from '../../core/services/api.services';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../shared/translate.pipe';
import { Breadcrumb } from '../breadcrumb/breadcrumb.component';

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

  character = signal<Character | null>(null);
  episodes = signal<any[]>([]);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.apiService.getCharacterById(+idParam).subscribe({
        next: (data) => {
          this.character.set(data);
          this.loadEpisodes(data.episode);
        },
        error: (err) => console.error('Error: ', err),
      });
    }
  }

  loadEpisodes(urls: string[]): void {
    const utlsToFetch = urls.slice(0, 15);
    this.apiService.getEpisodesMetadata(utlsToFetch).subscribe({
      next: (data) => {
        this.episodes.set(Array.isArray(data) ? data : [data]);
      },
      error: (err) => console.error('Error: ', err),
    });
  }
}
