import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiURL = 'https://rickandmortyapi.com/api/character';
  private http = inject(HttpClient);

  getCharacters(page: number, name: string = ''): Observable<any> {
    return this.http.get(`${this.apiURL}/?page=${page}`);
  }

  getCharacterById(id: number): Observable<any> {
    return this.http.get(`${this.apiURL}/${id}`);
  }

  getEpisodesMetadata(urls: string[]): Observable<any[]> {
    const idsArray = urls.map((url) => url.split('/').pop() as string);
    const ids = idsArray.join(',');

    return this.http.get<any[]>(`${this.apiURL.replace('character', 'episode')}/${ids}`);
  }
}
