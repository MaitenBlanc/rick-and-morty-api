import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { forkJoin, map, Observable } from 'rxjs';
import { Character, CharacterResponse } from '../models/character.model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiURL = 'https://rickandmortyapi.com/api/character';
  private http = inject(HttpClient);

  getCharacters(page: number, name: string = ''): Observable<CharacterResponse> {
    const url = `${this.apiURL}/?page=${page}&name=${name}`;

    return this.http.get<CharacterResponse>(url);
  }

  getCharacterById(id: number): Observable<any> {
    return this.http.get(`${this.apiURL}/${id}`);
  }

  getEpisodesMetadata(urls: string[]): Observable<any[]> {
    const idsArray = urls.map((url) => url.split('/').pop() as string);
    const ids = idsArray.join(',');

    return this.http.get<any[]>(`${this.apiURL.replace('character', 'episode')}/${ids}`);
  }

  getGlobalCounts() {
    return forkJoin({
      characters: this.http.get<any>(this.apiURL),
      episodes: this.http.get<any>('https://rickandmortyapi.com/api/episode'),
    }).pipe(
      map((res) => ({
        characters: res.characters.info.count,
        episodes: res.episodes.info.count,
      })),
    );
  }

  GetCharactersFromUrls(urls: string[]): Observable<Character[]> {
    const ids = urls.map((url) => url.split('/').pop());
    const joinedIds = ids.join(',');

    return this.http.get<Character[]>(`${this.apiURL}/${joinedIds}`);
  }
}
