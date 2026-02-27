import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { forkJoin, map, Observable } from 'rxjs';
import { Character } from '../models/character.model';
import { RESTApi } from '../models/api.interface';
import { CharacterMapper } from '../mappers/character.mapper';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiURL = 'https://rickandmortyapi.com/api/character';
  private http = inject(HttpClient);

  getCharacters(page: number, name: string = ''): Observable<Character[]> {
    const url = `${this.apiURL}/?page=${page}&name=${name}`;

    return this.http
      .get<RESTApi>(url)
      .pipe(map((response) => CharacterMapper.mapApiCharactersToEntityArray(response.results)));
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
      characters: this.http.get<any>('https://rickandmortyapi.com/api/character'),
      episodes: this.http.get<any>('https://rickandmortyapi.com/api/episode'),
    }).pipe(
      map((res) => ({
        characters: res.characters.info.count,
        episodes: res.episodes.info.count,
      })),
    );
  }
}
