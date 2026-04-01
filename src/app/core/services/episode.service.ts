import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { Episode, EpisodeResponse } from '../interfaces/episode.interface';

@Injectable({
  providedIn: 'root',
})
export class EpisodeService {
  private http = inject(HttpClient);
  private baseUrl = 'https://rickandmortyapi.com/api/episode';

  getEpisodes(page: number = 1, name: string | ''): Observable<EpisodeResponse> {
    const url = `${this.baseUrl}?page=${page}`;
    return this.http.get<EpisodeResponse>(url);
  }

  getEpisodeById(id: string | number): Observable<Episode> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<Episode>(url);
  }

  getEpisodesMultiple(ids: number[]): Observable<Episode[]> {
    if (ids.length === 0) return of([]);

    const idsString = ids.join(',');
    const url = `${this.baseUrl}/${idsString}`;

    return this.http.get<Episode[]>(url).pipe(map((res) => (Array.isArray(res) ? res : [res])));
  }
}
